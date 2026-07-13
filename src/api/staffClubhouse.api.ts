import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  StaffClubhouseReservationCancelRequest,
  StaffClubhouseReservationDetailResponse,
  StaffClubhouseReservationMessageRequest,
  StaffClubhouseReservationMutationResponse,
  StaffClubhouseReservationsListResponse,
  StaffClubhouseReservationUpdateRequest,
  StaffClubhouseSummaryResponse,
} from "@/types/api";

export type StaffClubhouseReservationsListQuery = {
  date?: string;
  zone?: string;
  status?: string;
  limit?: number;
  offset?: number;
};

function buildReservationsEndpoint(query: StaffClubhouseReservationsListQuery = {}) {
  const params = new URLSearchParams();

  if (query.date) params.set("date", query.date);
  if (query.zone) params.set("zone", query.zone);
  if (query.status) params.set("status", query.status);
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.offset !== undefined) params.set("offset", String(query.offset));

  const qs = params.toString();

  return qs
    ? `${API_ENDPOINTS.staffClubhouse.reservations}?${qs}`
    : API_ENDPOINTS.staffClubhouse.reservations;
}

export const staffClubhouseApi = {
  getSummary: () =>
    apiClient<StaffClubhouseSummaryResponse>(
      API_ENDPOINTS.staffClubhouse.summary,
    ),

  getReservations: (query: StaffClubhouseReservationsListQuery = {}) =>
    apiClient<StaffClubhouseReservationsListResponse>(
      buildReservationsEndpoint(query),
    ),

  getReservation: (id: string | number) =>
    apiClient<StaffClubhouseReservationDetailResponse>(
      API_ENDPOINTS.staffClubhouse.reservationDetail(id),
    ),

  updateReservation: (
    id: string | number,
    body: StaffClubhouseReservationUpdateRequest,
  ) =>
    apiClient<StaffClubhouseReservationMutationResponse>(
      API_ENDPOINTS.staffClubhouse.reservationDetail(id),
      {
        method: "PATCH",
        body,
      },
    ),

  approveReservation: (id: string | number) =>
    apiClient<StaffClubhouseReservationMutationResponse>(
      API_ENDPOINTS.staffClubhouse.reservationApprove(id),
      {
        method: "PATCH",
      },
    ),

  cancelReservation: (
    id: string | number,
    body: StaffClubhouseReservationCancelRequest = {},
  ) =>
    apiClient<StaffClubhouseReservationMutationResponse>(
      API_ENDPOINTS.staffClubhouse.reservationCancel(id),
      {
        method: "PATCH",
        body,
      },
    ),

  messageMember: (
    id: string | number,
    body: StaffClubhouseReservationMessageRequest,
  ) =>
    apiClient<StaffClubhouseReservationMutationResponse>(
      API_ENDPOINTS.staffClubhouse.reservationMessage(id),
      {
        method: "POST",
        body,
      },
    ),
};
