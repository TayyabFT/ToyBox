import React, { useState, useEffect, useRef } from 'react';
import { eventsApi } from "@/api/events.api";
import type { EventResponse } from "@/types/api";
import { isApiError, isNetworkFailure } from "@/lib/apiError";
import { toResourceId } from "@/lib/resourceId";
import { EventCardSkeletonGrid } from "./EventCardSkeleton";
import { EventsEmptyState } from "./EventsEmptyState";
interface EventItem {
  id: string;
  tag: string;
  image: string;
  title: string;
  date: string;
  confirmedCount: number;
  totalCount: number;
  rsvp: number;
  wait: number;
  progress: number;
  status: string; // raw status from API e.g. "draft" | "confirmed" | "past"
}

interface EventsCardProps {
  onManageClick: (event: EventItem) => void;
  refreshTrigger?: number;
}

export function EventsCard({ onManageClick, refreshTrigger = 0 }: EventsCardProps) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isInitialLoad = useRef(true);
  // Tracks which event id is currently being updated to show per-card loading
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  // Active filter: null = ALL
  const [activeFilter, setActiveFilter] = useState<"draft" | "confirmed" | "past" | null>(null);

  useEffect(() => {
  async function fetchEvents() {
    try {
      if (isInitialLoad.current) setIsLoading(true);
      setError(null);
      
      const response = await eventsApi.getEvents();
      const rawEvents = response.data?.events ?? [];
      
      const formattedEvents: EventItem[] = rawEvents.map((apiEvent: EventResponse) => {
        const start = apiEvent.startsAt ? new Date(apiEvent.startsAt) : null;
        const end = apiEvent.endsAt ? new Date(apiEvent.endsAt) : null;
        const attendingCount = apiEvent.attendingCount ?? 0;
        const capacity = apiEvent.capacity ?? 0;
        const waitlistCount = apiEvent.waitlistCount ?? 0;
        
        const dateString = start 
          ? `${start.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase()} · ${start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} — ${end ? end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : 'TBD'}`
          : "DATE TBD";

        return {
          id: toResourceId(apiEvent.id),
          tag: apiEvent.status?.toUpperCase() || "UPCOMING",
          image: apiEvent.imageUrl || "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600&auto=format&fit=crop",
          title: apiEvent.location ? `${apiEvent.title} — ${apiEvent.location}` : apiEvent.title,
          date: dateString,
          confirmedCount: attendingCount,
          totalCount: capacity,
          rsvp: attendingCount,
          wait: waitlistCount,
          progress: capacity ? (attendingCount / capacity) * 100 : 0,
          status: apiEvent.status?.toLowerCase() || "draft",
        };
      });

      setEvents(formattedEvents);
      isInitialLoad.current = false;
    } catch (err) {
      console.error("Failed to parse live events payload:", err);
      const isOffline =
        isNetworkFailure(err) || (isApiError(err) && err.status === 0);
      setError(isOffline ? "No network connection" : "Unable to load events");
    } finally {
      setIsLoading(false);
    }
  }

  fetchEvents();
}, [refreshTrigger]);

  // Promotes a draft event to confirmed via PATCH, then updates local state
  async function handleConfirmDraft(event: EventItem) {
    if (updatingId) return; // prevent double-clicks
    setUpdatingId(event.id);
    try {
      await eventsApi.updateEvent(event.id, { status: "confirmed" });
      setEvents((prev) =>
        prev.map((e) =>
          e.id === event.id
            ? { ...e, status: "confirmed", tag: "CONFIRMED" }
            : e
        )
      );
    } catch (err) {
      console.error("Failed to confirm event:", err);
    } finally {
      setUpdatingId(null);
    }
  }

  // Derived list — null filter means show all
  const visibleEvents = activeFilter
    ? events.filter((e) => e.status === activeFilter)
    : events;

  // Helper: button classes based on whether this filter is active
  const filterBtnClass = (filter: typeof activeFilter) =>
    filter === activeFilter
      ? "font-roboto cursor-pointer rounded-full px-4 py-2 text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors bg-primary text-dark"
      : "font-roboto cursor-pointer rounded-full px-4 py-2 text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors border border-[#D4A847]/20 text-primary hover:border-[#D4A847]/50";

  if (isLoading) {
    return <EventCardSkeletonGrid />;
  }

  const emptyMessage = error
    ? error
    : activeFilter === "confirmed"
      ? "No confirmed events"
      : activeFilter === "draft"
        ? "No draft events"
        : activeFilter === "past"
          ? "No past events"
          : "No live events found";

  return (
    <div className="space-y-6">
      {/* Filters Navigation Panel */}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setActiveFilter(null)} className={filterBtnClass(null)}>
          ALL
        </button>
        <button type="button" onClick={() => setActiveFilter("confirmed")} className={filterBtnClass("confirmed")}>
          CONFIRMED
        </button>
        <button type="button" onClick={() => setActiveFilter("draft")} className={filterBtnClass("draft")}>
          DRAFTS
        </button>
        <button type="button" onClick={() => setActiveFilter("past")} className={filterBtnClass("past")}>
          PAST
        </button>
      </div>

      {error || visibleEvents.length === 0 ? (
        <EventsEmptyState message={emptyMessage} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleEvents.map((event) => (
            <div key={event.id} className="bg-[#121314] rounded-xl overflow-hidden border border-zinc-900 flex flex-col justify-between">
              
              {/* Top Banner Image Section */}
              <div className="relative h-48 w-full bg-zinc-800">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover opacity-80"
                />
                <span className={`absolute top-4 left-4 bg-black/70 backdrop-blur-md text-[10px] font-bold tracking-widest px-3 py-1 rounded-full border ${
                  event.status === "confirmed"
                    ? "text-[#7DBFA0] border-[#7DBFA0]/30"
                    : "text-[#D4A847] border-[#D4A847]/20"
                }`}>
                  {event.tag}
                </span>
                <span className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md text-[10px] font-bold tracking-wider text-white px-3 py-1 rounded-full border border-zinc-800">
                  {event.confirmedCount} / {event.totalCount} CONFIRMED
                </span>
              </div>

              {/* Bottom Content Area */}
              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold tracking-widest text-primary uppercase">
                    {event.date}
                  </p>
                  <h3 className="text-lg font-normal tracking-normal text-zinc-100 font-copperplate">
                    {event.title}
                  </h3>
                </div>

                {/* Custom Status Progress Bar */}
                <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#D4A847] h-full transition-all duration-500" 
                    style={{ width: `${event.progress}%` }}
                  />
                </div>

                {/* Stats Footer & Wired Action Target */}
                <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-zinc-400 pt-2">
                  <div className="flex gap-4">
                    <span>RSVP: <strong className="text-white">{event.rsvp}</strong></span>
                    <span>WAIT: <strong className="text-white">{event.wait}</strong></span>
                  </div>

                  {event.status === "draft" ? (
                    // Draft → clicking confirms the event via PATCH
                    <button
                      type="button"
                      disabled={updatingId === event.id}
                      onClick={() => handleConfirmDraft(event)}
                      className="flex items-center gap-1.5 border border-zinc-700 text-zinc-400 cursor-pointer hover:border-[#D4A847]/50 hover:text-[#D4A847] px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updatingId === event.id ? (
                        <>
                          <span className="w-3 h-3 border border-zinc-400/30 border-t-zinc-400 rounded-full animate-spin" />
                          Confirming...
                        </>
                      ) : (
                        "Draft"
                      )}
                    </button>
                  ) : (
                    // Confirmed / any other status → opens management drawer
                    <button
                      type="button"
                      onClick={() => onManageClick(event)}
                      className="border border-[#D4A847]/20 text-[#D4A847] cursor-pointer hover:border-[#D4A847]/50 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all"
                    >
                      Manage
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}