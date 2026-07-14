import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  ClubhouseOverviewResponse,
  ClubhouseSpacesResponse,
  ClubhouseSpacesByCategoryResponse,
  ClubhouseAvailabilityResponse,
  ClubhouseReservationResponse,
} from "@/types/api";

export const clubhouseApi = {
  getOverview: () =>
    apiClient<ClubhouseOverviewResponse>(API_ENDPOINTS.clubhouse.overview),

  getSpaces: () =>
    apiClient<ClubhouseSpacesResponse>(API_ENDPOINTS.clubhouse.spaces),

  getSpacesByAreaType: (areaType: string) =>
    apiClient<ClubhouseSpacesResponse>(
      `${API_ENDPOINTS.clubhouse.spaces}?areaType=${encodeURIComponent(areaType)}`
    ),

  /**
   * Fetch spaces filtered by areaType + optional sub-category.
   * Powers the "Select Space" dropdown in the reservation modal.
   * @param areaType  "restaurant" | "private_lounge" | "suite_lounge"
   * @param type      Sub-category string e.g. "Cigar rooms", "Private dining"
   */
  getSpacesByCategory: (areaType: string, type?: string) => {
    const params = new URLSearchParams({ areaType });
    if (type) params.set("type", type);
    return apiClient<ClubhouseSpacesByCategoryResponse>(
      `${API_ENDPOINTS.clubhouse.spacesByCategory}?${params.toString()}`
    );
  },

  getAvailability: (id: string, date: string, guests: number) =>
    apiClient<ClubhouseAvailabilityResponse>(
      `${API_ENDPOINTS.clubhouse.availability(id)}?date=${date}&guests=${guests}`
    ),

  createReservation: (body: {
    areaId: string;
    date: string;
    fromTime: string;
    toTime?: string;
    guests: number;
    occasion?: string | null;
    specialRequests?: string | null;
    contactNumber?: string | null;
    arrivalNote?: string | null;
    billedTo: "member_account" | "saved_card";
    acceptCancellationPolicy: boolean;
  }) =>
    apiClient<ClubhouseReservationResponse>(API_ENDPOINTS.clubhouse.reservations, {
      method: "POST",
      body,
    }),
};
