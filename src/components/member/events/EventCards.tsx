"use client";

import { useState } from "react";
import type { EventItem } from "./types";
import { AttendeeAvatarStack } from "@/components/member/common/AttendeeAvatarStack";

// ── Tag tone → Tailwind classes using CSS vars ─────────────────────────────

const TAG_TONE: Record<string, string> = {
  gold: "border border-accent/60 bg-dark/90 text-accent",
  teal: "border border-teal/55 bg-dark/70 text-teal",
  pink: "border border-pink/55 bg-dark/70 text-pink",
};

function AvatarStack({ count, names, initials }: { count: number; names?: string[]; initials?: string[] }) {
  return (
    <div className="flex items-center gap-2.5">
      <AttendeeAvatarStack count={count} names={names} initials={initials} />
      <span className="font-roboto text-[10px] tracking-[0.04em] text-secondary">
        {count} members attending
      </span>
    </div>
  );
}

// ── Shared Card Props ─────────────────────────────────────────────────────────

type CardProps = {
  event: EventItem;
  rsvpLoading?: boolean;
  favoriteLoading?: boolean;
  onRsvpToggle?: (id: string, currentStatus: string | null) => void;
  onFavoriteToggle?: (id: string, currentFavorite: boolean) => void;
  onClick?: () => void;
};

// ── Image Placeholder ─────────────────────────────────────────────────────────

