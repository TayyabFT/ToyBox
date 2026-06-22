import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { AdminDetailingBookingsResponse } from "@/types/api";

export const adminDetailingApi = {
  getBookings: () =>
    apiClient<AdminDetailingBookingsResponse>(API_ENDPOINTS.detailing.bookings),
};
