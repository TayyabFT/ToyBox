import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/api";

// ── Request / response types ─────────────────────────────────────────────────

export type MemberParkingSlotsQuery = {
  from: string;   // ISO 8601
  to: string;     // ISO 8601
  level?: string;
  zone?: string;
  slotType?: string;
  selectableOnly?: boolean;
};

export type MemberParkingSlotRaw = {
  id?: string | number;
  slotCode?: string;
  label?: string;
  level?: string;
  zone?: string;
  slotType?: string;
  status?: string;
  openTime?: string;
  closeTime?: string;
};

export type MemberParkingSlotsData =
  | MemberParkingSlotRaw[]
  | {
      slots?: MemberParkingSlotRaw[];
      items?: MemberParkingSlotRaw[];
      records?: MemberParkingSlotRaw[];
      data?: MemberParkingSlotRaw[];
      total?: number;
    };

export type MemberParkingSlotsResponse = ApiResponse<MemberParkingSlotsData>;

export type CreateMemberParkingSessionBody = {
  vehicleId: string;
  slotId?: string;
  scheduledStartAt: string; // ISO 8601
  scheduledEndAt: string;   // ISO 8601
  mode: "pickup" | "drop_self";
  pickupAddress?: string;
  pickupNotes?: string;
};

export type MemberParkingSessionRaw = {
  id?: string | number;
  status?: string;
  referenceNumber?: string;
  reference?: string;
  vehicleId?: string | number;
  vehicleName?: string;
  slotId?: string | number;
  slotCode?: string;
  slot?: {
    id?: string | number;
    slotCode?: string;
    zone?: string;
    level?: string;
    label?: string;
    slotType?: string;
    openTime?: string;
    closeTime?: string;
  };
  scheduledStartAt?: string;
  scheduledEndAt?: string;
  mode?: string;
  pickupAddress?: string | null;
  pickupNotes?: string | null;
  createdAt?: string;
};

export type MemberParkingSessionResponse = ApiResponse<MemberParkingSessionRaw>;

export type MemberParkingSessionsData =
  | MemberParkingSessionRaw[]
  | {
      sessions?: MemberParkingSessionRaw[];
      items?: MemberParkingSessionRaw[];
      records?: MemberParkingSessionRaw[];
      data?: MemberParkingSessionRaw[];
      total?: number;
    };

export type MemberParkingSessionsResponse = ApiResponse<MemberParkingSessionsData>;

// ── API client ───────────────────────────────────────────────────────────────

function buildSlotsEndpoint(query: MemberParkingSlotsQuery): string {
  const params = new URLSearchParams();
  params.set("from", query.from);
  params.set("to", query.to);
  if (query.level) params.set("level", query.level);
  if (query.zone) params.set("zone", query.zone);
  if (query.slotType) params.set("slotType", query.slotType);
  if (query.selectableOnly) params.set("selectableOnly", "true");
  return `${API_ENDPOINTS.memberParking.slots}?${params.toString()}`;
}

export const memberParkingApi = {
  /** GET /api/v1/parking/slots — availability search */
  getSlots: (query: MemberParkingSlotsQuery) =>
    apiClient<MemberParkingSlotsResponse>(buildSlotsEndpoint(query)),

  /** GET /api/v1/parking/sessions — list member's own sessions */
  getSessions: (params?: { vehicleId?: string; status?: string }) => {
    const qs = new URLSearchParams();
    if (params?.vehicleId) qs.set("vehicleId", params.vehicleId);
    if (params?.status) qs.set("status", params.status);
    const q = qs.toString();
    const url = q
      ? `${API_ENDPOINTS.memberParking.sessions}?${q}`
      : API_ENDPOINTS.memberParking.sessions;
    return apiClient<MemberParkingSessionsResponse>(url);
  },

  /** GET /api/v1/parking/sessions/:id */
  getSession: (id: string | number) =>
    apiClient<MemberParkingSessionResponse>(
      API_ENDPOINTS.memberParking.sessionDetail(id),
    ),

  /** POST /api/v1/parking/sessions */
  createSession: (body: CreateMemberParkingSessionBody) =>
    apiClient<MemberParkingSessionResponse>(
      API_ENDPOINTS.memberParking.sessions,
      { method: "POST", body },
    ),
};
