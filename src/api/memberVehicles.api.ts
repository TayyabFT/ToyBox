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
   * GET /api/v1/vehicles?memberId=...&filter=mine&garageStatus=...&search=...
   * Returns the member's own garage list plus tab counts for the filter pills.
   * `filter` is always "mine" for member-facing requests — "all" is admin-only.
   * Tab keys like "ready", "in_service", "modern", etc. go into `garageStatus`.
   */
  getGarage: ({ memberId, filter = "all", search }: MemberGarageListParams) => {
    // UI tab "all" → filter=mine (show this member's full collection)
    // UI tab "priority" → filter=priority
    // Everything else (status/era tabs) → filter=mine + garageStatus=<tab>
    const isBackendFilter = filter === "priority";

    const qs = new URLSearchParams({ memberId });

    qs.set("filter", isBackendFilter ? filter : "mine");

    if (filter !== "all" && !isBackendFilter) {
      qs.set("garageStatus", filter);
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
