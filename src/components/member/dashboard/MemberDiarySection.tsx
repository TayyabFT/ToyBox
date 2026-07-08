import Link from "next/link";
import type { MemberDiaryEvent } from "./types";

const tagToneClass: Record<string, string> = {
  gold: "border-accent/35 bg-accent/10 text-primary",
  teal: "border-teal/35 bg-teal/8 text-teal",
  pink: "border-pink/35 bg-pink/8 text-pink",
};

type MemberDiarySectionProps = {
  events: MemberDiaryEvent[];
};

function FeaturedEventCard({ event }: { event: MemberDiaryEvent }) {
  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="relative h-[200px] w-full">
        {event.imageUrl && (
          <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" />
        )}
        {/* Dark gradient */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.12) 100%)",
          }}
        />
        {/* Tag — top left */}
        <span className={`font-roboto absolute left-3 top-3 rounded-full border px-2.5 py-0.5 text-[8px] font-semibold tracking-[0.2em] uppercase ${tagToneClass[event.tagTone]}`}>
          {event.tag}
        </span>
        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1.5">
          {/* Attendee initials row */}
          <div className="flex items-center gap-1">
            {["F", "A", "L", "M"].map((initial, i) => (
              <span
                key={i}
                className="flex size-5 items-center justify-center rounded-full bg-gradient-to-b from-[#F0C566] to-[#8B6F2A] text-[7px] font-semibold text-dark"
              >
                {initial}
              </span>
            ))}
            <span className="font-roboto ml-1 text-[8px] tracking-[0.08em] text-white/50 uppercase">Attending</span>
          </div>
          {/* Title + RSVP button */}
          <div className="flex items-end justify-between gap-3">
            <h3 className="font-copperplate text-[13px] leading-tight text-white uppercase">{event.title}</h3>
            <Link
              href="/member/events"
              className="font-roboto shrink-0 rounded-full border border-primary/40 bg-primary/12 px-3 py-1 text-[8px] font-semibold tracking-[0.18em] text-primary uppercase transition-colors hover:bg-primary/20"
            >
              RSVP
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiaryEventRow({ event }: { event: MemberDiaryEvent }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-accent/6 last:border-0">
      {/* Date block */}
      <div className="flex w-9 shrink-0 flex-col items-center rounded-lg border border-accent/14 bg-accent/6 py-1">
        <span className="font-roboto text-[7px] tracking-[0.18em] text-primary uppercase">{event.monthLabel}</span>
        <span className="font-copperplate text-[18px] leading-none text-foreground">{event.dayLabel}</span>
      </div>
      {/* Title + location */}
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="font-roboto truncate text-[11px] font-medium text-foreground">{event.title}</p>
        <p className="font-roboto truncate text-[9px] tracking-[0.02em] text-secondary/60">{event.location}</p>
      </div>
      {/* Tag */}
      <span className={`font-roboto shrink-0 rounded-full border px-2 py-0.5 text-[7px] font-medium tracking-[0.14em] uppercase ${tagToneClass[event.tagTone]}`}>
        {event.tag}
      </span>
    </div>
  );
}

export function MemberDiarySection({ events }: MemberDiarySectionProps) {
  const featured = events.find((e) => e.isFeatured) ?? events[0];
  const upcoming = events.filter((e) => !e.isFeatured);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-1">
        <div className="space-y-0.5">
          <h2 className="font-copperplate text-[11px] tracking-[0.06em] uppercase">
            <span className="text-foreground">Your </span>
            <span className="text-primary">Diary</span>
          </h2>
          <p className="font-roboto text-[9px] tracking-[0.14em] text-secondary/70 uppercase">Upcoming events</p>
        </div>
        <Link
          href="/member/events"
          className="font-roboto text-[9px] tracking-[0.16em] text-primary uppercase transition-colors hover:text-accent"
        >
          All →
        </Link>
      </div>

      {/* Featured card */}
      {featured && <FeaturedEventCard event={featured} />}

      {/* List */}
      <div className="rounded-xl border border-accent/8 bg-card px-4 py-1">
        {upcoming.map((event) => (
          <DiaryEventRow key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
