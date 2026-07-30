import type { MarketplaceVehicleRaw } from "@/types/api";

export type MarketplaceFilterId =
  | "all"
  | "available"
  | "favorited";

export type MarketplaceFilter = {
  id: MarketplaceFilterId;
  label: string;
};

export const MARKETPLACE_FILTERS: MarketplaceFilter[] = [
  { id: "all", label: "All Vehicles" },
  { id: "available", label: "Available" },
  { id: "favorited", label: "Saved" },
];

/** A listing enriched with display helpers. */
export type MarketplaceListingView = MarketplaceVehicleRaw & {
  displayTitle: string;
  displayPrice: string;
  displayMileage: string;
  statusTone: "gold" | "teal" | "pink";
};

export function toListingView(
  raw: MarketplaceVehicleRaw,
): MarketplaceListingView {
  const year = raw.year ? `${raw.year} ` : "";

  // If the backend title starts with "Member Offer" or similar prefixes,
  // fall back to building the title from make/model so cards show clean names.
  const rawTitle = raw.title ?? raw.displayName ?? "";
  const isTitlePrefixed = /^member\s+offer/i.test(rawTitle.trim());
  const builtTitle = `${year}${raw.make ?? ""} ${raw.model ?? ""}`.trim();
  const displayTitle =
    (!isTitlePrefixed && rawTitle) || builtTitle || "Vehicle";

  // Support both backend shapes:
  // - /marketplace/vehicles  → finalPrice / originalPrice
  // - legacy /marketplace/listings → priceAed / priceLabel
  const price = raw.finalPrice ?? raw.priceAed ?? 0;
  const displayPrice =
    raw.priceLabel ??
    (price > 0
      ? `AED ${price.toLocaleString("en-AE")}`
      : "Price on Request");

  const displayMileage =
    raw.mileageLabel ??
    (raw.mileage != null ? `${raw.mileage.toLocaleString()} km` : "—");

  const status = (raw.status ?? "available").toLowerCase();
  const statusTone: "gold" | "teal" | "pink" =
    status === "available"
      ? "teal"
      : status === "reserved"
        ? "gold"
        : "pink";

  // Derive coverImage from the images array if not already set
  const coverImage =
    raw.coverImage ??
    (Array.isArray(raw.images) && raw.images.length > 0 ? raw.images[0] : null);

  return {
    ...raw,
    coverImage,
    displayTitle,
    displayPrice,
    displayMileage,
    statusTone,
  };
}
