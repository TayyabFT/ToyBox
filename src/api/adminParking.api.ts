import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  StaffParkingSessionDetailResponse,
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

export type AdminParkingSlotsListQuery = {
  search?: string;
  status?: string;
  zone?: string;
  level?: string;
  limit?: number;
  offset?: number;
};

export type AdminParkingSessionsListQuery = {
  search?: string;
  status?: string;
  limit?: number;
  offset?: number;
};

function buildListEndpoint(query: AdminParkingSlotsListQuery = {}) {
  const params = new URLSearchParams();

  if (query.search) params.set("search", query.search);
  if (query.status) params.set("status", query.status);
  if (query.zone) params.set("zone", query.zone);
  if (query.level) params.set("level", query.level);
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.offset !== undefined) params.set("offset", String(query.offset));

  const qs = params.toString();

  return qs
    ? `${API_ENDPOINTS.adminParking.slots}?${qs}`
    : API_ENDPOINTS.adminParking.slots;
}

function buildSessionsEndpoint(query: AdminParkingSessionsListQuery = {}) {
  const params = new URLSearchParams();

  if (query.search) params.set("search", query.search);
  if (query.status) params.set("status", query.status);
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.offset !== undefined) params.set("offset", String(query.offset));

  const qs = params.toString();

  return qs
    ? `${API_ENDPOINTS.adminParking.sessions}?${qs}`
    : API_ENDPOINTS.adminParking.sessions;
}

export const adminParkingApi = {
  getSlots: (query: AdminParkingSlotsListQuery = {}) =>
    apiClient<StaffParkingSlotsListResponse>(buildListEndpoint(query)),

  getSummary: () =>
    apiClient<StaffParkingSlotsSummaryResponse>(
      API_ENDPOINTS.adminParking.summary,
    ),

  getSlot: (id: string | number) =>
    apiClient<StaffParkingSlotDetailResponse>(
      API_ENDPOINTS.adminParking.slotDetail(id),
    ),

  createSlot: (body: StaffParkingSlotCreateRequest) =>
    apiClient<StaffParkingSlotCreateResponse>(
      API_ENDPOINTS.adminParking.slots,
      {
        method: "POST",
        body,
      },
    ),

  updateSlot: (id: string | number, body: StaffParkingSlotUpdateRequest) =>
    apiClient<StaffParkingSlotUpdateResponse>(
      API_ENDPOINTS.adminParking.slotDetail(id),
      {
        method: "PATCH",
        body,
      },
    ),

  deleteSlot: (id: string | number) =>
    apiClient<StaffParkingSlotDeleteResponse>(
      API_ENDPOINTS.adminParking.slotDetail(id),
      {
        method: "DELETE",
      },
    ),

  getSessions: (query: AdminParkingSessionsListQuery = {}) =>
    apiClient<StaffParkingSessionsListResponse>(buildSessionsEndpoint(query)),

  getSession: (id: string | number) =>
    apiClient<StaffParkingSessionDetailResponse>(
      API_ENDPOINTS.adminParking.sessionDetail(id),
    ),
};
