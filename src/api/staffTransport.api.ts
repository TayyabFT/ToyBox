import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { StaffTransportRequestsResponse } from "@/types/api";

export type StaffTransportRequestsQuery = {
  tab?: string;
};

export const staffTransportApi = {
  getRequests: (query: StaffTransportRequestsQuery = {}) => {
    const params = new URLSearchParams();

    if (query.tab) params.set("tab", query.tab);

    const qs = params.toString();
    const endpoint = qs
      ? `${API_ENDPOINTS.staffTransport.requests}?${qs}`
      : API_ENDPOINTS.staffTransport.requests;

    return apiClient<StaffTransportRequestsResponse>(endpoint);
  },
};
