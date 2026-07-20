import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  GarageVehiclesResponse,
  MemberVehicleDetailResponse,
} from "@/types/api";

export type MemberGarageListParams = {
  memberId: string;
  /** Garage tab key, e.g. "all" | "ready" | "in_service" | "away" | "modern" | "classic" | "stored" | "in_review" */
  garageStatus?: string;
  /** Ownership scope the backend accepts: "all" | "priority" | "mine" */
  filter?: "all" | "priority" | "mine";
  search?: string;
};

export const memberVehiclesApi = {
  /**
   * GET /api/v1/vehicles?memberId=...&filter=...&garageStatus=...&search=...
   * Returns the member's full garage list plus tab counts for the filter pills.
   */
  getGarage: ({
    memberId,
    garageStatus = "all",
    filter = "all",
    search,
  }: MemberGarageListParams) => {
    const qs = new URLSearchParams({
      memberId,
      filter,
      garageStatus,
    });

    if (search) {
      qs.set("search", search);
    }

    return apiClient<GarageVehiclesResponse>(
      `${API_ENDPOINTS.memberVehicles.list}?${qs.toString()}`,
    );
  },

  /**
   * GET /api/v1/vehicles/:id
   * Returns vehicle details, health report, documents, specs, and requests in one call.
   */
  getById: (vehicleId: string) =>
    apiClient<MemberVehicleDetailResponse>(
      API_ENDPOINTS.memberVehicles.detail(vehicleId),
    ),
};
