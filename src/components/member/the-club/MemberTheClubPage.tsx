"use client";

import { useEffect, useState } from "react";
import { clubhouseApi } from "@/api/clubhouse.api";
import { buildClubStatusLine } from "@/lib/memberDashboard";
import type { ClubhouseAreaSection, ClubhouseSpaceCardRaw } from "@/types/api";
import type { MemberClubVenue } from "@/components/member/dashboard/types";
import { ReservationModal } from "./ReservationModal";

// ── Helpers ───────────────────────────────────────────────────────────────────

// Maps section iconKey → the exact key used by ReservationModal's VENUE_CATEGORIES
const ICON_KEY_TO_MODAL_NAME: Record<string, string> = {
  lounge:     "Members' Lounge",
  suites:     "Private Suites",
  clubhouse:  "Clubhouse Restaurant",
};

function spaceToVenue(space: ClubhouseSpaceCardRaw, section: ClubhouseAreaSection): MemberClubVenue {
  return {
    id: space.id,
    // Use the modal-recognised top-level name so VENUE_CATEGORIES resolves correctly
    name: ICON_KEY_TO_MODAL_NAME[section.iconKey] ?? section.label,
    description: space.description ?? section.description,
    imageUrl: space.coverImage ?? (space.images?.[0] ?? ""),
    tag: space.statusLabel?.toUpperCase() ?? "OPEN",
    tagTone: "gold",
    iconKey: section.iconKey,
    footerLeft: space.openingTime && space.closingTime
      ? `${space.openingTime} – ${space.closingTime}`
      : space.capacity ? `Cap. ${space.capacity}` : undefined,
    actionLabel: (space.action ?? "RESERVE").toUpperCase(),
    href: `/member/concierge?space=${space.id}`,
  };
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function TheClubSkeleton() {
  return (
    <div className="mx-auto w-full space-y-10 px-8 pb-12 pt-5 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 w-32 rounded bg-elevated" />
        <div className="h-10 w-64 rounded bg-elevated" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-4">
          <div className="h-5 w-48 rounded bg-elevated" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-[280px] rounded-[18px] bg-elevated" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Category pill ─────────────────────────────────────────────────────────────

function CategoryPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`font-Roboto whitespace-nowrap rounded-full border px-3.5 py-1 text-[10px] font-semibold tracking-[0.14em] uppercase transition-all ${
        active
          ? "border-accent bg-accent/10 text-accent"
          : "border-accent/15 text-secondary/60 hover:border-accent/30 hover:text-secondary"
      }`}
    >
      {label}
    </button>
  );
}

// ── Area section ──────────────────────────────────────────────────────────────

