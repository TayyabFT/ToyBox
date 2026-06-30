import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  ApiError,
  ApiResponse,
  WorkshopDashboardBaysResponse,
  WorkshopDashboardQueueResponse,
  WorkshopDashboardStatsResponse,
} from "@/types/api";

function ensureSuccess<T>(response: ApiResponse<T>): ApiResponse<T> {
  if (!response.success) {
    const error: ApiError = {
      status: 0,
      message: response.message || "Request failed",
    };
    throw error;
  }

  return response;
}

export type WorkshopQueueQuery = {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  q?: string;
};

export const adminWorkshopApi = {
  getDashboardStats: async () =>
    ensureSuccess(
      await apiClient<WorkshopDashboardStatsResponse>(
        API_ENDPOINTS.workshop.dashboardStats,
      ),
    ),

  getDashboardBays: async () =>
    ensureSuccess(
      await apiClient<WorkshopDashboardBaysResponse>(
        API_ENDPOINTS.workshop.dashboardBays,
      ),
    ),

  getDashboardQueue: async (query: WorkshopQueueQuery = {}) => {
    const params = new URLSearchParams();

    if (query.page !== undefined) params.set("page", String(query.page));
    if (query.limit !== undefined) params.set("limit", String(query.limit));
    if (query.category) params.set("category", query.category);
    if (query.status) params.set("status", query.status);
    if (query.q) params.set("q", query.q);

    const qs = params.toString();
    const endpoint = qs
      ? `${API_ENDPOINTS.workshop.dashboardQueue}?${qs}`
      : API_ENDPOINTS.workshop.dashboardQueue;

    return ensureSuccess(
      await apiClient<WorkshopDashboardQueueResponse>(endpoint),
    );
  },
};
