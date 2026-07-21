import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  StaffNavigationBadgeResolveResponse,
  StaffNavigationBadgesResponse,
} from "@/types/api";

export const staffNavigationApi = {
  getBadges: () =>
    apiClient<StaffNavigationBadgesResponse>(
      API_ENDPOINTS.staffNavigation.badges,
    ),
  resolveBadge: (key: string) =>
    apiClient<StaffNavigationBadgeResolveResponse>(
      API_ENDPOINTS.staffNavigation.resolveBadge,
      { method: "POST", body: { key } },
    ),
};
