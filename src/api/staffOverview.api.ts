import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { StaffOverviewJobsResponse } from "@/types/api";

export const staffOverviewApi = {
  getJobs: () =>
    apiClient<StaffOverviewJobsResponse>(API_ENDPOINTS.staffOverview.jobs),
};
