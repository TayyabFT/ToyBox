import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { stripEmptyRequestFields } from "@/lib/apiPayload";
import type {
  CreateDetailingBookingBody,
  CreateDetailingBookingResponse,
  MemberDetailingBookingsResponse,
  MemberDetailingBookingProgressResponse,
} from "@/types/api";

export const memberDetailingApi = {
  /**
   * GET /api/v1/detailing/bookings
   * Returns the member's detailing bookings (filtered by memberId on the server).
   */
  getBookings: (memberId: string) =>
    apiClient<MemberDetailingBookingsResponse>(
      `${API_ENDPOINTS.memberDetailing.bookings}?memberId=${encodeURIComponent(memberId)}`,
    ),

  /**
   * GET /api/v1/detailing/bookings/:id/progress
   * Returns the live booking status timeline.
   */
  getProgress: (bookingId: string) =>
    apiClient<MemberDetailingBookingProgressResponse>(
      `${API_ENDPOINTS.memberDetailing.bookings}/${encodeURIComponent(bookingId)}/progress`,
    ),

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
