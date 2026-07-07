import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  StaffOperationalUpdateCreateRequest,
  StaffOperationalUpdateDetailResponse,
  StaffOperationalUpdateMutationResponse,
  StaffOperationalUpdatePinRequest,
  StaffOperationalUpdatesFeedResponse,
  StaffOperationalUpdatesPinnedResponse,
  StaffOperationalUpdatesShiftLogResponse,
  StaffOperationalUpdatesSummaryResponse,
} from "@/types/api";

export type StaffOperationalUpdatesFeedQuery = {
  filter?: string;
  search?: string;
  limit?: number;
  offset?: number;
};

function buildFeedEndpoint(query: StaffOperationalUpdatesFeedQuery = {}) {
  const params = new URLSearchParams();

  if (query.filter) params.set("filter", query.filter);
  if (query.search) params.set("search", query.search);
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.offset !== undefined) params.set("offset", String(query.offset));

  const qs = params.toString();

  return qs
    ? `${API_ENDPOINTS.staffOperationalUpdates.feed}?${qs}`
    : API_ENDPOINTS.staffOperationalUpdates.feed;
}

export const staffOperationalUpdatesApi = {
  getSummary: () =>
    apiClient<StaffOperationalUpdatesSummaryResponse>(
      API_ENDPOINTS.staffOperationalUpdates.summary,
    ),

  getFeed: (query: StaffOperationalUpdatesFeedQuery = {}) =>
    apiClient<StaffOperationalUpdatesFeedResponse>(buildFeedEndpoint(query)),

  getPinned: () =>
    apiClient<StaffOperationalUpdatesPinnedResponse>(
      API_ENDPOINTS.staffOperationalUpdates.pinned,
    ),

  getMyShiftLog: () =>
    apiClient<StaffOperationalUpdatesShiftLogResponse>(
      API_ENDPOINTS.staffOperationalUpdates.myShiftLog,
    ),

  getDetail: (id: string | number) =>
    apiClient<StaffOperationalUpdateDetailResponse>(
      API_ENDPOINTS.staffOperationalUpdates.detail(id),
    ),

  create: (body: StaffOperationalUpdateCreateRequest) =>
    apiClient<StaffOperationalUpdateMutationResponse>(
      API_ENDPOINTS.staffOperationalUpdates.list,
      {
        method: "POST",
        body,
      },
    ),

  setPinned: (id: string | number, body: StaffOperationalUpdatePinRequest) =>
    apiClient<StaffOperationalUpdateMutationResponse>(
      API_ENDPOINTS.staffOperationalUpdates.pin(id),
      {
        method: "PATCH",
        body,
      },
    ),
};
