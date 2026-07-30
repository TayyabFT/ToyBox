import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { memberMarketplaceApi, type MarketplaceListingsParams } from "@/api/memberMarketplace.api";
import { MOCK_MARKETPLACE_LISTINGS } from "@/components/member/marketplace/mockListings";
import type { MarketplaceVehicleRaw } from "@/types/api";

// ── State ─────────────────────────────────────────────────────────────────────

type MarketplaceState = {
  featured: MarketplaceVehicleRaw[];
  listings: MarketplaceVehicleRaw[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
  /** Per-vehicle offer submission loading (id → boolean) */
  purchaseLoading: Record<string, boolean>;
  /** Per-vehicle favorite toggle loading (id → boolean) */
  favoriteLoading: Record<string, boolean>;
  activeFilter: string;
  searchQuery: string;
};

const initialState: MarketplaceState = {
  featured: [],
  listings: [],
  loading: false,
  loaded: false,
  error: null,
  purchaseLoading: {},
  favoriteLoading: {},
  activeFilter: "all",
  searchQuery: "",
};

// ── Thunks ────────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/marketplace/vehicles
 * Fetches AVAILABLE marketplace vehicles for the catalogue.
 */
export const fetchMarketplaceListings = createAsyncThunk(
  "marketplace/fetchListings",
  async (params: MarketplaceListingsParams | undefined, { rejectWithValue }) => {
    try {
      const res = await memberMarketplaceApi.getListings(params);
      const data = res.data;

      // Support both response shapes:
      //   /marketplace/vehicles  → data.vehicles[]
      //   legacy /listings       → data.featured[] + data.listings[]
      const vehicles = data?.vehicles ?? [];
      const featured = data?.featured ?? [];
      const listings = data?.listings ?? [];

      // Empty → fall back to mock data so the page always shows content
      if (vehicles.length === 0 && featured.length === 0 && listings.length === 0) {
        return {
          featured: MOCK_MARKETPLACE_LISTINGS.filter((v) => v.isFeatured),
          listings: MOCK_MARKETPLACE_LISTINGS.filter((v) => !v.isFeatured),
        };
      }

      // vehicles[] response: all vehicles go into listings[]
      // The page picks its own hero from the first item — no isFeatured needed
      if (vehicles.length > 0) {
        return {
          featured: [],
          listings: vehicles,
        };
      }

      return { featured, listings };
    } catch {
      // API unavailable → use mock data
      return {
        featured: MOCK_MARKETPLACE_LISTINGS.filter((v) => v.isFeatured),
        listings: MOCK_MARKETPLACE_LISTINGS.filter((v) => !v.isFeatured),
      };
    }
  },
);

/**
 * POST /api/v1/marketplace/offers
 * Submit an offer (expression of interest) on a vehicle.
 * Body: { vehicleId, offerPrice }
 *
 * offerPrice defaults to the vehicle's finalPrice / priceAed when not supplied
 * (the member is expressing interest, not negotiating a price).
 */
export const purchaseMarketplaceListing = createAsyncThunk(
  "marketplace/purchase",
  async (
    { id, offerPrice }: { id: string; offerPrice?: number },
    { rejectWithValue, getState },
  ) => {
    try {
      // Resolve the vehicle's listed price if no offerPrice provided
      const state = getState() as { marketplace: MarketplaceState };
      const allVehicles = [
        ...state.marketplace.featured,
        ...state.marketplace.listings,
      ];
      const vehicle = allVehicles.find((v) => v.id === id);
      const price = offerPrice ?? vehicle?.finalPrice ?? vehicle?.priceAed ?? 0;

      const res = await memberMarketplaceApi.submitOffer(id, price);
      return { id, data: res.data };
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message ?? "Failed to submit offer");
    }
  },
);

/**
 * PATCH /api/v1/marketplace/vehicles/:id/favorite
 * Add or remove a vehicle from the member's favourites.
 * Body: { isFavorite: boolean }
 */
export const toggleMarketplaceFavorite = createAsyncThunk(
  "marketplace/toggleFavorite",
  async (
    { id, isFavorited }: { id: string; isFavorited: boolean },
    { rejectWithValue },
  ) => {
    try {
      // isFavorited is the CURRENT state → we want to flip it
      const nextFavorite = !isFavorited;
      const res = await memberMarketplaceApi.setFavorite(id, nextFavorite);
      // Backend returns { isFavorite: boolean } — use it as source of truth
      const confirmed = res.data?.isFavorite ?? nextFavorite;
      return { id, isFavorited: confirmed };
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message ?? "Failed to update favourite");
    }
  },
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const marketplaceSlice = createSlice({
  name: "marketplace",
  initialState,
  reducers: {
    setMarketplaceFilter: (state, action: PayloadAction<string>) => {
      state.activeFilter = action.payload;
    },
    setMarketplaceSearch: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearMarketplace: (state) => {
      state.featured = [];
      state.listings = [];
      state.loaded = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── fetchMarketplaceListings ──────────────────────────────────────────
      .addCase(fetchMarketplaceListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketplaceListings.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.featured = action.payload.featured;
        state.listings = action.payload.listings;
      })
      .addCase(fetchMarketplaceListings.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Failed to load marketplace";
      })

      // ── purchaseMarketplaceListing (submit offer) ─────────────────────────
      .addCase(purchaseMarketplaceListing.pending, (state, action) => {
        state.purchaseLoading[action.meta.arg.id] = true;
      })
      .addCase(purchaseMarketplaceListing.fulfilled, (state, action) => {
        state.purchaseLoading[action.payload.id] = false;
        // Optimistically mark the vehicle as reserved
        const markReserved = (v: MarketplaceVehicleRaw) =>
          v.id === action.payload.id
            ? { ...v, status: "reserved" as typeof v.status, statusLabel: "Reserved" }
            : v;
        state.listings = state.listings.map(markReserved);
        state.featured = state.featured.map(markReserved);
      })
      .addCase(purchaseMarketplaceListing.rejected, (state, action) => {
        state.purchaseLoading[action.meta.arg.id] = false;
      })

      // ── toggleMarketplaceFavorite ─────────────────────────────────────────
      .addCase(toggleMarketplaceFavorite.pending, (state, action) => {
        state.favoriteLoading[action.meta.arg.id] = true;
      })
      .addCase(toggleMarketplaceFavorite.fulfilled, (state, action) => {
        state.favoriteLoading[action.payload.id] = false;
        const updateFav = (v: MarketplaceVehicleRaw) =>
          v.id === action.payload.id
            ? { ...v, isFavorited: action.payload.isFavorited }
            : v;
        state.listings = state.listings.map(updateFav);
        state.featured = state.featured.map(updateFav);
      })
      .addCase(toggleMarketplaceFavorite.rejected, (state, action) => {
        state.favoriteLoading[action.meta.arg.id] = false;
      });
  },
});

export const {
  setMarketplaceFilter,
  setMarketplaceSearch,
  clearMarketplace,
} = marketplaceSlice.actions;

export default marketplaceSlice.reducer;
