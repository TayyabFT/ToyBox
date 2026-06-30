import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  CommunicationsAudiencePreviewResponse,
  CommunicationsBulletinsResponse,
  CommunicationsStatsResponse,
  CreateBulletinRequest,
  CreateBulletinResponse,
} from "@/types/api";

export type CommunicationsBulletinsQuery = {
  limit?: number;
  offset?: number;
};

export const adminCommunicationsApi = {
  getStats: () =>
    apiClient<CommunicationsStatsResponse>(API_ENDPOINTS.communications.stats),

  getBulletins: (query: CommunicationsBulletinsQuery = {}) => {
    const params = new URLSearchParams();

    if (query.limit !== undefined) params.set("limit", String(query.limit));
    if (query.offset !== undefined) params.set("offset", String(query.offset));

    const qs = params.toString();
    const endpoint = qs
      ? `${API_ENDPOINTS.communications.bulletins}?${qs}`
      : API_ENDPOINTS.communications.bulletins;

    return apiClient<CommunicationsBulletinsResponse>(endpoint);
  },

  getAudiencePreview: () =>
    apiClient<CommunicationsAudiencePreviewResponse>(
      API_ENDPOINTS.communications.audiencePreview,
    ),

  createBulletin: (payload: CreateBulletinRequest) =>
    apiClient<CreateBulletinResponse>(API_ENDPOINTS.communications.bulletins, {
      method: "POST",
      body: payload,
    }),
};
