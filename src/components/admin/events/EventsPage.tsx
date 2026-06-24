"use client";

import { useState, useEffect } from "react";
import {
  AttendanceIcon,
  Calendar,
  DraftIcon,
  MemberCheckStat,
} from "@/components/common/Svgs";
import { EventsStatsRow, type EventStatItem } from "./EventsStatsRow";
import { useSetAdminPageSubtitle } from "@/lib/adminPageMeta";
import { EventsCard } from "./EventsCard";
import { EventPopup } from "./EventsPopup";
import { EventForm } from "./EventsForm";
import { eventsApi } from "@/api/events.api";
import { showError, showSuccess } from "@/lib/toast";

// Shown while the real stats are loading
const PLACEHOLDER_STATS: EventStatItem[] = [
  {
    label: "upcoming",
    value: "—",
    subtext: "Next 60 days",
    icon: <Calendar className="size-4" />,
  },
  {
    label: "Confirmed",
    value: "—",
    subtext: "filled",
    icon: <MemberCheckStat className="size-4" />,
  },
  {
    label: "Drafts",
    value: "—",
    subtext: "pending",
    icon: <DraftIcon className="size-4" />,
  },
  {
    label: "Attendance",
    value: "—",
    subtext: "vs avg",
    icon: <AttendanceIcon className="size-4" />,
  },
];

