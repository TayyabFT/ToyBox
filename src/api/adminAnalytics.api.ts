import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  AdminAnalyticsDashboardResponse,
  AdminAnalyticsStatsResponse,
} from "@/types/api";

export const adminAnalyticsApi = {
  getStats: () =>
    apiClient<AdminAnalyticsStatsResponse>(API_ENDPOINTS.adminAnalytics.stats),

  getDashboard: () =>
    apiClient<AdminAnalyticsDashboardResponse>(
      API_ENDPOINTS.adminAnalytics.dashboard,
    ),
};
