import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { stripEmptyRequestFields } from "@/lib/apiPayload";
import type {
  CreateSourcingRequestBody,
  CreateSourcingRequestResponse,
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
   * GET /api/v1/sourcing/requests/:id/status
   * Returns the status timeline for a sourcing request.
   */
  getStatus: (id: string) =>
    apiClient<SourcingRequestStatusResponse>(
      API_ENDPOINTS.memberSourcing.status(id),
    ),
};
