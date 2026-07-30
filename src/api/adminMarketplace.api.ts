import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  MarketplaceOfferActionRequest,
  MarketplaceOfferActionResponse,
  MarketplaceOfferDetailResponse,
  MarketplaceOffersListResponse,
  MarketplaceVehicleCreateRequest,
  MarketplaceVehicleDetailResponse,
  MarketplaceVehicleMutationResponse,
  MarketplaceVehicleUpdateRequest,
  MarketplaceVehiclesListResponse,
} from "@/types/api";

export const adminMarketplaceApi = {
  getOffers: () =>
    apiClient<MarketplaceOffersListResponse>(
      API_ENDPOINTS.adminMarketplace.offers,
    ),

  getOffer: (id: string | number) =>
    apiClient<MarketplaceOfferDetailResponse>(
      API_ENDPOINTS.adminMarketplace.offerDetail(id),
    ),

  actOnOffer: (id: string | number, body: MarketplaceOfferActionRequest) =>
    apiClient<MarketplaceOfferActionResponse>(
      API_ENDPOINTS.adminMarketplace.offerAction(id),
      {
        method: "PATCH",
        body: {
          action: body.action,
          counterOfferPrice: body.counterOfferPrice ?? 0,
          remarks: body.remarks ?? "",
        },
      },
    ),

  getVehicles: () =>
    apiClient<MarketplaceVehiclesListResponse>(
      API_ENDPOINTS.adminMarketplace.vehicles,
    ),

  getVehicle: (id: string | number) =>
    apiClient<MarketplaceVehicleDetailResponse>(
      API_ENDPOINTS.adminMarketplace.vehicleDetail(id),
    ),

  createVehicle: (body: MarketplaceVehicleCreateRequest) =>
    apiClient<MarketplaceVehicleMutationResponse>(
      API_ENDPOINTS.adminMarketplace.vehicles,
      {
        method: "POST",
        body,
      },
    ),

  updateVehicle: (id: string | number, body: MarketplaceVehicleUpdateRequest) =>
    apiClient<MarketplaceVehicleMutationResponse>(
      API_ENDPOINTS.adminMarketplace.vehicleDetail(id),
      {
        method: "PATCH",
        body,
      },
    ),

  deleteVehicle: (id: string | number) =>
    apiClient<MarketplaceVehicleMutationResponse>(
      API_ENDPOINTS.adminMarketplace.vehicleDetail(id),
      {
        method: "DELETE",
      },
    ),
};