function EventImagePlaceholder({ title }: { title: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/5 via-accent/8 to-accent/5">
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        className="text-accent/20"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
        <path d="M3 16L8 11L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 15L15 12L21 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ── Featured Card ─────────────────────────────────────────────────────────────

export function EventsFeaturedCard({ 
  event, 
  rsvpLoading = false, 
  favoriteLoading = false,
  onRsvpToggle, 
  onFavoriteToggle 
}: CardProps) {
  const tagClass = TAG_TONE[event.tagTone] ?? TAG_TONE.gold;
  const [imageError, setImageError] = useState(false);

  // Build time label: "19:00 — 23:00" or just "19:00"
  const timeDisplay = event.timeEndLabel
    ? `${event.timeLabel} — ${event.timeEndLabel}`
    : event.timeLabel;

  return (
    <div className="events-featured-card overflow-hidden rounded-[18px] border border-accent/10 bg-card">
      <div className="flex flex-col md:flex-row">
        {/* ── Left: image ────────────────────────────────────────────── */}
        <div className="relative h-[220px] overflow-hidden md:h-auto md:min-h-[260px] md:w-[45%]">
          {!imageError && event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="h-full w-full object-cover object-center"
              onError={() => setImageError(true)}
            />
          ) : (
            <EventImagePlaceholder title={event.title} />
          )}
          {/* Tag pill – top-left */}
          <span
            className="font-Roboto absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-dark uppercase"
          >
            {event.tag}
          </span>
        </div>

        {/* ── Right: info panel ──────────────────────────────────────── */}
        <div className="flex flex-1 flex-col justify-between gap-4 p-5 md:p-6">
          {/* Top block: date + title + description + detail lines */}
          <div className="space-y-3">
            {/* Date · time · location */}
            <p className="font-roboto text-[11px] tracking-[0.16em] uppercase">
              <span className="font-Roboto text-primary">{event.dateLabel}</span>
              {timeDisplay && (
                <span className="font-Roboto text-primary"> · {timeDisplay}</span>
              )}
            </p>

            {/* Title */}
            <h2 className="font-copperplate text-[20px] font-normal leading-snug tracking-[0.02em] text-foreground uppercase md:text-[22px]">
              {event.titlePrefix}{" "}
              {event.titleHighlight && (
                <span>{event.titleHighlight}</span>
              )}
            </h2>

            {/* Description paragraph */}
            {event.description && (
              <p className="font-Roboto text-[14px] leading-relaxed text-secondary/75">
                {event.description}
              </p>
            )}

            {/* Detail lines with inline SVG icons */}
            {event.detailLines && event.detailLines.length > 0 && (
              <div className="space-y-2 pt-1">
                {event.detailLines.map((line, i) => (
                  <div
                    key={i}
                    className="font-roboto flex items-start gap-2.5 text-[11px] leading-snug text-secondary/70"
                  >
                    {/* Location pin */}
                    {line.icon === "pin" && (
                      <svg
                        width="15"
                        height="14"
                        viewBox="0 0 12 13"
                        fill="none"
                        className="mt-px shrink-0 text-primary"
                      >
                        <circle cx="6" cy="5.5" r="4" stroke="currentColor" strokeWidth="1" />
                        <circle cx="6" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1" />
                        <path d="M6 9.5V12.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                      </svg>
                    )}
                    {/* Users / people */}
                    {line.icon === "users" && (
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 13 12"
                        fill="none"
                        className="mt-px shrink-0 text-primary"
                      >
                        <path
                          d="M5 7.5C3.067 7.5 1.5 6.433 1.5 5.5C1.5 4.672 2.672 4 5 4C7.328 4 8.5 4.672 8.5 5.5C8.5 6.433 6.933 7.5 5 7.5Z"
                          stroke="currentColor"
                          strokeWidth="0.9"
                        />
                        <path
                          d="M5 4C6.105 4 7 3.328 7 2.5C7 1.672 6.105 1 5 1C3.895 1 3 1.672 3 2.5C3 3.328 3.895 4 5 4Z"
                          stroke="currentColor"
                          strokeWidth="0.9"
                        />
                        <path
                          d="M8.5 5.5V10.5H1.5V5.5"
                          stroke="currentColor"
                          strokeWidth="0.9"
                          strokeLinecap="round"
                        />
                        <path d="M9 2.5C10.1 2.5 11 3.172 11 4C11 4.828 10.1 5.5 9 5.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
                        <path d="M11 10.5V5.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
                      </svg>
                    )}
                    {/* Priority star */}
                    {line.icon === "badge" && (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 12 12"
                        fill="none"
                        className="mt-px shrink-0 text-primary"
                      >
                        <path
                          d="M6 1L7.29 4.26L10.8 4.46L8.09 6.74L8.99 10.14L6 8.2L3.01 10.14L3.91 6.74L1.2 4.46L4.71 4.26L6 1Z"
                          stroke="currentColor"
                          strokeWidth="0.9"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    <span className="font-Roboto text-[13px] text-foreground-soft">{line.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom bar: avatars + action buttons */}
          <div className="flex items-center justify-between gap-3 border-t border-accent/10 pt-4">
            {/* {event.attendingCount !== undefined && (
              <AvatarStack count={event.attendingCount} />
            )} */}

            <div className="flex items-center gap-2 shrink-0">
              {/* Primary RSVP action */}
              <button
                type="button"
                disabled={rsvpLoading}
                onClick={() => onRsvpToggle?.(event.id, event.userStatus ?? null)}
                className={
                  event.userStatus === "going"
                    ? "font-Roboto flex items-center gap-1.5 rounded-full bg-accent px-5 py-[9px] text-[12px] font-bold tracking-[0.1em] text-dark uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
                    : "font-Roboto rounded-full border border-primary/35 bg-primary/10 px-5 py-[9px] text-[11px] font-bold tracking-[0.1em] text-primary uppercase transition-colors hover:bg-primary/18 disabled:opacity-60"
                }
              >
                {rsvpLoading ? (
                  <span className="flex items-center gap-1.5">
                    <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Loading…
                  </span>
                ) : event.userStatus === "going" ? (
                  <span className="flex items-center gap-1.5">
                    RSVP’D · GOING
                    <svg width="13" height="13" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4.5 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                ) : (
                  "RSVP"
                )}
              </button>

              {/* Bookmark icon button */}
              <button
                type="button"
                aria-label={event.isFavorite ? "Remove bookmark" : "Save event"}
                disabled={favoriteLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  onFavoriteToggle?.(event.id, event.isFavorite ?? false);
                }}
                className={`flex size-10 items-center justify-center rounded-full border-[1.5px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  event.isFavorite
                    ? "border-primary/60 bg-primary/10 text-primary"
                    : "border-primary/25 bg-elevated text-secondary hover:border-primary/40 hover:text-primary"
                }`}
              >
                {favoriteLoading ? (
                  <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : event.isFavorite ? (
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
                    <path
                      d="M2.5 1.5H10.5V12L6.5 9L2.5 12V1.5Z"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path
                      d="M2.5 1.5H10.5V12L6.5 9L2.5 12V1.5Z"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Grid Card ─────────────────────────────────────────────────────────────────

export function EventsGridCard({ event, rsvpLoading = false, onRsvpToggle, onClick }: CardProps) {
  const tagClass = TAG_TONE[event.tagTone] ?? TAG_TONE.gold;
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-[16px] border border-accent/10 bg-card transition-all duration-300 hover:border-accent/25"
    >
      {/* Image */}
      <div className="relative h-[210px] w-full overflow-hidden">
        {!imageError && event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <EventImagePlaceholder title={event.title} />
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0) 100%)",
          }}
        />
        {/* Tag pill */}
        <span
          className={`font-Roboto absolute left-3 top-3 rounded-full px-3 py-1 text-[9px] font-bold tracking-[0.16em] uppercase ${tagClass}`}
        >
          {event.tag}
        </span>
      </div>

      {/* Info */}
      <div className="space-y-2 px-4 py-4">
        <h3 className="font-copperplate text-[15px] font-normal leading-snug tracking-[0.02em] text-foreground uppercase">
          {event.titlePrefix}{" "}
          {event.titleHighlight && (
            <span className="text-primary">{event.titleHighlight}</span>
          )}
        </h3>
        <p className="font-Roboto text-[9.5px] font-medium tracking-[0.14em] uppercase">
          <span className="text-primary">{event.dateLabel}</span>
          {event.timeLabel && (
            <span className="text-secondary/55 text-[9px]"> — {event.timeLabel}</span>
          )}
        </p>
      </div>
    </div>
  );
}
