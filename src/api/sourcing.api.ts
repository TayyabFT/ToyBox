import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { toResourceId } from "@/lib/resourceId";
import type {
  AdminSourcingRequestsResponse,
  AssignVehicleRequest,
  AssignVehicleResponse,
  StaffSourcingRequestsResponse,
} from "@/types/api";

type SourcingQuery = {
  memberId?: string | number;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
};

export const sourcingApi = {
  getStaffRequests: (query: SourcingQuery = {}) => {
    const params = new URLSearchParams();

    if (query.memberId !== undefined) {
      params.set("memberId", toResourceId(query.memberId));
    }
    if (query.status) params.set("status", query.status);
    if (query.search) params.set("search", query.search);
    if (query.limit !== undefined) params.set("limit", String(query.limit));
    if (query.offset !== undefined) params.set("offset", String(query.offset));

    const qs = params.toString();
    const endpoint = qs
      ? `${API_ENDPOINTS.sourcing.staffRequests}?${qs}`
      : API_ENDPOINTS.sourcing.staffRequests;

    return apiClient<StaffSourcingRequestsResponse>(endpoint);
  },

  getAdminRequests: (query: SourcingQuery = {}) => {
    const params = new URLSearchParams();

    if (query.memberId !== undefined) {
      params.set("memberId", toResourceId(query.memberId));
    }
    if (query.status) params.set("status", query.status);
    if (query.search) params.set("search", query.search);
    if (query.limit !== undefined) params.set("limit", String(query.limit));
    if (query.offset !== undefined) params.set("offset", String(query.offset));

    const qs = params.toString();
    const endpoint = qs
      ? `${API_ENDPOINTS.sourcing.adminRequests}?${qs}`
      : API_ENDPOINTS.sourcing.adminRequests;

    return apiClient<AdminSourcingRequestsResponse>(endpoint);
  },

  assignVehicle: (requestId: string | number, body: AssignVehicleRequest) =>
    apiClient<AssignVehicleResponse>(
      API_ENDPOINTS.sourcing.assignVehicle(toResourceId(requestId)),
      {
        method: "POST",
        body: {
          ...body,
          vehicleId: toResourceId(body.vehicleId),
          memberId: toResourceId(body.memberId),
          offerStartDate: body.offerStartDate,
          offerEndDate: body.offerEndDate,
          ...(body.adminNotes ? { adminNotes: body.adminNotes } : {}),
        },
      },
    ),
};
