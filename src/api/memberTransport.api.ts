import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { stripEmptyRequestFields } from "@/lib/apiPayload";
import type {
  CreateMemberTransportRequestBody,
  CreateMemberTransportRequestResponse,
  MemberTransportRequestStatusResponse,
} from "@/types/api";

export const memberTransportApi = {
  /**
   * POST /api/v1/transport/requests
   * Creates a transport & delivery request for the authenticated member.
   */
  createRequest: (body: CreateMemberTransportRequestBody) =>
    apiClient<CreateMemberTransportRequestResponse>(
      API_ENDPOINTS.memberTransport.requests,
      {
        method: "POST",
        body: stripEmptyRequestFields(body),
      },
    ),

  /**
   * GET /api/v1/transport/requests/:id/status
   * Returns the live status and timeline for a transport request.
   */
  getStatus: (requestId: string) =>
    apiClient<MemberTransportRequestStatusResponse>(
      `${API_ENDPOINTS.memberTransport.requests}/${encodeURIComponent(requestId)}/status`,
    ),
};