import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { AdminTransportRequestsResponse } from "@/types/api";

export type AdminTransportRequestsQuery = {
  tab?: string;
};

export const adminTransportApi = {
  getRequests: (query: AdminTransportRequestsQuery = {}) => {
    const params = new URLSearchParams();

    if (query.tab) params.set("tab", query.tab);

    const qs = params.toString();
    const endpoint = qs
      ? `${API_ENDPOINTS.transport.requests}?${qs}`
      : API_ENDPOINTS.transport.requests;

    return apiClient<AdminTransportRequestsResponse>(endpoint);
  },
};
