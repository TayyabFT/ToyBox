import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  ClubhouseOverviewResponse,
  ClubhouseSpacesResponse,
} from "@/types/api";

export const clubhouseApi = {
  getOverview: () =>
    apiClient<ClubhouseOverviewResponse>(API_ENDPOINTS.clubhouse.overview),

  getSpaces: () =>
    apiClient<ClubhouseSpacesResponse>(API_ENDPOINTS.clubhouse.spaces),
};
