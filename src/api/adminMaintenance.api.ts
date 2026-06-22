import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { AdminMaintenanceRequestsResponse } from "@/types/api";

export const adminMaintenanceApi = {
  getRequests: () =>
    apiClient<AdminMaintenanceRequestsResponse>(
      API_ENDPOINTS.maintenance.requests,
    ),
};
