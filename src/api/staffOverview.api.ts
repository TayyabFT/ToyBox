import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  StaffOverviewJobsResponse,
  StaffOverviewResponse,
} from "@/types/api";

export const staffOverviewApi = {
  getOverview: () =>
    apiClient<StaffOverviewResponse>(API_ENDPOINTS.staffOverview.overview),
  getJobs: () =>
    apiClient<StaffOverviewJobsResponse>(API_ENDPOINTS.staffOverview.jobs),
};
