import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { toResourceId } from "@/lib/resourceId";
import type {
  MemberTierFilter,
  MembersListResponse,
  MemberProfileResponse,
  MembersSummaryResponse,
} from "@/types/api";

type MembersQuery = {
  tier?: MemberTierFilter;
  search?: string;
  limit?: number;
  offset?: number;
};

export const membersApi = {
  getSummary: () =>
    apiClient<MembersSummaryResponse>(API_ENDPOINTS.members.summary),

  getMembers: (query: MembersQuery = {}) => {
    const params = new URLSearchParams();

    if (query.tier) params.set("tier", query.tier);
    if (query.search) params.set("search", query.search);
    if (query.limit !== undefined) params.set("limit", String(query.limit));
    if (query.offset !== undefined) params.set("offset", String(query.offset));

    const qs = params.toString();
    const endpoint = qs
      ? `${API_ENDPOINTS.members.list}?${qs}`
      : API_ENDPOINTS.members.list;

    return apiClient<MembersListResponse>(endpoint);
  },

  getMemberById: (id: string | number) =>
    apiClient<MemberProfileResponse>(
      API_ENDPOINTS.members.detail(toResourceId(id)),
    ),
};
