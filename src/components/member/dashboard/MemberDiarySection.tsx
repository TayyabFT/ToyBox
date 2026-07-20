import Link from "next/link";
import type { MemberDiaryEvent } from "./types";
import { AttendeeAvatarStack } from "@/components/member/common/AttendeeAvatarStack";
import { MemberSectionEmpty } from "./MemberSectionEmpty";
import { dashboardSectionHeadingClass, dashboardSectionHeadingPrefixClass, dashboardSectionHeadingAccentClass, dashboardSectionSubtitleClass } from "./dashboardStyles";

// ── helpers ────────────────────────────────────────────────────────────────

// Split "Dawn Drive — Hatta" → { prefix: "Dawn Drive —", highlight: "Hatta" }
// Split "Collectors' Dinner" → { prefix: "Collectors'", highlight: "Dinner" }
function splitEventTitle(title: string): { prefix: string; highlight: string } {
  const dashIdx = title.lastIndexOf("—");
  if (dashIdx !== -1) {
    return {
      prefix: title.slice(0, dashIdx + 1).trim(),
      highlight: title.slice(dashIdx + 1).trim(),
    };
  }

  const lastSpace = title.lastIndexOf(" ");
  if (lastSpace !== -1) {
    return {
      prefix: title.slice(0, lastSpace).trim(),
      highlight: title.slice(lastSpace + 1).trim(),
    };
  }

  return { prefix: title, highlight: "" };
}

// ── Featured hero card ──────────────────────────────────────────────────────

function FeaturedCard({ event }: { event: MemberDiaryEvent }) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-accent/10 bg-card">
      {/* Hero image */}
      <div className="relative h-[240px] w-full overflow-hidden bg-surface">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-full w-full object-cover object-center"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : null}

        {/* Placeholder — shown when no image */}
        {!event.imageUrl && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
              <rect width="48" height="48" rx="12" fill="rgba(197,160,89,0.06)" />
              <path d="M12 34L16 26L20 30L26 22L36 34H12Z" stroke="rgba(197,160,89,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="18" cy="20" r="3" stroke="rgba(197,160,89,0.35)" strokeWidth="1.5" />
            </svg>
            <span className="font-roboto text-[9px] tracking-[0.14em] text-secondary/40 uppercase">No image available</span>
          </div>
        )}

        {/* Bottom-up gradient */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.08) 100%)",
          }}
        />

        {/* Tag — top left */}
        <span className="font-roboto absolute left-3.5 top-3.5 rounded-full bg-accent px-3 py-1 text-[9px] font-bold tracking-[0.18em] text-dark uppercase">
          {event.tag}
        </span>

        {/* Date + time + title overlay */}
        <div className="absolute bottom-0 left-0 right-0 space-y-1 p-3 sm:space-y-1.5 sm:p-4">
          <p className="font-roboto text-[8px] sm:text-[9px] tracking-[0.14em] text-accent uppercase">
            {event.dateShort} · {event.time}
          </p>
          <h3 className="font-roboto text-[13px] sm:text-[16px] font-bold leading-tight tracking-[0.03em] text-white uppercase">
            {event.title}
          </h3>
        </div>
      </div>

      {/* Bottom bar: attendees + action */}
      <div className="flex items-center justify-between gap-3 bg-card px-4 py-3.5">
        {/* Avatars + attending count */}
        {event.attendingCount != null && event.attendingCount > 0 && (
          <div className="flex items-center gap-2">
            <AttendeeAvatarStack
              count={event.attendingCount}
              names={event.attendingMembers?.map((member) => member.name)}
              initials={event.attendingMembers?.map((member) => member.initial)}
            />
            <span className="font-roboto text-[10px] tracking-[0.04em] text-secondary/80">
              {event.attendingCount} attending
            </span>
          </div>
        )}

        {/* Going / RSVP button */}
        {event.userStatus === "going" ? (
          <button
            type="button"
            className="font-roboto ml-auto flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-[9px] font-bold tracking-[0.14em] text-dark uppercase"
          >
            GOING
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5L4.5 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : (
          <Link
            href="/member/events"
            className="font-roboto ml-auto rounded-full border border-accent/30 bg-accent/8 px-4 py-1.5 text-[9px] font-bold tracking-[0.14em] text-accent uppercase transition-colors hover:bg-accent/15"
          >
            RSVP
          </Link>
        )}
      </div>
    </div>
  );
}

// ── List row ────────────────────────────────────────────────────────────────

function DiaryRow({ event }: { event: MemberDiaryEvent }) {
  const { prefix, highlight } = splitEventTitle(event.title);

  return (
    <Link
      href="/member/events"
      className="flex items-center gap-3.5 rounded-[16px] border border-white/6 card-view px-4 py-3.5 transition-colors hover:border-accent/20"
    >
      {/* Date column */}
      <div className="flex w-8 shrink-0 flex-col items-center gap-0.5 sm:w-10">
        <span className="font-roboto text-[8px] sm:text-[9px] font-medium tracking-[0.12em] text-accent uppercase">
          {event.dayName}
        </span>
        <span className="font-roboto text-[20px] sm:text-[24px] font-light leading-none text-foreground">
          {event.dayLabel}
        </span>
      </div>

      {/* Divider */}
      <div className="h-11 w-px shrink-0 bg-white/8" />

      {/* Title + subtitle */}
      <div className="min-w-0 flex-1 space-y-1">
        <p className="font-roboto truncate text-[11px] font-semibold tracking-[0.05em] text-foreground uppercase">
          {prefix}
          {highlight && (
            <>
              {" "}
              <span className="text-accent">{highlight}</span>
            </>
          )}
        </p>
        <p className="font-roboto truncate text-[9px] tracking-[0.08em] text-secondary/60 uppercase">
          {event.location}
        </p>
      </div>

      {/* Chevron */}
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 text-secondary/40">
        <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

// ── Section ─────────────────────────────────────────────────────────────────

export function MemberDiarySection({ events }: { events: MemberDiaryEvent[] }) {
  const featured = events.find((e) => e.isFeatured) ?? events[0];
  const list = events.filter((e) => e.id !== featured?.id);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className={dashboardSectionHeadingClass}>
            <span className={dashboardSectionHeadingPrefixClass}>Your </span>
            <span className={dashboardSectionHeadingAccentClass}>Diary</span>
          </h2>
          <p className={dashboardSectionSubtitleClass}>
            Forthcoming Experiences
          </p>
        </div>
        <Link
          href="/member/events"
          className="flex shrink-0 items-center gap-1 rounded-full border border-accent/30 bg-transparent px-3 py-1.5 transition-all hover:border-accent/50 hover:bg-accent/5"
        >
          <span className="font-roboto text-[10px] font-semibold tracking-[0.16em] text-accent uppercase">
            All
          </span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3.5 2L7 5L3.5 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="stroke-accent" />
          </svg>
        </Link>
      </div>

      {/* Featured card */}
      {featured && <FeaturedCard event={featured} />}

      {/* Empty state */}
      {!featured && (
        <MemberSectionEmpty
          title="No Upcoming Events"
          description="Events you RSVP to will appear in your diary."
        />
      )}

      {/* List rows */}
      <div className="space-y-2.5">
        {list.map((event) => (
          <DiaryRow key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
