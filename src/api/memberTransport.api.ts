import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { stripEmptyRequestFields } from "@/lib/apiPayload";
import type {
  CreateMemberTransportRequestBody,
  CreateMemberTransportRequestResponse,
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
};