function AreaSection({
  section,
  onBook,
}: {
  section: ClubhouseAreaSection;
  onBook: (venue: MemberClubVenue, spaceId: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", ...section.categories];

  const filteredSpaces = activeCategory === "All"
    ? section.spaces
    : section.spaces.filter(s => s.type === activeCategory);

  const hasSpaces = section.spaces.length > 0;

  return (
    <section className="space-y-5">
      {/* Section header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="font-copperplate text-[22px] tracking-[0.04em] text-foreground uppercase">
            {section.label}
          </h2>
          <p className="font-Roboto text-[11px] text-secondary/55">{section.description}</p>
        </div>
        {section.count > 0 && (
          <span className="font-Roboto mt-1 shrink-0 rounded-full border border-accent/20 bg-accent/5 px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.12em] text-accent/80 uppercase">
            {section.count} {section.count === 1 ? "Space" : "Spaces"}
          </span>
        )}
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <CategoryPill
            key={cat}
            label={cat}
            active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
          />
        ))}
      </div>

      {/* Space cards */}
      {hasSpaces && filteredSpaces.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSpaces.map((space) => {
            const venue = spaceToVenue(space, section);
            return (
              <SpaceCard
                key={space.id}
                space={space}
                section={section}
                onBook={() => onBook(venue, space.id)}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-2xl border border-accent/8 bg-card py-10 text-center">
          <p className="font-Roboto text-[12px] text-secondary/50">
            {hasSpaces ? `No spaces in "${activeCategory}"` : "No spaces available in this area"}
          </p>
        </div>
      )}
    </section>
  );
}

// ── Space card ────────────────────────────────────────────────────────────────

function SpaceCard({
  space,
  section,
  onBook,
}: {
  space: ClubhouseSpaceCardRaw;
  section: ClubhouseAreaSection;
  onBook: () => void;
}) {
  const image = space.coverImage ?? space.images?.[0] ?? null;

  return (
    <button
      type="button"
      onClick={onBook}
      className="group relative block w-full overflow-hidden rounded-[18px] text-left"
    >
      <div className="relative h-[300px] w-full bg-surface">
        {image ? (
          <img
            src={image}
            alt={space.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 56 56" fill="none" aria-hidden>
              <rect width="56" height="56" rx="14" fill="rgba(197,160,89,0.06)" />
              <path d="M12 42V24L28 14L44 24V42" stroke="rgba(197,160,89,0.3)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}

        {/* Gradient */}
        <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.08) 100%)" }} />

        {/* Status badge */}
        {space.statusLabel && (
          <span className="font-Roboto absolute right-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-black/60 px-2.5 py-1 text-[8px] font-semibold tracking-[0.16em] text-accent uppercase backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-accent" />
            {space.statusLabel}
          </span>
        )}

        {/* Sub-category badge */}
        {space.type && (
          <span className="font-Roboto absolute left-3.5 top-3.5 rounded-lg border border-white/10 bg-black/55 px-2 py-1 text-[9px] tracking-[0.1em] text-secondary/80 uppercase backdrop-blur-sm">
            {space.type}
          </span>
        )}

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-copperplate text-[16px] leading-tight tracking-[0.02em] text-white uppercase">
            {space.title}
          </h3>
          {space.description && (
            <p className="mt-1 font-Roboto text-[11px] leading-relaxed text-secondary/70 line-clamp-2">
              {space.description}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between border-t border-white/8 pt-3">
            {space.capacity && (
              <span className="font-Roboto text-[9px] tracking-[0.1em] text-secondary/55 uppercase">
                Cap. {space.capacity}
              </span>
            )}
            <span className="font-Roboto ml-auto inline-flex items-center gap-1 text-[9px] font-semibold tracking-[0.14em] text-accent uppercase">
              {(space.action ?? "RESERVE").toUpperCase()}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                <path d="M3 2.5L7 5L3 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

// ── State for selected space (page-level, carries spaceId into modal) ────────

interface SelectedVenueWithSpace {
  venue: MemberClubVenue;
  spaceId: string;
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function MemberTheClubPage() {
  const [sections, setSections] = useState<ClubhouseAreaSection[]>([]);
  const [allVenues, setAllVenues] = useState<MemberClubVenue[]>([]);
  const [statusLine, setStatusLine] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selection, setSelection] = useState<SelectedVenueWithSpace | null>(null);

  const loadClubhouse = () => {
    setLoading(true);
    setError(null);
    clubhouseApi
      .getOverview()
      .then((res) => {
        if (res.success && res.data) {
          const data = res.data;
          setSections(data.sections ?? []);
          // Build flat allVenues list for the modal dropdown
          const venues: MemberClubVenue[] = (data.sections ?? []).flatMap((sec) =>
            sec.spaces.map((sp) => spaceToVenue(sp, sec))
          );
          setAllVenues(venues);
          setStatusLine(buildClubStatusLine(data));
        } else {
          setError(res.message || "Failed to load clubhouse spaces");
        }
      })
      .catch((err) => {
        setError(err.message || "An error occurred");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadClubhouse(); }, []);

  if (loading) return <TheClubSkeleton />;

  if (error) {
    return (
      <div className="mx-auto w-full px-8 py-16 flex flex-col items-center justify-center text-center space-y-6">
        <div className="rounded-full bg-destructive/10 p-4 border border-destructive/20 text-destructive">
          <svg className="size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="font-copperplate text-[20px] tracking-[0.06em] text-foreground uppercase">
            Clubhouse Temporarily Offline
          </h2>
          <p className="font-Roboto max-w-sm text-[13px] leading-relaxed text-secondary/80">
            {error}. Please check your connection or contact concierge if the issue persists.
          </p>
        </div>
        <button
          type="button"
          onClick={loadClubhouse}
          className="font-Roboto rounded-full border border-accent/30 bg-accent/5 px-6 py-2 text-[11px] font-semibold tracking-[0.14em] text-accent uppercase transition-colors hover:border-accent/50 hover:bg-accent/10"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full space-y-12 px-8 pb-16 pt-5">
      {/* Page header */}
      <div className="space-y-1.5">
        <p className="font-Roboto text-[10px] font-medium tracking-[0.24em] text-secondary uppercase">
          {statusLine}
        </p>
        <h1 className="font-copperplate text-[38px] font-light leading-none tracking-[-0.75px] uppercase sm:text-[46px]">
          <span className="text-foreground">Club </span>
          <span className="font-normal text-primary">House</span>
        </h1>
      </div>

      {/* Area sections */}
      {sections.length > 0 ? (
        <div className="space-y-14">
          {sections.map((section) => (
            <AreaSection
              key={section.areaType}
              section={section}
              onBook={(venue, spaceId) => setSelection({ venue, spaceId })}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-accent/10 bg-card py-16 text-center">
          <p className="font-copperplate text-[18px] text-foreground uppercase tracking-[0.05em]">
            No Spaces Available
          </p>
          <p className="font-Roboto text-[12px] text-secondary/65">
            There are currently no spaces or venues published.
          </p>
        </div>
      )}

      {/* Reservation Modal */}
      {selection && (
        <ReservationModal
          venue={selection.venue}
          allVenues={allVenues}
          initialSpaceId={selection.spaceId}
          onClose={() => setSelection(null)}
        />
      )}
    </div>
  );
}
