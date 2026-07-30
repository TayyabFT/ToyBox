"use client";

import type { MarketplaceListingView } from "./types";

// Status badge — two variants:
// • onImage  : dark pill (sits over the photo + scrim, always readable)
// • offImage : theme-aware pill (sits over the bg-elevated placeholder)
const statusBadgeOnImage: Record<string, string> = {
  gold: "border-accent/40 bg-black/55 text-accent",
  teal: "border-teal/40  bg-black/55 text-teal",
  pink: "border-pink/40  bg-black/55 text-pink",
};

const statusBadgeOffImage: Record<string, string> = {
  gold: "border-accent/30 bg-accent/10 text-accent",
  teal: "border-teal/30  bg-teal/10  text-teal",
  pink: "border-pink/30  bg-pink/10  text-pink",
};

const statusDot: Record<string, string> = {
  gold: "bg-accent",
  teal: "bg-teal",
  pink: "bg-pink",
};

type Props = {
  listing: MarketplaceListingView;
  favoriteLoading?: boolean;
  onFavoriteToggle: (id: string | number, current: boolean) => void;
  onClick: () => void;
};

export function MarketplaceListingCard({
  listing,
  favoriteLoading,
  onFavoriteToggle,
  onClick,
}: Props) {
  const image = listing.coverImage ?? listing.images?.[0] ?? null;
  const tone = listing.statusTone;
  const statusLabel =
    listing.statusLabel ??
    (listing.status === "available" ? "Available" : (listing.status ?? "—"));

  const hasMileage =
    listing.displayMileage &&
    listing.displayMileage !== "—" &&
    listing.displayMileage !== "0 km" &&
    listing.displayMileage !== "km";

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-[18px] border border-accent/10 bg-card transition-all hover:border-accent/25 hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
    >
      {/* ── Image area ────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={onClick}
        aria-label={`View ${listing.displayTitle}`}
        className="relative block h-[200px] w-full shrink-0 overflow-hidden sm:h-[220px]"
      >
        {image ? (
          <>
            {/* Photo */}
            <img
              src={image}
              alt={listing.displayTitle}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />

            {/* Dark scrim — only when we have a photo so text is readable */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 45%, transparent 100%)",
              }}
            />

            {/* Title + price overlaid on the image */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
              <p
                className="font-copperplate text-[15px] leading-tight tracking-[0.04em] text-white drop-shadow-lg line-clamp-2 min-w-0 uppercase"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
              >
                {listing.displayTitle}
              </p>
              <p className="font-roboto shrink-0 text-[11px] font-bold text-accent drop-shadow-md leading-none whitespace-nowrap" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}>
                {listing.displayPrice}
              </p>
            </div>
          </>
        ) : (
          /* No-image placeholder — theme-aware gradient + text colors */
          <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 bg-elevated">
            <svg width="48" height="48" viewBox="0 0 56 56" fill="none" aria-hidden>
              <rect width="56" height="56" rx="14" className="fill-accent/10" />
              <path
                d="M8 36l6-10h28l6 10H8z M14 26l4-8h20l4 8"
                stroke="currentColor"
                className="text-accent/40"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="16" cy="38" r="3" stroke="currentColor" className="text-accent/40" strokeWidth="1.5" />
              <circle cx="40" cy="38" r="3" stroke="currentColor" className="text-accent/40" strokeWidth="1.5" />
            </svg>

            {/* Theme-aware gradient scrim — fades from card bg color, not black */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-[60%] pointer-events-none bg-gradient-to-t from-card/95 via-card/60 to-transparent"
            />

            {/* Title + price overlaid at bottom — uses foreground for theme compatibility */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
              <p className="font-copperplate text-[15px] leading-tight tracking-[0.04em] text-foreground line-clamp-2 min-w-0 uppercase">
                {listing.displayTitle}
              </p>
              <p className="font-roboto shrink-0 text-[11px] font-bold text-accent leading-none whitespace-nowrap">
                {listing.displayPrice}
              </p>
            </div>
          </div>
        )}

        {/* Status badge — style adapts to whether a photo is present */}
        <span
          className={`font-roboto absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[8px] font-semibold tracking-[0.14em] uppercase backdrop-blur-sm ${
            image ? statusBadgeOnImage[tone] : statusBadgeOffImage[tone]
          }`}
        >
          <span className={`size-1.5 rounded-full ${statusDot[tone]}`} />
          {statusLabel.toUpperCase()}
        </span>

        {/* Featured badge */}
        {listing.isFeatured && (
          <span
            className={`font-roboto absolute left-3 top-3 rounded-md border px-2 py-1 text-[8px] font-semibold tracking-[0.16em] text-accent uppercase backdrop-blur-sm ${
              image
                ? "border-accent/40 bg-black/55"
                : "border-accent/30 bg-accent/10"
            }`}
          >
            FEATURED
          </span>
        )}
      </button>


      {/* ── Bottom info row ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 border-t border-accent/10 px-4 py-3 mt-auto">
        <div className="flex items-center gap-2 overflow-hidden">
          {listing.year && (
            <span className="font-roboto shrink-0 rounded-md border border-accent/20 bg-elevated px-2 py-0.5 text-[9px] tracking-[0.1em] text-foreground/60 uppercase">
              {listing.year}
            </span>
          )}
          {hasMileage && (
            <span className="font-roboto truncate text-[10px] text-foreground/50">
              {listing.displayMileage}
            </span>
          )}
          {listing.vehicleType && (
            <span className="font-roboto truncate text-[10px] tracking-[0.06em] text-foreground/50 uppercase">
              {listing.vehicleType}
            </span>
          )}
        </div>

        {/* Favourite button */}
        <button
          type="button"
          disabled={favoriteLoading}
          onClick={(e) => {
            e.stopPropagation();
            if (listing.id != null) {
              onFavoriteToggle(listing.id, !!listing.isFavorited);
            }
          }}
          aria-label={listing.isFavorited ? "Remove from saved" : "Save listing"}
          className="shrink-0 p-1 text-foreground/30 transition-colors hover:text-accent disabled:opacity-40"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={listing.isFavorited ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={listing.isFavorited ? "text-accent" : ""}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
    </article>
  );
}
