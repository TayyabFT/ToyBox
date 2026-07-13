import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  StaffParkingSessionAcceptRequest,
  StaffParkingSessionCompleteRequest,
  StaffParkingSessionDetailResponse,
  StaffParkingSessionMutationResponse,
  StaffParkingSessionStartRequest,
  StaffParkingSessionsListResponse,
  StaffParkingSlotCreateRequest,
  StaffParkingSlotCreateResponse,
  StaffParkingSlotDeleteResponse,
  StaffParkingSlotDetailResponse,
  StaffParkingSlotUpdateRequest,
  StaffParkingSlotUpdateResponse,
  StaffParkingSlotsListResponse,
  StaffParkingSlotsSummaryResponse,
} from "@/types/api";

export type StaffParkingSlotsListQuery = {
  search?: string;
  status?: string;
  zone?: string;
  level?: string;
  limit?: number;
  offset?: number;
};

export type StaffParkingSessionsListQuery = {
  search?: string;
  status?: string;
  limit?: number;
  offset?: number;
};

function buildListEndpoint(query: StaffParkingSlotsListQuery = {}) {
  const params = new URLSearchParams();

  if (query.search) params.set("search", query.search);
  if (query.status) params.set("status", query.status);
  if (query.zone) params.set("zone", query.zone);
  if (query.level) params.set("level", query.level);
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.offset !== undefined) params.set("offset", String(query.offset));

  const qs = params.toString();

  return qs
    ? `${API_ENDPOINTS.staffParking.slots}?${qs}`
    : API_ENDPOINTS.staffParking.slots;
}

function buildSessionsEndpoint(query: StaffParkingSessionsListQuery = {}) {
  const params = new URLSearchParams();

  if (query.search) params.set("search", query.search);
  if (query.status) params.set("status", query.status);
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.offset !== undefined) params.set("offset", String(query.offset));

  const qs = params.toString();

  return qs
    ? `${API_ENDPOINTS.staffParking.sessions}?${qs}`
    : API_ENDPOINTS.staffParking.sessions;
}

export const staffParkingApi = {
  getSlots: (query: StaffParkingSlotsListQuery = {}) =>
    apiClient<StaffParkingSlotsListResponse>(buildListEndpoint(query)),

  getSummary: () =>
    apiClient<StaffParkingSlotsSummaryResponse>(
      API_ENDPOINTS.staffParking.summary,
    ),

  getSlot: (id: string | number) =>
    apiClient<StaffParkingSlotDetailResponse>(
      API_ENDPOINTS.staffParking.slotDetail(id),
    ),

  createSlot: (body: StaffParkingSlotCreateRequest) =>
    apiClient<StaffParkingSlotCreateResponse>(
      API_ENDPOINTS.staffParking.slots,
      {
        method: "POST",
        body,
      },
    ),

  updateSlot: (id: string | number, body: StaffParkingSlotUpdateRequest) =>
    apiClient<StaffParkingSlotUpdateResponse>(
      API_ENDPOINTS.staffParking.slotDetail(id),
      {
        method: "PATCH",
        body,
      },
    ),

  deleteSlot: (id: string | number) =>
    apiClient<StaffParkingSlotDeleteResponse>(
      API_ENDPOINTS.staffParking.slotDetail(id),
      {
        method: "DELETE",
      },
    ),

  getSessions: (query: StaffParkingSessionsListQuery = {}) =>
    apiClient<StaffParkingSessionsListResponse>(
      buildSessionsEndpoint(query),
    ),

  getSession: (id: string | number) =>
    apiClient<StaffParkingSessionDetailResponse>(
      API_ENDPOINTS.staffParking.sessionDetail(id),
    ),

  acceptSession: (
    id: string | number,
    body: StaffParkingSessionAcceptRequest = {},
  ) =>
    apiClient<StaffParkingSessionMutationResponse>(
      API_ENDPOINTS.staffParking.sessionAccept(id),
      {
        method: "POST",
        body,
      },
    ),

  startSession: (
    id: string | number,
    body: StaffParkingSessionStartRequest = {},
  ) =>
    apiClient<StaffParkingSessionMutationResponse>(
      API_ENDPOINTS.staffParking.sessionStart(id),
      {
        method: "POST",
        body,
      },
    ),

  completeSession: (
    id: string | number,
    body: StaffParkingSessionCompleteRequest = {},
  ) =>
    apiClient<StaffParkingSessionMutationResponse>(
      API_ENDPOINTS.staffParking.sessionComplete(id),
      {
        method: "POST",
        body,
      },
    ),
};