export function EventsPage() {
  useSetAdminPageSubtitle("Events");

  const [eventStats, setEventStats] = useState<EventStatItem[]>(PLACEHOLDER_STATS);

  const [refreshKey, setRefreshKey] = useState(0);

  const handleEventCreated = () => {
    setRefreshKey((key) => key + 1);
  };

  // Fetch live stats on mount and after create/update
  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await eventsApi.getStats();
        const stats = response.data;
        const attendanceRate =
          stats.attendanceRate != null && stats.attendanceRate !== ""
            ? `${stats.attendanceRate}%`
            : "—";

        setEventStats([
          {
            label: "upcoming",
            value: stats.upcoming != null ? String(stats.upcoming) : "—",
            subtext: "Next 60 days",
            trend: stats.upcomingTrend ? String(stats.upcomingTrend) : undefined,
            icon: <Calendar className="size-4" />,
          },
          {
            label: "Confirmed",
            value: stats.published != null ? String(stats.published) : "—",
            subtext: "filled",
            trend: stats.publishedTrend ? String(stats.publishedTrend) : undefined,
            icon: <MemberCheckStat className="size-4" />,
          },
          {
            label: "Drafts",
            value: stats.drafts != null ? String(stats.drafts) : "—",
            subtext: "pending",
            icon: <DraftIcon className="size-4" />,
          },
          {
            label: "Attendance",
            value: attendanceRate,
            subtext: "vs avg",
            trend: stats.attendanceVsAvg
              ? String(stats.attendanceVsAvg)
              : stats.attendanceTrend
                ? String(stats.attendanceTrend)
                : undefined,
            icon: <AttendanceIcon className="size-4" />,
          },
        ]);
      } catch (err) {
        console.error("Failed to load events stats:", err);
        // Keep placeholders on error rather than crashing
      }
    }

    fetchStats();
  }, [refreshKey]);

  // State handles details management drawer/popup
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedEventData, setSelectedEventData] = useState<any>(null);
  const [isPopupLoading, setIsPopupLoading] = useState(false);

  // State handles the new creation form drawer/popup
  const [isFormOpen, setIsFormOpen] = useState(false);
  // Edit mode state — set when EDIT EVENT is clicked from the popup
  const [editEventId, setEditEventId] = useState<string | number | undefined>();
  const [editInitialData, setEditInitialData] = useState<any>(undefined);

  const handleOpenManagement = async (eventDetails: any) => {
    // Open popup immediately with basic card data while we fetch full detail
    setSelectedEventData({
      id: eventDetails.id,
      title: eventDetails.title,
      date: eventDetails.date,
      rsvpsCount: eventDetails.rsvp,
      capacity: eventDetails.totalCount,
      waitlistCount: eventDetails.wait,
      attendanceRate: Math.round((eventDetails.rsvp / eventDetails.totalCount) * 100) || 0,
      attendees: [],
      // raw fields for edit pre-fill
      _raw: null,
    });
    setIsPopupLoading(true);
    setIsPopupOpen(true);

    try {
      const response = await eventsApi.getDetail(eventDetails.id);
      const detail = response.data;

      // Map rsvpList from API — split by status into confirmed / waitlist
      const rsvpList = detail.rsvpList ?? [];

      const attendees = rsvpList.map((r) => ({
        name: r.member?.name ?? "—",
        initial: r.member?.initial ?? (r.member?.name?.charAt(0).toUpperCase() ?? "?"),
        profileImageUrl: r.member?.profileImageUrl ?? "",
        car: r.vehicle?.name ?? "—",
        status:
          r.status?.toLowerCase() === "waitlist"
            ? ("WAITLIST" as const)
            : ("CONFIRMED" as const),
      }));

      const attendingCount = detail.attendingCount ?? 0;
      const capacity = detail.capacity ?? eventDetails.totalCount;

      setSelectedEventData({
        id: eventDetails.id,
        title: detail.location
          ? `${detail.title} — ${detail.location}`
          : (detail.title ?? eventDetails.title),
        date: eventDetails.date,
        rsvpsCount: attendingCount,
        capacity,
        waitlistCount: detail.waitlistCount ?? 0,
        attendanceRate: capacity
          ? Math.round((attendingCount / capacity) * 100)
          : 0,
        attendees,
        _raw: detail,
      });
    } catch (err) {
      console.error("Failed to load event detail:", err);
      showError("Failed to load event details.");
    } finally {
      setIsPopupLoading(false);
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingUpdate, setIsSendingUpdate] = useState(false);

  const handleSendUpdate = async () => {
    if (!selectedEventData?.id) return;
    setIsSendingUpdate(true);
    try {
      await eventsApi.sendUpdate(selectedEventData.id);
      showSuccess("Update sent to RSVP'd members!");
    } catch (err) {
      console.error("Failed to send event update:", err);
      showError("Failed to send update.");
    } finally {
      setIsSendingUpdate(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEventData?.id) return;
    setIsDeleting(true);
    try {
      await eventsApi.deleteEvent(selectedEventData.id);
      showSuccess("Event successfully deleted!");
      setIsPopupOpen(false);
      handleEventCreated(); // refresh card list + stats
    } catch (err) {
      console.error("Failed to delete event:", err);
      showError("Failed to delete event.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = () => {
    if (!selectedEventData) return;
    const raw = selectedEventData._raw;
    setEditEventId(selectedEventData.id);
    setEditInitialData({
      title: raw?.title ?? "",
      category: raw?.category ?? "auctions",
      description: raw?.description ?? "",
      location: raw?.location ?? "",
      // Convert ISO → datetime-local format for the input
      startsAt: raw?.startsAt ? new Date(raw.startsAt).toISOString().slice(0, 16) : "",
      endsAt: raw?.endsAt ? new Date(raw.endsAt).toISOString().slice(0, 16) : "",
      isAllDay: raw?.isAllDay ?? false,
      imageUrl: raw?.imageUrl ?? "",
      isFeatured: raw?.isFeatured ?? true,
      capacity: raw?.capacity ?? 50,
      accessType: raw?.accessType ?? "open",
      status: raw?.status ?? "draft",
    });
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-7 p-8">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-roboto text-[11px] tracking-[0.18em] text-primary uppercase">
            — Events management
          </p>
          <h2 className="mt-2 text-4xl font-semibold font-copperplate uppercase">
            Events
          </h2>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditEventId(undefined);
            setEditInitialData(undefined);
            setIsFormOpen(true);
          }}
          className="font-roboto shrink-0 cursor-pointer rounded-full bg-primary px-6 py-3 text-[10px] font-semibold tracking-[0.16em] text-dark uppercase shadow-[0_0_28px_rgba(201,168,76,0.35)] transition-colors hover:bg-[#D4B45C]"
        >
          + add event
        </button>
      </div>

      {/* Analytics Statistics Row */}
      <EventsStatsRow stats={eventStats} />
      
      {/* Main Grid View */}
      <EventsCard
        onManageClick={handleOpenManagement}
        refreshTrigger={refreshKey}
        onEventUpdated={handleEventCreated}
      />
      
      {/* Event Creation / Edit Form Panel Drawer */}
      <EventForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditEventId(undefined);
          setEditInitialData(undefined);
        }}
        onSuccess={() => {
          handleEventCreated();
          setEditEventId(undefined);
          setEditInitialData(undefined);
        }}
        eventId={editEventId}
        initialData={editInitialData}
      />

      {/* Selected Card Management Detail Popup Drawer */}
      <EventPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        eventData={selectedEventData || undefined}
        isLoading={isPopupLoading}
        onEditClick={handleEditClick}
        onSendUpdateClick={handleSendUpdate}
        onDeleteClick={handleDeleteEvent}
        isSendingUpdate={isSendingUpdate}
        isDeleting={isDeleting}
      />
    </div>
  );
}