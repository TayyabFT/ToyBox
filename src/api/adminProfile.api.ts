import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  AdminProfileActivityResponse,
  AdminProfileOverviewResponse,
  AdminProfileResponse,
  AdminProfileUpdateRequest,
  AdminSessionsResponse,
} from "@/types/api";

export const adminProfileApi = {
  getOverview: () =>
    apiClient<AdminProfileOverviewResponse>(
      API_ENDPOINTS.adminProfile.overview,
    ),

  getProfile: () =>
    apiClient<AdminProfileResponse>(API_ENDPOINTS.adminProfile.profile),

  updateProfile: (data: AdminProfileUpdateRequest) =>
    apiClient<AdminProfileResponse>(API_ENDPOINTS.adminProfile.profile, {
      method: "PATCH",
      body: data,
    }),

  getActivity: () =>
    apiClient<AdminProfileActivityResponse>(
      API_ENDPOINTS.adminProfile.activity,
    ),

  getSessions: () =>
    apiClient<AdminSessionsResponse>(API_ENDPOINTS.adminProfile.sessions),
};
