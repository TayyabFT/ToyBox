import Link from "next/link";
import type { MemberClubVenue } from "./types";

const tagToneClass: Record<string, string> = {
  gold: "border-accent/40 bg-black/55 text-primary backdrop-blur-sm",
  teal: "border-teal/40 bg-black/55 text-teal backdrop-blur-sm",
  pink: "border-pink/40 bg-black/55 text-pink backdrop-blur-sm",
};

type MemberClubSectionProps = {
  venues: MemberClubVenue[];
};

function VenueCard({ venue }: { venue: MemberClubVenue }) {
  return (
    <div className="group relative flex-1 overflow-hidden rounded-xl cursor-pointer">
      <div className="relative h-[190px]">
        <img
          src={venue.imageUrl}
          alt={venue.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 48%, rgba(0,0,0,0.1) 100%)",
          }}
        />
        {/* Tag — top right */}
        {venue.tag && (
          <span className={`font-roboto absolute right-3 top-3 rounded-full border px-2 py-0.5 text-[7px] font-semibold tracking-[0.2em] uppercase ${tagToneClass[venue.tagTone ?? "gold"]}`}>
            {venue.tag}
          </span>
        )}
        {/* Content — bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1">
          <h3 className="font-copperplate text-[13px] leading-tight text-white uppercase">{venue.name}</h3>
          <p className="font-roboto text-[9px] tracking-[0.08em] text-white/45 uppercase">{venue.description}</p>
          <div className="pt-0.5">
            <Link
              href="/member"
              className="font-roboto inline-block rounded-full border border-white/22 bg-white/8 px-3 py-0.5 text-[8px] font-semibold tracking-[0.2em] text-white/75 uppercase transition-colors hover:border-primary/40 hover:text-primary"
            >
              Visit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MemberClubSection({ venues }: MemberClubSectionProps) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-1">
        <div className="space-y-0.5">
          <h2 className="font-copperplate text-[11px] tracking-[0.06em] uppercase">
            <span className="text-foreground">The </span>
            <span className="text-primary">Club</span>
          </h2>
          <p className="font-roboto text-[9px] tracking-[0.14em] text-secondary/70 uppercase">Exclusive spaces</p>
        </div>
        <Link
          href="/member"
          className="font-roboto text-[9px] tracking-[0.16em] text-primary uppercase transition-colors hover:text-accent"
        >
          View All Posts →
        </Link>
      </div>

      {/* 3 equal venue cards */}
      <div className="flex gap-3">
        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </div>
  );
}
