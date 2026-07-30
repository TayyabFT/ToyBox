"use client";

import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchMarketplaceListings,
  purchaseMarketplaceListing,
  setMarketplaceFilter,
  setMarketplaceSearch,
  toggleMarketplaceFavorite,
} from "@/store/slices/marketplaceSlice";
import { showError, showSuccess } from "@/lib/toast";
import {
  memberPageEyebrowClass,
  memberPageTitleAccentClass,
  memberPageTitleClass,
} from "@/components/member/memberPageStyles";
import { MarketplaceFilterTabs } from "./MarketplaceFilterTabs";
import { MarketplaceListingCard } from "./MarketplaceListingCard";
import { MarketplaceDetailModal } from "./MarketplaceDetailModal";
import {
  toListingView,
  type MarketplaceFilterId,
  type MarketplaceListingView,
} from "./types";
import type { MarketplaceVehicleRaw } from "@/types/api";

// ── Skeletons ─────────────────────────────────────────────────────────────────

function ListingCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[18px] border border-accent/10 bg-card">
      <div className="h-[200px] bg-elevated sm:h-[220px]" />
      <div className="flex items-center justify-between gap-3 border-t border-accent/10 px-4 py-3">
        <div className="flex gap-2">
          <div className="h-5 w-12 rounded-md bg-elevated" />
          <div className="h-4 w-20 rounded bg-elevated" />
        </div>
        <div className="size-4 rounded-full bg-elevated" />
      </div>
    </div>
  );
}

