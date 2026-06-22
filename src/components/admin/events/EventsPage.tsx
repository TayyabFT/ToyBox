"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  ClockIcon,
  DraftIcon,
  MemberCheckStat,
  UsersGroup,
} from "@/components/common/Svgs";
import { EventsStatsRow, type EventStatItem } from "./EventsStatsRow";
import { useSetAdminPageSubtitle } from "@/lib/adminPageMeta";
import { EventsCard } from "./EventsCard";
import { EventPopup } from "./EventsPopup";
import { EventForm } from "./EventsForm";
import { eventsApi } from "@/api/events.api";

// Shown while the real stats are loading
const PLACEHOLDER_STATS: EventStatItem[] = [
  {
    label: "Scheduled Events",
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
    icon: <MemberCheckStat className="size-4" />,
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
        // Unwrap nested .data if present
        const stats = (response as any)?.data ?? response;

        setEventStats([
          {
            label: "Scheduled Events",
            value: stats.scheduledEvents != null ? String(stats.scheduledEvents) : "—",
            subtext: "Next 60 days",
            trend: stats.scheduledEventsTrend ? String(stats.scheduledEventsTrend) : undefined,
            icon: <Calendar className="size-4" />,
          },
          {
            label: "Confirmed",
            value: stats.confirmed != null ? String(stats.confirmed) : "—",
            subtext: "filled",
            trend: stats.confirmedTrend ? String(stats.confirmedTrend) : undefined,
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
            value: stats.attendanceRate != null ? `${stats.attendanceRate}%` : "—",
            subtext: "vs avg",
            trend: stats.attendanceTrend ? String(stats.attendanceTrend) : undefined,
            icon: <MemberCheckStat className="size-4" />,
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

  // State handles the new creation form drawer/popup
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleOpenManagement = (eventDetails: any) => {
    // Transform card model properties cleanly into the drawer detail requirements
    setSelectedEventData({
      title: eventDetails.title,
      date: eventDetails.date,
      rsvpsCount: eventDetails.rsvp,
      capacity: eventDetails.totalCount,
      waitlistCount: eventDetails.wait,
      attendanceRate: Math.round((eventDetails.rsvp / eventDetails.totalCount) * 100) || 0,
      attendees: [
        { name: "James Al-Farsi", car: "Ferrari 488", status: "CONFIRMED" },
        { name: "Sarah Mitchell", car: "Porsche 911 GT3", status: "CONFIRMED" },
        { name: "Omar Al-Rashid", car: "McLaren 720S", status: "CONFIRMED" },
      ],
    });
    setIsPopupOpen(true);
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
          onClick={() => setIsFormOpen(true)}
          className="font-roboto shrink-0 cursor-pointer rounded-full bg-primary px-6 py-3 text-[10px] font-semibold tracking-[0.16em] text-dark uppercase shadow-[0_0_28px_rgba(201,168,76,0.35)] transition-colors hover:bg-[#D4B45C]"
        >
          + add event
        </button>
      </div>

      {/* Analytics Statistics Row */}
      <EventsStatsRow stats={eventStats} />
      
      {/* Main Grid View */}
      <EventsCard onManageClick={handleOpenManagement} refreshTrigger={refreshKey} />
      
      {/* Event Creation Form Panel Drawer */}
      <EventForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleEventCreated}
      />

      {/* Selected Card Management Detail Popup Drawer */}
      <EventPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
        eventData={selectedEventData || undefined} 
      />
    </div>
  );
}