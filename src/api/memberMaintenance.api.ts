import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { stripEmptyRequestFields } from "@/lib/apiPayload";
import type {
  CreateMaintenanceRequestBody,
  CreateMaintenanceRequestResponse,
} from "@/types/api";

export const memberMaintenanceApi = {
  /**
   * POST /api/v1/maintenance/requests
   * Creates a maintenance & service request for the authenticated member.
   */
  createRequest: (body: CreateMaintenanceRequestBody) =>
    apiClient<CreateMaintenanceRequestResponse>(
      API_ENDPOINTS.memberMaintenance.requests,
      {
        method: "POST",
        body: stripEmptyRequestFields(body),
      },
    ),
};
