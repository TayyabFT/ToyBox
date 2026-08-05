"use client";

import { useEffect } from "react";
import type { MarketplaceListingView } from "./types";

type Props = {
  listing: MarketplaceListingView;
  purchaseLoading?: boolean;
  onPurchase: (id: string | number) => void;
  onClose: () => void;
};

const SPEC_LABELS: Record<string, string> = {
  year: "Year",
  make: "Make",
  model: "Model",
  colour: "Colour",
  exteriorColor: "Exterior",
  engineType: "Engine",
  transmission: "Transmission",
  fuelType: "Fuel Type",
  power: "Power",
  zeroToHundred: "0–100 km/h",
  topSpeed: "Top Speed",
};

export function MarketplaceDetailModal({
  listing,
  purchaseLoading,
  onPurchase,
  onClose,
}: Props) {
  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const image = listing.coverImage ?? listing.images?.[0] ?? null;
  const isAvailable = (listing.status ?? "available") === "available";

  const specEntries = Object.entries(SPEC_LABELS).filter(([key]) => {
    const val = listing[key as keyof typeof listing];
    return val != null && val !== "";
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={listing.displayTitle}
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
    >
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Panel */}
      <div className="Custom__Scrollbar relative z-10 max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-[24px] bg-card shadow-2xl sm:rounded-[24px]  mr-2 ml-2">
        {/* Hero image */}
        <div className="relative h-[220px] w-full overflow-hidden bg-surface sm:h-[280px] ">
          {image ? (
            <img
              src={image}
              alt={listing.displayTitle}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden>
                <rect width="56" height="56" rx="14" fill="rgba(197,160,89,0.06)" />
                <path
                  d="M8 36l6-10h28l6 10H8z M14 26l4-8h20l4 8"
                  stroke="rgba(197,160,89,0.3)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="16" cy="38" r="3" stroke="rgba(197,160,89,0.3)" strokeWidth="1.5" />
                <circle cx="40" cy="38" r="3" stroke="rgba(197,160,89,0.3)" strokeWidth="1.5" />
              </svg>
            </div>
          )}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)",
            }}
          />
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          {/* Title over image */}
          <div className="absolute bottom-4 left-5 right-5">
            <p className="font-roboto text-[10px] tracking-[0.14em] text-secondary/70 uppercase">
              {listing.make} · {listing.year}
            </p>
            <h2 className="font-copperplate text-[22px] leading-tight tracking-[0.02em] text-white uppercase">
              {listing.displayTitle}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-5 p-5 sm:p-6">
          {/* Price + status */}
          <div className="flex items-center justify-between gap-4">
            <p className="font-copperplate text-[26px] text-accent tracking-[0.02em]">
              {listing.displayPrice}
            </p>
            <span
              className={`font-roboto inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[9px] font-semibold tracking-[0.14em] uppercase ${listing.statusTone === "teal"
                ? "border-teal/25 bg-teal/8 text-teal"
                : listing.statusTone === "gold"
                  ? "border-accent/25 bg-accent/8 text-accent"
                  : "border-pink/25 bg-pink/8 text-pink"
                }`}
            >
              <span
                className={`size-1.5 rounded-full ${listing.statusTone === "teal"
                  ? "bg-teal"
                  : listing.statusTone === "gold"
                    ? "bg-accent"
                    : "bg-pink"
                  }`}
              />
              {(listing.statusLabel ?? listing.status ?? "Available").toUpperCase()}
            </span>
          </div>

          {/* Description */}
          {listing.description && (
            <p className="font-roboto text-[13px] leading-relaxed text-secondary/75">
              {listing.description}
            </p>
          )}

          {/* Highlights */}
          {listing.highlights && listing.highlights.length > 0 && (
            <div className="space-y-2">
              <p className="font-roboto text-[10px] font-semibold tracking-[0.16em] text-secondary/50 uppercase">
                Highlights
              </p>
              <ul className="space-y-1.5">
                {listing.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 font-roboto text-[12px] text-secondary/80"
                  >
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-accent" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specifications */}
          {specEntries.length > 0 && (
            <div className="space-y-2">
              <p className="font-roboto text-[10px] font-semibold tracking-[0.16em] text-secondary/50 uppercase">
                Specifications
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {specEntries.map(([key, label]) => (
                  <div
                    key={key}
                    className="rounded-xl border border-accent/8 bg-elevated px-3 py-2.5"
                  >
                    <p className="font-roboto text-[9px] tracking-[0.1em] text-secondary/45 uppercase">
                      {label}
                    </p>
                    <p className="font-roboto mt-0.5 text-[12px] font-medium text-foreground/90">
                      {String(listing[key as keyof typeof listing])}
                    </p>
                  </div>
                ))}
                {listing.displayMileage !== "—" && (
                  <div className="rounded-xl border border-accent/8 bg-elevated px-3 py-2.5">
                    <p className="font-roboto text-[9px] tracking-[0.1em] text-secondary/45 uppercase">
                      Mileage
                    </p>
                    <p className="font-roboto mt-0.5 text-[12px] font-medium text-foreground/90">
                      {listing.displayMileage}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Seller info */}
          {listing.sellerName && (
            <div className="flex items-center gap-3 rounded-xl border border-accent/10 bg-elevated px-4 py-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <p className="font-roboto text-[9px] tracking-[0.12em] text-secondary/45 uppercase">
                  Listed by
                </p>
                <p className="font-roboto text-[12px] font-medium text-foreground/80">
                  {listing.sellerName}
                  {listing.sellerType && (
                    <span className="ml-1.5 text-[9px] text-secondary/50">
                      ({listing.sellerType})
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex gap-3 border-t border-accent/8 pt-4">
            {isAvailable ? (
              <button
                type="button"
                disabled={purchaseLoading}
                onClick={() => {
                  if (listing.id != null) onPurchase(listing.id);
                }}
                className="font-roboto flex-1 rounded-full bg-accent py-3 text-[11px] font-semibold tracking-[0.14em] text-dark uppercase transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                {purchaseLoading ? "Submitting…" : "Express Interest"}
              </button>
            ) : (
              <div className="font-roboto flex-1 rounded-full bg-elevated py-3 text-center text-[11px] font-semibold tracking-[0.14em] text-secondary/50 uppercase">
                No Longer Available
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="font-roboto rounded-full border border-accent/20 px-5 py-3 text-[11px] font-semibold tracking-[0.14em] text-secondary uppercase transition-colors hover:border-accent/40 hover:text-foreground cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
