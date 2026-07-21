import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  GarageVehiclesResponse,
  MemberVehicleDetailResponse,
} from "@/types/api";

export type MemberGarageListParams = {
  memberId: string;
  /** Garage status tab key — maps to garageStatus query param.
   *  "all" means no status filter (returns all member vehicles).
   *  Accepted values mirror the backend Joi schema. */
  garageStatus?: "all" | "ready" | "in_service" | "away" | "modern" | "classic" | "stored" | "in_review";
  search?: string;
};

export const memberVehiclesApi = {
  /**
   * GET /api/v1/vehicles?memberId=...&filter=mine&garageStatus=...&search=...
   * Returns the member's own garage list plus tab counts for the filter pills.
   * `filter` is always "mine" for member-facing requests — "all" is admin-only.
   * Tab keys like "ready", "in_service", "modern", etc. go into `garageStatus`.
   */
  getGarage: ({ memberId, garageStatus = "all", search }: MemberGarageListParams) => {
    // Always use filter=mine for member-facing requests.
    // garageStatus "all" means no status filter — just return all member vehicles.
    // Any other garageStatus value (ready, in_service, away, modern, classic, stored, in_review)
    // is forwarded as garageStatus query param.
    const qs = new URLSearchParams({ memberId, filter: "mine" });

    if (garageStatus !== "all") {
      qs.set("garageStatus", garageStatus);
    }

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
