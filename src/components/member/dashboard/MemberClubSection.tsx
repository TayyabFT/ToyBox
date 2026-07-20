"use client";

import { useState } from "react";
import Link from "next/link";
import type { MemberClubVenue } from "./types";
import { ReservationModal } from "@/components/member/the-club/ReservationModal";
import { dashboardSectionHeadingClass, dashboardSectionHeadingPrefixClass, dashboardSectionHeadingAccentClass, dashboardSectionSubtitleClass } from "./dashboardStyles";

type MemberClubSectionProps = {
  venues?: MemberClubVenue[];
  statusLine?: string;
};

// Static layout — images, names, descriptions, icons never change
const STATIC_CLUB_VENUES: MemberClubVenue[] = [
  {
    id: "clubhouse",
    name: "Clubhouse Restaurant",
    description: "Restaurant, bar & private dining. Your usual table held until 22:00.",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=85",
    tag: "OPEN",
    tagTone: "gold",
    iconKey: "clubhouse",
    footerLeft: undefined,
    actionLabel: "RESERVE",
  },
  {
    id: "lounge",
    name: "Members' Lounge",
    description: "Cigar room, library & private seating areas for members.",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=900&q=85",
    tag: "OPEN",
    tagTone: "gold",
    iconKey: "lounge",
    footerLeft: undefined,
    actionLabel: "ENTER",
  },
  {
    id: "suites",
    name: "Private Suites",
    description: "Four meeting rooms, all with concierge service.",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=85",
    tag: "AVAILABLE",
    tagTone: "gold",
    iconKey: "suites",
    footerLeft: undefined,
    actionLabel: "BOOK",
  },
];

/**
 * Merge each static card with live values from the API.
 * Only tag, footerLeft, and actionLabel are overridden — layout/images stay fixed.
 */
function mergeWithApiData(
  staticVenues: MemberClubVenue[],
  apiVenues?: MemberClubVenue[],
): MemberClubVenue[] {
  if (!apiVenues || apiVenues.length === 0) return staticVenues;

  return staticVenues.map((staticVenue) => {
    // Match by iconKey (clubhouse → restaurant, lounge → private_lounge, suites → suite_lounge)
    const match = apiVenues.find((v) => v.iconKey === staticVenue.iconKey);
    if (!match) return staticVenue;

    return {
      ...staticVenue,
      // Dynamic values from the API
      tag: match.tag ?? staticVenue.tag,
      footerLeft: match.footerLeft ?? staticVenue.footerLeft,
      actionLabel: match.actionLabel ?? staticVenue.actionLabel,
      // Use real space ID and href for correct reservation routing
      id: match.id ?? staticVenue.id,
      href: match.href ?? staticVenue.href,
    };
  });
}

