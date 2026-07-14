import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { stripEmptyRequestFields } from "@/lib/apiPayload";
import type {
  CreateDetailingBookingBody,
  CreateDetailingBookingResponse,
} from "@/types/api";

export const memberDetailingApi = {
  /**
   * POST /api/v1/detailing/bookings
   * Creates a detailing & wash booking for the authenticated member.
   */
  createBooking: (body: CreateDetailingBookingBody) =>
    apiClient<CreateDetailingBookingResponse>(
      API_ENDPOINTS.memberDetailing.bookings,
      {
        method: "POST",
        body: stripEmptyRequestFields(body),
      },
    ),
};
