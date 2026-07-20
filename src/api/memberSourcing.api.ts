import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { stripEmptyRequestFields } from "@/lib/apiPayload";
import type {
  CreateSourcingRequestBody,
  CreateSourcingRequestResponse,
  MemberSourcingRequestsResponse,
  SourcingRequestStatusResponse,
} from "@/types/api";

export const memberSourcingApi = {
  /**
   * POST /api/v1/sourcing/requests
   * Submits a new vehicle sourcing request for the authenticated member.
   */
  createRequest: (body: CreateSourcingRequestBody) =>
    apiClient<CreateSourcingRequestResponse>(
      API_ENDPOINTS.memberSourcing.requests,
      {
        method: "POST",
        body: stripEmptyRequestFields(body),
      },
    ),

  /**
   * GET /api/v1/sourcing/requests?memberId=...
   * Returns only the authenticated member's sourcing request history.
   */
  listRequests: (memberId: string) =>
    apiClient<MemberSourcingRequestsResponse>(
      `${API_ENDPOINTS.memberSourcing.requests}?memberId=${encodeURIComponent(memberId)}`,
    ),

  /**
   * GET /api/v1/sourcing/requests/:id/status
   * Returns the status timeline for a sourcing request.
   */
  getStatus: (id: string) =>
    apiClient<SourcingRequestStatusResponse>(
      API_ENDPOINTS.memberSourcing.status(id),
    ),

  /**
   * POST /api/v1/sourcing/requests/:id/approve-vehicle
   * Member approves the pending vehicle offer.
   */
  approveVehicle: (id: string) =>
    apiClient<{ success: boolean; data: { approved: boolean; message?: string } }>(
      API_ENDPOINTS.memberSourcing.approveVehicle(id),
      { method: "POST" },
    ),

  /**
   * POST /api/v1/sourcing/requests/:id/reject-vehicle
   * Member rejects the pending vehicle offer.
   */
  rejectVehicle: (id: string, rejectionReason?: string) =>
    apiClient<{ success: boolean; data: { message?: string } }>(
      API_ENDPOINTS.memberSourcing.rejectVehicle(id),
      {
        method: "POST",
        body: rejectionReason?.trim() ? { rejectionReason: rejectionReason.trim() } : undefined,
      },
    ),
};
