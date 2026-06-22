import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { toResourceId } from "@/lib/resourceId";
import type {
  AdminVehicleDetailResponse,
  AdminVehiclesResponse,
  AdminVehiclesSummaryKey,
} from "@/types/api";

export type AdminVehiclesQuery = {
  search?: string;
  storageBay?: string;
  summaryKey?: AdminVehiclesSummaryKey | "";
  level?: string;
  includeBayMap?: boolean;
  limit?: number;
  offset?: number;
};

export const adminVehiclesApi = {
  getVehicles: (query: AdminVehiclesQuery = {}) => {
    const params = new URLSearchParams();

    if (query.search) params.set("search", query.search);
    if (query.storageBay) params.set("storageBay", query.storageBay);
    if (query.summaryKey) params.set("summaryKey", query.summaryKey);
    if (query.level) params.set("level", query.level);
    if (query.includeBayMap !== undefined) {
      params.set("includeBayMap", String(query.includeBayMap));
    }
    if (query.limit !== undefined) params.set("limit", String(query.limit));
    if (query.offset !== undefined) params.set("offset", String(query.offset));

    const qs = params.toString();
    const endpoint = qs
      ? `${API_ENDPOINTS.vehicles.admin}?${qs}`
      : API_ENDPOINTS.vehicles.admin;

    return apiClient<AdminVehiclesResponse>(endpoint);
  },

  getVehicleById: (id: string | number) =>
    apiClient<AdminVehicleDetailResponse>(
      API_ENDPOINTS.vehicles.detail(toResourceId(id)),
    ),
};
