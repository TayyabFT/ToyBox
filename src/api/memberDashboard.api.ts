import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { MemberDashboardSummaryResponse } from "@/types/api";

export const memberDashboardApi = {
  getSummary: () =>
    apiClient<MemberDashboardSummaryResponse>(API_ENDPOINTS.member.dashboard),
};
