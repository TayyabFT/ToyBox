import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  AdminServiceRequestJobDetailResponse,
  AdminServiceRequestJobsListResponse,
} from "@/types/api";

export const adminServiceRequestJobsApi = {
  getActiveJobs: () =>
    apiClient<AdminServiceRequestJobsListResponse>(
      API_ENDPOINTS.adminServiceRequestJobs.active,
    ),
  getAllJobs: () =>
    apiClient<AdminServiceRequestJobsListResponse>(
      API_ENDPOINTS.adminServiceRequestJobs.all,
    ),
  getJobDetail: (taskQueueId: string) =>
    apiClient<AdminServiceRequestJobDetailResponse>(
      API_ENDPOINTS.adminServiceRequestJobs.detail(taskQueueId),
    ),
};
