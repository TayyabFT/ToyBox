import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  buildMarketplaceVehicleFormData,
  buildMarketplaceVehicleWizardPayload,
  marketplaceVehicleNeedsMultipart,
  type MarketplaceVehicleWizardForm,
} from "@/lib/adminMarketplace";
import type {
  MarketplaceOfferActionRequest,
  MarketplaceOfferActionResponse,
  MarketplaceOfferDetailResponse,
  MarketplaceOffersListResponse,
  MarketplaceVehicleDetailResponse,
  MarketplaceVehicleMutationResponse,
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

  createVehicle: (form: MarketplaceVehicleWizardForm) => {
    if (marketplaceVehicleNeedsMultipart(form)) {
      return apiClient<MarketplaceVehicleMutationResponse>(
        API_ENDPOINTS.adminMarketplace.vehicles,
        {
          method: "POST",
          formData: buildMarketplaceVehicleFormData(form),
        },
      );
    }

    return apiClient<MarketplaceVehicleMutationResponse>(
      API_ENDPOINTS.adminMarketplace.vehicles,
      {
        method: "POST",
        body: buildMarketplaceVehicleWizardPayload(form),
      },
    );
  },

  updateVehicle: (id: string | number, form: MarketplaceVehicleWizardForm) => {
    if (marketplaceVehicleNeedsMultipart(form)) {
      return apiClient<MarketplaceVehicleMutationResponse>(
        API_ENDPOINTS.adminMarketplace.vehicleDetail(id),
        {
          method: "PATCH",
          formData: buildMarketplaceVehicleFormData(form),
        },
      );
    }

    return apiClient<MarketplaceVehicleMutationResponse>(
      API_ENDPOINTS.adminMarketplace.vehicleDetail(id),
      {
        method: "PATCH",
        body: buildMarketplaceVehicleWizardPayload(form),
      },
    );
  },

  deleteVehicle: (id: string | number) =>
    apiClient<MarketplaceVehicleMutationResponse>(
      API_ENDPOINTS.adminMarketplace.vehicleDetail(id),
      {
        method: "DELETE",
      },
    ),
};
