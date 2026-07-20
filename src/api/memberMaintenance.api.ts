import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { stripEmptyRequestFields } from "@/lib/apiPayload";
import type {
  CreateMaintenanceRequestBody,
  CreateMaintenanceRequestResponse,
  MemberMaintenanceRequestsResponse,
  MemberMaintenanceRequestStatusResponse,
} from "@/types/api";

export const memberMaintenanceApi = {
  /**
   * GET /api/v1/maintenance/requests?memberId=...
   * Returns the member's maintenance requests.
   */
  getRequests: (memberId: string) =>
    apiClient<MemberMaintenanceRequestsResponse>(
      `${API_ENDPOINTS.memberMaintenance.requests}?memberId=${encodeURIComponent(memberId)}`,
    ),

  /**
   * GET /api/v1/maintenance/requests/:id/status
   * Returns the live status timeline for a request.
   */
  getStatus: (requestId: string) =>
    apiClient<MemberMaintenanceRequestStatusResponse>(
      `${API_ENDPOINTS.memberMaintenance.requests}/${encodeURIComponent(requestId)}/status`,
    ),

  /**
   * PATCH /api/v1/maintenance/requests/:id/cancel
   * Cancels an active maintenance request.
   */
  cancelRequest: (requestId: string) =>
    apiClient<MemberMaintenanceRequestStatusResponse>(
      `${API_ENDPOINTS.memberMaintenance.requests}/${encodeURIComponent(requestId)}/cancel`,
      { method: "PATCH" },
    ),

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
