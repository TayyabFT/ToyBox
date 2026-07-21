import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  AdminNavigationBadgeKey,
  AdminNavigationBadgeResolveResponse,
  AdminNavigationBadgesResponse,
} from "@/types/api";

export const adminNavigationApi = {
  getBadges: () =>
    apiClient<AdminNavigationBadgesResponse>(
      API_ENDPOINTS.adminNavigation.badges,
    ),
  resolveBadge: (key: AdminNavigationBadgeKey) =>
    apiClient<AdminNavigationBadgeResolveResponse>(
      API_ENDPOINTS.adminNavigation.resolveBadge,
      { method: "POST", body: { key } },
    ),
};
