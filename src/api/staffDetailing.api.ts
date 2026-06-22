import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { StaffDetailingBookingsResponse } from "@/types/api";

export const staffDetailingApi = {
  getBookings: () =>
    apiClient<StaffDetailingBookingsResponse>(
      API_ENDPOINTS.staffDetailing.bookings,
    ),
};
