import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  ClubhouseOverviewResponse,
  ClubhouseSpacesResponse,
  ClubhouseAvailabilityResponse,
  ClubhouseReservationResponse,
} from "@/types/api";

export const clubhouseApi = {
  getOverview: () =>
    apiClient<ClubhouseOverviewResponse>(API_ENDPOINTS.clubhouse.overview),

  getSpaces: () =>
    apiClient<ClubhouseSpacesResponse>(API_ENDPOINTS.clubhouse.spaces),

  getAvailability: (id: string, date: string, guests: number) =>
    apiClient<ClubhouseAvailabilityResponse>(
      `${API_ENDPOINTS.clubhouse.availability(id)}?date=${date}&guests=${guests}`
    ),

  createReservation: (body: {
    areaId: string;
    date: string;
    timeSlot: string;
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
