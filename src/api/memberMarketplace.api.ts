import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  MarketplaceVehiclesListResponse,
  MarketplaceVehicleMutationResponse,
  MarketplaceVehicleRaw,
} from "@/types/api";

// ── Param types ────────────────────────────────────────────────────────────────

export type MarketplaceListingsParams = {
  search?: string;
  make?: string;
  model?: string;
  year?: number;
  limit?: number;
  offset?: number;
};

export type MarketplaceMyVehiclesParams = {
  /** Filter by offer status: IN_REVIEW | PAYMENT_PENDING | PURCHASED */
  status?: string;
  limit?: number;
  offset?: number;
};

export type MarketplaceMyOffersParams = {
  /** Filter by offer status: IN_REVIEW | PAYMENT_PENDING | PURCHASED | REJECTED */
  status?: string;
  limit?: number;
  offset?: number;
};

// ── Raw API response shapes ────────────────────────────────────────────────────

type VehiclesListApiResponse = {
  success: boolean;
  message?: string;
  data: {
    total: number;
    count: number;
    limit: number;
    offset: number;
    vehicles: MarketplaceVehicleRaw[];
  };
};

type FavoriteApiResponse = {
  success: boolean;
  message?: string;
  data: {
    vehicleId: string;
    isFavorite: boolean;
    vehicle: MarketplaceVehicleRaw;
  };
};

type OfferApiResponse = {
  success: boolean;
  message?: string;
  data: {
    offer: {
      id: string;
      vehicleId: string;
      offerPrice: number;
      status: string;
      statusLabel?: string;
    };
  };
};

// ── API client ─────────────────────────────────────────────────────────────────

export const memberMarketplaceApi = {
  /**
   * GET /api/v1/marketplace/vehicles
   * Returns AVAILABLE vehicles for the member catalogue.
   * Each vehicle includes `isFavorite` for the authenticated member.
   */
  getListings: async (
    params?: MarketplaceListingsParams,
  ): Promise<MarketplaceVehiclesListResponse> => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.make) query.set("make", params.make);
    if (params?.model) query.set("model", params.model);
    if (params?.year != null) query.set("year", String(params.year));
    if (params?.limit != null) query.set("limit", String(params.limit));
    if (params?.offset != null) query.set("offset", String(params.offset));

    const qs = query.toString();
    const url = qs
      ? `${API_ENDPOINTS.marketplace.vehicles}?${qs}`
      : API_ENDPOINTS.marketplace.vehicles;

    const res = await apiClient<VehiclesListApiResponse>(url);
    const vehicles = (res.data?.vehicles ?? []).map(normalizeVehicle);

    // Normalise to the shape the slice expects: { data: { vehicles, listings } }
    return {
      ...res,
      data: {
        total: res.data?.total,
        vehicles,
        featured: [],
        listings: vehicles,
      },
    } as unknown as MarketplaceVehiclesListResponse;
  },

  /**
   * GET /api/v1/marketplace/my-vehicles
   * Member's vehicles via active/past offers.
   */
  getMyVehicles: (params?: MarketplaceMyVehiclesParams) => {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.limit != null) query.set("limit", String(params.limit));
    if (params?.offset != null) query.set("offset", String(params.offset));
    const qs = query.toString();
    const url = qs
      ? `${API_ENDPOINTS.marketplace.myVehicles}?${qs}`
      : API_ENDPOINTS.marketplace.myVehicles;
    return apiClient<VehiclesListApiResponse>(url);
  },

  /**
   * GET /api/v1/marketplace/my-offers
   * Member's submitted offers.
   */
  getMyOffers: (params?: MarketplaceMyOffersParams) => {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.limit != null) query.set("limit", String(params.limit));
    if (params?.offset != null) query.set("offset", String(params.offset));
    const qs = query.toString();
    const url = qs
      ? `${API_ENDPOINTS.marketplace.myOffers}?${qs}`
      : API_ENDPOINTS.marketplace.myOffers;
    return apiClient<VehiclesListApiResponse>(url);
  },

  /**
   * GET /api/v1/marketplace/favorites
   * Member's saved/favourite vehicles.
   */
  getFavorites: (params?: { limit?: number; offset?: number }) => {
    const query = new URLSearchParams();
    if (params?.limit != null) query.set("limit", String(params.limit));
    if (params?.offset != null) query.set("offset", String(params.offset));
    const qs = query.toString();
    const url = qs
      ? `${API_ENDPOINTS.marketplace.favorites}?${qs}`
      : API_ENDPOINTS.marketplace.favorites;
    return apiClient<VehiclesListApiResponse>(url);
  },

  /**
   * PATCH /api/v1/marketplace/vehicles/:id/favorite
   * Add or remove a vehicle from the member's favourites.
   * Body: { isFavorite: boolean }
   */
  setFavorite: (id: string, isFavorite: boolean) =>
    apiClient<FavoriteApiResponse>(
      API_ENDPOINTS.marketplace.vehicleFavorite(id),
      { method: "PATCH", body: { isFavorite } },
    ),

  /**
   * POST /api/v1/marketplace/offers
   * Submit an offer on a vehicle.
   * Body: { vehicleId: string; offerPrice: number }
   */
  submitOffer: (vehicleId: string, offerPrice: number) =>
    apiClient<OfferApiResponse>(API_ENDPOINTS.marketplace.offers, {
      method: "POST",
      body: { vehicleId, offerPrice },
    }),

  // ── Legacy aliases (kept so existing detail/purchase flows don't break) ─────

  /** @deprecated use submitOffer instead */
  purchase: (id: string, body?: { listingId?: string; notes?: string }) =>
    apiClient<MarketplaceVehicleMutationResponse>(
      API_ENDPOINTS.marketplace.purchase(id),
      { method: "POST", body: body ?? {} },
    ),

  /** @deprecated use setFavorite instead */
  toggleFavorite: (id: string, isFavorite: boolean) =>
    memberMarketplaceApi.setFavorite(id, isFavorite),
};

// ── Field normaliser ───────────────────────────────────────────────────────────

/**
 * Map backend `MarketplaceVehicleMember` fields to the UI's `MarketplaceVehicleRaw` shape.
 *
 * Backend sends:   isFavorite, finalPrice, originalPrice, color, images[]
 * UI expects:      isFavorited, priceAed, colour, coverImage
 */
function toPriceNumber(value: unknown): number | undefined {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/,/g, "").trim());
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

function normalizeVehicle(v: MarketplaceVehicleRaw): MarketplaceVehicleRaw {
  return {
    ...v,
    // isFavorite (backend) → isFavorited (UI state)
    isFavorited:
      (v as unknown as { isFavorite?: boolean }).isFavorite ??
      v.isFavorited ??
      false,
    // First image → coverImage
    coverImage:
      v.coverImage ??
      (Array.isArray(v.images) && v.images.length > 0 ? v.images[0] : null),
    // color → colour (legacy alias)
    colour: v.colour ?? v.color,
    // finalPrice → priceAed (legacy price display)
    priceAed:
      toPriceNumber(v.priceAed) ??
      toPriceNumber(v.finalPrice) ??
      toPriceNumber(v.originalPrice),
    // Normalise status to lowercase (backend sends AVAILABLE / RESERVED / SOLD)
    status: v.status
      ? ((v.status as string).toLowerCase() as typeof v.status)
      : v.status,
  };
}