function VenueIcon({ iconKey }: { iconKey?: MemberClubVenue["iconKey"] }) {
  if (iconKey === "lounge") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path
          d="M2 11V7.5C2 6.12 3.12 5 4.5 5H9.5C10.88 5 12 6.12 12 7.5V11"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path d="M1.5 11H12.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M5 5V3.5C5 2.67 5.67 2 6.5 2H7.5C8.33 2 9 2.67 9 3.5V5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    );
  }

  if (iconKey === "suites") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <rect x="2.5" y="2.5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.1" />
        <path d="M5 2.5V11.5M9 2.5V11.5M2.5 5.5H11.5M2.5 8.5H11.5" stroke="currentColor" strokeWidth="1.1" />
      </svg>
    );
  }

  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2.5 6.5L7 2.5L11.5 6.5V11.5C11.5 11.78 11.28 12 11 12H8.5V9H5.5V12H3C2.72 12 2.5 11.78 2.5 11.5V6.5Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VenueCard({
  venue,
  onClick,
}: {
  venue: MemberClubVenue;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const href = venue.href ?? "/member/concierge";

  return (
    <Link
      href={href}
      onClick={onClick}
      className="group relative block min-w-0 flex-1 overflow-hidden rounded-[18px]"
    >
      <div className="relative h-[240px] w-full bg-surface sm:h-[280px] md:h-[320px]">
        {venue.imageUrl ? (
          <img
            src={venue.imageUrl}
            alt={venue.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : null}

        {/* Placeholder shown when no image or broken URL */}
        {!venue.imageUrl && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden>
              <rect width="56" height="56" rx="14" fill="rgba(197,160,89,0.06)" />
              <path
                d="M12 42V24L28 14L44 24V42"
                stroke="rgba(197,160,89,0.35)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              />
              <path
                d="M22 42V34H34V42"
                stroke="rgba(197,160,89,0.35)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              />
              <path
                d="M20 28H22M34 28H36M20 34H22M34 34H36"
                stroke="rgba(197,160,89,0.25)" strokeWidth="1.5" strokeLinecap="round"
              />
            </svg>
            <span className="font-roboto text-[9px] tracking-[0.14em] text-secondary/30 uppercase">No image available</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 42%, rgba(0,0,0,0.12) 100%)",
          }}
        />

        {/* Top-left icon */}
        <div className="absolute left-3.5 top-3.5 flex size-8 items-center justify-center rounded-lg border border-accent/25 bg-black/55 text-accent backdrop-blur-sm">
          <VenueIcon iconKey={venue.iconKey} />
        </div>

        {/* Top-right status badge */}
        {venue.tag && (
          <span className="font-roboto absolute right-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-black/60 px-2.5 py-1 text-[8px] font-semibold tracking-[0.16em] text-accent uppercase backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-accent" />
            {venue.tag}
          </span>
        )}

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-copperplate text-[18px] leading-tight tracking-[0.02em] text-white uppercase">
            {venue.name}
          </h3>
          <p className="mt-2 font-roboto text-[11px] leading-relaxed text-secondary/75">
            {venue.description}
          </p>

          <div className="mt-3 border-t border-white/8 pt-3">
            <div className="flex items-center justify-between gap-3">
              {venue.footerLeft && (
                <span className="font-roboto text-[9px] tracking-[0.1em] text-secondary/65 uppercase">
                  {venue.footerLeft}
                </span>
              )}
              {venue.actionLabel && (
                <span className="font-roboto inline-flex items-center gap-1 text-[9px] font-semibold tracking-[0.14em] text-accent uppercase">
                  {venue.actionLabel}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                    <path
                      d="M3 2.5L7 5L3 7.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function MemberClubSection({ venues, statusLine }: MemberClubSectionProps) {
  const [selectedVenue, setSelectedVenue] = useState<MemberClubVenue | null>(null);

  // Merge static layout (images, names, descriptions) with live API values
  // (status badge, footer info, routing IDs)
  const displayVenues = mergeWithApiData(STATIC_CLUB_VENUES, venues);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className={dashboardSectionHeadingClass}>
            <span className={dashboardSectionHeadingPrefixClass}>The </span>
            <span className={dashboardSectionHeadingAccentClass}>Club</span>
          </h2>
          {statusLine && (
            <p className={dashboardSectionSubtitleClass}>
              {statusLine}
            </p>
          )}
        </div>
        <Link
          href="/member/the-club"
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-accent/30 bg-transparent px-3.5 py-1.5 transition-all hover:border-accent/50 hover:bg-accent/5"
        >
          <span className="font-Roboto text-[10px] font-semibold tracking-[0.14em] text-accent uppercase">
            View All Spaces
          </span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path
              d="M3 2.5L7 5L3 7.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-accent"
            />
          </svg>
        </Link>
      </div>

      {/* 3 cards — static layout, dynamic values from API */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr]">
        {displayVenues.map((venue) => (
          <VenueCard
            key={venue.id}
            venue={venue}
            onClick={(e) => {
              e.preventDefault();
              setSelectedVenue(venue);
            }}
          />
        ))}
      </div>

      {selectedVenue && (
        <ReservationModal
          venue={selectedVenue}
          allVenues={displayVenues}
          onClose={() => setSelectedVenue(null)}
        />
      )}
    </div>
  );
}
