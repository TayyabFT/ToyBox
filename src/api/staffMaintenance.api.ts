import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { StaffMaintenanceRequestsResponse } from "@/types/api";

export const staffMaintenanceApi = {
  getRequests: () =>
    apiClient<StaffMaintenanceRequestsResponse>(
      API_ENDPOINTS.staffMaintenance.requests,
    ),
};
