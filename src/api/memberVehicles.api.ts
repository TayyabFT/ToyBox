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

export type UploadVehicleDocumentParams = {
  vehicleId: string;
  documentKey: string;
  file: File;
};

export const memberVehiclesApi = {
  /**
   * GET /api/v1/vehicles?memberId=...&filter=mine&garageStatus=...&search=...
   */
  getGarage: ({ memberId, garageStatus = "all", search }: MemberGarageListParams) => {
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
   */
  getById: (vehicleId: string) =>
    apiClient<MemberVehicleDetailResponse>(
      API_ENDPOINTS.memberVehicles.detail(vehicleId),
    ),

  /**
   * POST /api/v1/garage/vehicles/:id/documents
   * Uploads a document file for the vehicle. Uses multipart/form-data.
   */
  uploadDocument: ({ vehicleId, documentKey, file }: UploadVehicleDocumentParams) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentKey", documentKey);

    return apiClient<{ message: string; url: string }>(
      API_ENDPOINTS.memberVehicles.uploadDocument(vehicleId),
      { method: "POST", formData },
    );
  },
};
