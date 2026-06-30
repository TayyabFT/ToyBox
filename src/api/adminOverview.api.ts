import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { AdminOverviewJobsResponse, AdminOverviewResponse } from "@/types/api";

export const adminOverviewApi = {
  getOverview: () => apiClient<AdminOverviewResponse>(API_ENDPOINTS.overview.main),
  getJobs: () => apiClient<AdminOverviewJobsResponse>(API_ENDPOINTS.overview.jobs),
};