// ── Search bar ────────────────────────────────────────────────────────────────

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <span
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary/40"
        aria-hidden
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </span>
      <input
        type="text"
        placeholder="Search make, model or type…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-roboto w-full rounded-full border border-accent/15 bg-elevated py-2.5 pl-9 pr-4 text-[12px] text-foreground placeholder-secondary/40 outline-none transition-colors focus:border-accent/40 focus:ring-0"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary"
          aria-label="Clear search"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d="M1 1l10 10M11 1L1 11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function MarketplacePage() {
  const dispatch = useAppDispatch();
  const {
    featured,
    listings,
    loading,
    loaded,
    error,
    purchaseLoading,
    favoriteLoading,
    activeFilter,
    searchQuery,
  } = useAppSelector((state) => state.marketplace);

  const [selectedListing, setSelectedListing] =
    useState<MarketplaceListingView | null>(null);

  // ── Fetch ────────────────────────────────────────────────────────────────

  const loadListings = useCallback(() => {
    void dispatch(fetchMarketplaceListings(undefined));
  }, [dispatch]);

  useEffect(() => {
    // Reset any stale filter that no longer exists (e.g. "featured")
    const validFilters: string[] = ["all", "available", "favorited"];
    if (!validFilters.includes(activeFilter)) {
      dispatch(setMarketplaceFilter("all"));
    }
    loadListings();
  }, [loadListings]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Filter + search ──────────────────────────────────────────────────────

  const handleFilterChange = (filter: MarketplaceFilterId) => {
    dispatch(setMarketplaceFilter(filter));
  };

  const handleSearchChange = (value: string) => {
    dispatch(setMarketplaceSearch(value));
  };

  // Merge featured + listings, deduplicate by id
  const allListings: MarketplaceVehicleRaw[] = [...featured, ...listings];
  const seen = new Set<string>();
  const deduped = allListings.filter((v) => {
    const idStr = v.id ? String(v.id) : null;
    if (!idStr) return false;
    if (seen.has(idStr)) return false;
    seen.add(idStr);
    return true;
  });

  // Apply active filter
  const filtered = deduped.filter((v) => {
    const status = (v.status ?? "available").toLowerCase();
    if (activeFilter === "available") return status === "available";
    // isFavorited set by normalizeVehicle from backend isFavorite field
    if (activeFilter === "favorited") {
      return (
        !!v.isFavorited ||
        !!(v as unknown as { isFavorite?: boolean }).isFavorite
      );
    }
    return true;
  });

  // Apply search
  const searched = searchQuery.trim()
    ? filtered.filter((v) => {
        const q = searchQuery.toLowerCase();
        return (
          v.make?.toLowerCase().includes(q) ||
          v.model?.toLowerCase().includes(q) ||
          v.vehicleType?.toLowerCase().includes(q) ||
          v.displayName?.toLowerCase().includes(q) ||
          v.title?.toLowerCase().includes(q) ||
          String(v.year ?? "").includes(q)
        );
      })
    : filtered;

  // All vehicles in one grid — no separate hero card
  const allCards = searched.map(toListingView);

  // ── Submit offer (Express Interest) ─────────────────────────────────────

  const handlePurchase = async (id: string | number | undefined) => {
    if (!id) return;
    const idStr = String(id);
    const result = await dispatch(purchaseMarketplaceListing({ id: idStr }));
    if (purchaseMarketplaceListing.fulfilled.match(result)) {
      showSuccess("Your offer has been submitted. We'll be in touch shortly.");
      setSelectedListing(null);
    } else {
      showError((result.payload as string) ?? "Failed to submit offer");
    }
  };

  // ── Favourite toggle ─────────────────────────────────────────────────────

  const handleFavoriteToggle = async (
    id: string | number | undefined,
    current: boolean,
  ) => {
    if (!id) return;
    const idStr = String(id);
    const result = await dispatch(
      toggleMarketplaceFavorite({ id: idStr, isFavorited: current }),
    );
    if (toggleMarketplaceFavorite.fulfilled.match(result)) {
      // result.payload.isFavorited is the confirmed new state from the backend
      const nowFavorited = result.payload.isFavorited;
      showSuccess(nowFavorited ? "Saved to favourites" : "Removed from saved");
      // Keep the modal in sync
      if (selectedListing?.id === id) {
        setSelectedListing((prev) =>
          prev ? { ...prev, isFavorited: nowFavorited } : prev,
        );
      }
    } else {
      showError((result.payload as string) ?? "Failed to update favourite");
    }
  };

  // ── Summary eyebrow ──────────────────────────────────────────────────────

  const totalAvailable = deduped.filter(
    (v) => (v.status ?? "available").toLowerCase() === "available",
  ).length;

  const eyebrow =
    totalAvailable > 0
      ? `${totalAvailable} vehicle${totalAvailable !== 1 ? "s" : ""} available`
      : "Members' Marketplace";

  const isFirstLoad = loading && !loaded;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 sm:space-y-8">
      {/* Page header */}
      <div className="space-y-2">
        <p className={memberPageEyebrowClass}>{eyebrow}</p>
        <h1 className={memberPageTitleClass}>
          <span className={memberPageTitleAccentClass}>Market</span>
          <span className="text-foreground">place</span>
        </h1>
        <p className="font-roboto max-w-lg text-[12px] leading-relaxed text-secondary/60">
          Exclusive vehicles curated for club members. Browse the collection and
          express interest in any listing.
        </p>
      </div>

      {/* Search */}
      <SearchBar value={searchQuery} onChange={handleSearchChange} />

      {/* Filter tabs */}
      <MarketplaceFilterTabs
        active={activeFilter as MarketplaceFilterId}
        onChange={handleFilterChange}
      />

      {/* Error banner — stale data (already loaded once) */}
      {error && loaded && (
        <div className="font-roboto flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[12px] text-red-500">
          <span>{error}</span>
          <button
            type="button"
            onClick={loadListings}
            className="ml-4 rounded-lg border border-red-400/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors hover:border-red-400/50"
          >
            Retry
          </button>
        </div>
      )}

      {/* Listings grid */}
      {isFirstLoad ? (
        <section className="space-y-5">
          <div className="h-6 w-44 animate-pulse rounded bg-elevated" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        </section>
      ) : allCards.length > 0 ? (
        <section className="space-y-5">
          <div>
            <h2 className="font-copperplate text-[13px] font-semibold uppercase tracking-[0.1em] text-foreground">
              All Listings
            </h2>
            <p className="font-roboto text-[10px] text-secondary/50">
              {allCards.length} vehicle{allCards.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {allCards.map((listing) =>
              listing.id ? (
                <MarketplaceListingCard
                  key={listing.id}
                  listing={listing}
                  favoriteLoading={!!favoriteLoading[listing.id]}
                  onFavoriteToggle={handleFavoriteToggle}
                  onClick={() => setSelectedListing(listing)}
                />
              ) : null,
            )}
          </div>
        </section>
      ) : (
        // Empty state
        !loading && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-accent/10 bg-card py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-elevated text-secondary/30">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <p className="font-copperplate text-[18px] uppercase tracking-[0.05em] text-foreground">
              No Listings Found
            </p>
            <p className="font-roboto max-w-xs text-[12px] text-secondary/60">
              {searchQuery
                ? `No vehicles match "${searchQuery}". Try a different search or clear the filter.`
                : "There are no marketplace listings matching the selected filter at this time."}
            </p>
            {(searchQuery || activeFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  dispatch(setMarketplaceSearch(""));
                  dispatch(setMarketplaceFilter("all"));
                }}
                className="font-roboto mt-1 rounded-full border border-accent/25 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent transition-colors hover:border-accent/40 hover:bg-accent/5"
              >
                Clear Filters
              </button>
            )}
          </div>
        )
      )}

      {/* Full-page error — first load failed */}
      {error && !loaded && (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-full border border-destructive/20 bg-destructive/10 p-4 text-destructive">
            <svg
              className="size-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="space-y-1.5">
            <h2 className="font-copperplate text-[20px] uppercase tracking-[0.06em] text-foreground">
              Marketplace Unavailable
            </h2>
            <p className="font-roboto max-w-sm text-[13px] leading-relaxed text-secondary/80">
              {error}. Please check your connection or try again.
            </p>
          </div>
          <button
            type="button"
            onClick={loadListings}
            className="font-roboto rounded-full border border-accent/30 bg-accent/5 px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent transition-colors hover:border-accent/50 hover:bg-accent/10"
          >
            Retry
          </button>
        </div>
      )}

      {/* Detail modal */}
      {selectedListing && selectedListing.id && (
        <MarketplaceDetailModal
          listing={selectedListing}
          purchaseLoading={!!purchaseLoading[selectedListing.id]}
          onPurchase={handlePurchase}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </div>
  );
}
