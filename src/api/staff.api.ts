import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { toResourceId } from "@/lib/resourceId";
import type {
  StaffListResponse,
  StaffProfileResponse,
  StaffSummaryResponse,
} from "@/types/api";

type StaffQuery = {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
};

export const staffApi = {
  getSummary: () =>
    apiClient<StaffSummaryResponse>(API_ENDPOINTS.staff.summary),

  getStaff: (query: StaffQuery = {}) => {
    const params = new URLSearchParams();

    if (query.status) params.set("status", query.status);
    if (query.search) params.set("search", query.search);
    if (query.limit !== undefined) params.set("limit", String(query.limit));
    if (query.offset !== undefined) params.set("offset", String(query.offset));

    const qs = params.toString();
    const endpoint = qs
      ? `${API_ENDPOINTS.staff.list}?${qs}`
      : API_ENDPOINTS.staff.list;

    return apiClient<StaffListResponse>(endpoint);
  },

  getStaffById: (id: string | number) =>
    apiClient<StaffProfileResponse>(
      API_ENDPOINTS.staff.detail(toResourceId(id)),
    ),
};
