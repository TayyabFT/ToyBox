"use client";

import type { MarketplaceListingView } from "./types";

type Props = {
  listing: MarketplaceListingView;
  purchaseLoading?: boolean;
  favoriteLoading?: boolean;
  onPurchase: (id: string | number) => void;
  onFavoriteToggle: (id: string | number, current: boolean) => void;
  onClick: () => void;
};

const statusBg: Record<string, string> = {
  teal: "border-teal/30 bg-teal/10 text-teal",
  gold: "border-accent/30 bg-accent/10 text-accent",
  pink: "border-pink/30 bg-pink/10 text-pink",
};

const statusDot: Record<string, string> = {
  teal: "bg-teal",
  gold: "bg-accent",
  pink: "bg-pink",
};

export function MarketplaceFeaturedCard({
  listing,
  purchaseLoading,
  favoriteLoading,
  onPurchase,
  onFavoriteToggle,
  onClick,
}: Props) {
  const image = listing.coverImage ?? listing.images?.[0] ?? null;
  const tone = listing.statusTone;
  const statusLabel =
    listing.statusLabel ??
    (listing.status === "available" ? "Available" : listing.status ?? "—");
  const isAvailable = (listing.status ?? "available") === "available";

  return (
    <article className="overflow-hidden rounded-[20px] border border-accent/12 bg-card">
      <div className="flex flex-col sm:flex-row">
        {/* Image side */}
        <button
          type="button"
          onClick={onClick}
          aria-label={`View ${listing.displayTitle}`}
          className="relative h-[200px] w-full shrink-0 overflow-hidden bg-elevated sm:h-auto sm:w-[45%]"
        >
          {image ? (
            <>
              <img
                src={image}
                alt={listing.displayTitle}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              {/* Scrim only when photo is present */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.12) 100%)",
                }}
              />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-elevated">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden>
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
            </div>
          )}
          {/* FEATURED label over image */}
          <span className="font-roboto absolute left-4 top-4 rounded-md border border-accent/40 bg-black/55 px-2.5 py-1 text-[8px] font-semibold tracking-[0.18em] text-accent uppercase backdrop-blur-sm">
            FEATURED
          </span>
        </button>

        {/* Info side */}
        <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                {listing.make && (
                  <p className="font-roboto text-[10px] tracking-[0.16em] text-secondary/60 uppercase">
                    {listing.make} · {listing.year ?? ""}
                  </p>
                )}
                <h2 className="font-copperplate text-[20px] leading-tight tracking-[0.02em] text-foreground uppercase sm:text-[24px]">
                  {listing.displayTitle}
                </h2>
              </div>
              <span
                className={`font-roboto mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[8px] font-semibold tracking-[0.14em] uppercase ${statusBg[tone]}`}
              >
                <span className={`size-1.5 rounded-full ${statusDot[tone]}`} />
                {statusLabel.toUpperCase()}
              </span>
            </div>

            {listing.description && (
              <p className="font-roboto text-[12px] leading-relaxed text-secondary/70 line-clamp-3">
                {listing.description}
              </p>
            )}
          </div>

          {/* Specs strip */}
          {(listing.engineType || listing.transmission || listing.fuelType || listing.power) && (
            <div className="flex flex-wrap gap-2">
              {[listing.engineType, listing.transmission, listing.fuelType, listing.power]
                .filter(Boolean)
                .map((val) => (
                  <span
                    key={val}
                    className="font-roboto rounded-md border border-accent/12 bg-elevated px-2 py-0.5 text-[9px] tracking-[0.08em] text-secondary/65 uppercase"
                  >
                    {val}
                  </span>
                ))}
            </div>
          )}

          {/* Price + mileage */}
          <div className="flex items-center gap-4">
            <p className="font-copperplate text-[22px] text-accent tracking-[0.02em]">
              {listing.displayPrice}
            </p>
            {listing.displayMileage &&
              listing.displayMileage !== "—" &&
              listing.displayMileage !== "0 km" &&
              listing.displayMileage !== "km" && (
              <p className="font-roboto text-[11px] text-secondary/55">
                {listing.displayMileage}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-auto flex items-center gap-3 border-t border-accent/8 pt-4">
            {isAvailable && (
              <button
                type="button"
                disabled={purchaseLoading}
                onClick={() => {
                  if (listing.id != null) onPurchase(listing.id);
                }}
                className="font-roboto flex-1 rounded-full bg-accent px-5 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-dark uppercase transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {purchaseLoading ? "Requesting…" : "Express Interest"}
              </button>
            )}
            <button
              type="button"
              onClick={onClick}
              className="font-roboto rounded-full border border-accent/25 px-5 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-accent uppercase transition-colors hover:border-accent/50 hover:bg-accent/5"
            >
              View Details
            </button>
            {/* Favourite */}
            <button
              type="button"
              disabled={favoriteLoading}
              onClick={() => {
                if (listing.id != null) {
                  onFavoriteToggle(listing.id, !!listing.isFavorited);
                }
              }}
              aria-label={listing.isFavorited ? "Remove from saved" : "Save"}
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-accent/15 text-secondary/40 transition-colors hover:border-accent/30 hover:text-accent disabled:opacity-40"
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
        </div>
      </div>
    </article>
  );
}
