"use client";

import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchMemberEvents,
  joinEvent,
  leaveEvent,
  setFilter,
} from "@/store/slices/memberEventsSlice";
import { showError, showSuccess } from "@/lib/toast";
import { EventsFilterTabs } from "./EventsFilterTabs";
import { EventsFeaturedCard, EventsGridCard } from "./EventCards";
import type { EventFilter } from "./types";

// ── Skeleton ──────────────────────────────────────────────────────────────────

function EventsSkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[16px] border border-accent/10 bg-card">
      <div className="h-[210px] w-full bg-elevated" />
      <div className="space-y-2 px-4 py-4">
        <div className="h-2.5 w-24 rounded bg-elevated" />
        <div className="h-4 w-3/4 rounded bg-elevated" />
        <div className="h-2.5 w-1/2 rounded bg-elevated" />
      </div>
    </div>
  );
}

function EventsFeaturedSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[18px] border border-accent/10 bg-card">
      <div className="flex flex-col md:flex-row">
        <div className="h-[220px] bg-elevated md:h-auto md:w-[45%]" />
        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="space-y-3">
            <div className="h-2.5 w-32 rounded bg-elevated" />
            <div className="h-6 w-2/3 rounded bg-elevated" />
            <div className="space-y-1.5">
              <div className="h-2.5 rounded bg-elevated" />
              <div className="h-2.5 w-5/6 rounded bg-elevated" />
            </div>
          </div>
          <div className="mt-auto flex justify-between border-t border-accent/10 pt-4">
            <div className="h-7 w-32 rounded-full bg-elevated" />
            <div className="h-9 w-28 rounded-full bg-elevated" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function MemberEvents() {
  const dispatch = useAppDispatch();
  const {
    featured,
    thisWeek,
    nextMonth,
    otherUpcoming,
    past,
    activeFilter,
    loading,
    loaded,
    error,
    rsvpLoading,
  } = useAppSelector((state) => state.memberEvents);

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // ── Fetch ────────────────────────────────────────────────────────────────

  const loadEvents = useCallback(
    async (filter: EventFilter) => {
      // Map UI filter → API category
      const category = filter === "all" ? "all" : filter;
      const result = await dispatch(fetchMemberEvents(category));
      if (fetchMemberEvents.rejected.match(result)) {
        showError((result.payload as string) ?? "Failed to load events");
      }
    },
    [dispatch],
  );

  // Initial load
  useEffect(() => {
    loadEvents(activeFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Filter change ────────────────────────────────────────────────────────

  const handleFilterChange = (filter: EventFilter) => {
    setSelectedEventId(null); // Reset manually selected event on filter change
    dispatch(setFilter(filter));
    loadEvents(filter);
  };

  // ── RSVP actions ─────────────────────────────────────────────────────────

  const handleRsvpToggle = async (eventId: string, currentStatus: string | null) => {
    if (currentStatus === "going") {
      const result = await dispatch(leaveEvent(eventId));
      if (leaveEvent.fulfilled.match(result)) {
        showSuccess("You have cancelled your RSVP");
      } else {
        showError((result.payload as string) ?? "Failed to cancel RSVP");
      }
    } else {
      const result = await dispatch(joinEvent(eventId));
      if (joinEvent.fulfilled.match(result)) {
        showSuccess("You're going! Event added to your diary");
      } else {
        showError((result.payload as string) ?? "Failed to RSVP");
      }
    }
  };

  // ── Render helpers ────────────────────────────────────────────────────────

  // Compute the event currently displayed as the active hero card
  const activeHero =
    (selectedEventId &&
      [...featured, ...thisWeek, ...nextMonth, ...otherUpcoming, ...past].find(
        (e) => e.id === selectedEventId,
      )) ||
    featured[0] ||
    thisWeek[0] ||
    nextMonth[0] ||
    otherUpcoming[0] ||
    past[0] ||
    null;

  // Filter the currently active hero event out of all lists to prevent duplication
  const groups = [
    { id: "this-week", label: "THIS WEEK", events: thisWeek.filter((e) => e.id !== activeHero?.id) },
    { id: "next-month", label: "NEXT MONTH", events: nextMonth.filter((e) => e.id !== activeHero?.id) },
    { id: "other-upcoming", label: "UPCOMING", events: otherUpcoming.filter((e) => e.id !== activeHero?.id) },
    { id: "past-events", label: "PAST EVENTS", events: past.filter((e) => e.id !== activeHero?.id) },
  ].filter((g) => g.events.length > 0);

  const isFirstLoad = loading && !loaded;

  // ── Return ────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-8 pb-12 pt-5 sm:space-y-10">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <p className="font-roboto text-[10px] font-medium tracking-[0.24em] text-secondary uppercase">
          UPCOMING
        </p>
        <h1 className="font-copperplate text-[38px] font-light leading-none tracking-[-0.75px] uppercase sm:text-[46px]">
          <span className="text-foreground">Events</span>
        </h1>
      </div>

      {/* ── Filter tabs ──────────────────────────────────────────────────── */}
      <EventsFilterTabs active={activeFilter} onChange={handleFilterChange} />

      {/* ── Error banner (when data was loaded before but refresh fails) ── */}
      {error && loaded && (
        <div className="font-roboto flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-[12px] text-red-300">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => loadEvents(activeFilter)}
            className="ml-4 rounded-lg border border-red-400/30 px-3 py-1 text-[10px] font-semibold tracking-[0.12em] uppercase hover:border-red-400/50 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Featured hero card ───────────────────────────────────────────── */}
      {isFirstLoad ? (
        <EventsFeaturedSkeleton />
      ) : activeHero ? (
        <EventsFeaturedCard
          event={activeHero}
          rsvpLoading={!!rsvpLoading[activeHero.id]}
          onRsvpToggle={handleRsvpToggle}
        />
      ) : null}

      {/* ── Grouped event grids ──────────────────────────────────────────── */}
      {isFirstLoad ? (
        <>
          {[
            { id: "this-week", label: "THIS WEEK" },
            { id: "next-month", label: "NEXT MONTH" },
          ].map((g) => (
            <section key={g.id} className="space-y-5">
              <div className="space-y-1.5">
                <div className="h-7 w-40 animate-pulse rounded bg-elevated" />
                <div className="h-2.5 w-16 animate-pulse rounded bg-elevated" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <EventsSkeletonCard key={i} />
                ))}
              </div>
            </section>
          ))}
        </>
      ) : groups.length > 0 ? (
        groups.map((group) => (
          <section key={group.id} className="space-y-5">
            <div className="space-y-1.5">
              <h2 className="font-copperplate text-[24px] font-normal tracking-[0.04em] text-primary uppercase">
                {group.label}
              </h2>
              <p className="font-roboto text-[9px] font-medium tracking-[0.18em] text-secondary/50 uppercase">
                {group.events.length}{" "}
                {group.events.length === 1 ? "EVENT" : "EVENTS"}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.events.map((event) => (
                <EventsGridCard
                  key={event.id}
                  event={event}
                  rsvpLoading={!!rsvpLoading[event.id]}
                  onRsvpToggle={handleRsvpToggle}
                  onClick={() => {
                    setSelectedEventId(event.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              ))}
            </div>
          </section>
        ))
      ) : (
        /* Empty state */
        !loading && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-accent/10 bg-card py-16 text-center">
            <p className="font-copperplate text-[18px] text-foreground uppercase tracking-[0.05em]">
              No Events
            </p>
            <p className="font-roboto text-[12px] text-secondary/60">
              There are no events matching the selected filter.
            </p>
          </div>
        )
      )}

      {/* ── First-load full-page error (no cached data at all) ──────────── */}
      {error && !loaded && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-copperplate text-[18px] tracking-[0.06em] text-foreground uppercase">
            Events Unavailable
          </h2>
          <p className="font-roboto max-w-sm text-sm text-secondary/80">
            {error}. Please check your connection and try again.
          </p>
          <button
            type="button"
            onClick={() => loadEvents(activeFilter)}
            className="font-roboto rounded-lg border border-accent/30 bg-accent/5 px-5 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-accent uppercase transition-colors hover:border-accent/50 hover:bg-accent/10"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
