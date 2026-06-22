import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { AdminOverviewJobsResponse } from "@/types/api";

export const adminOverviewApi = {
  getJobs: () => apiClient<AdminOverviewJobsResponse>(API_ENDPOINTS.overview.jobs),
};
