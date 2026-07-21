import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { AddVehicleFormState } from "@/components/staff/vehicles/add-vehicle/types";
import {
  buildAddVehicleFormData,
  buildAddVehicleJsonPayload,
  hasDocumentFiles,
} from "@/lib/addVehicle";
import type {
  AddVehicleInventoryResponse,
  VehicleInventoryResponse,
} from "@/types/api";

type InventoryQuery = {
  search?: string;
  limit?: number;
  offset?: number;
};

export const vehiclesApi = {
  getInventory: (query: InventoryQuery = {}) => {
    const params = new URLSearchParams();

    if (query.search) params.set("search", query.search);
    if (query.limit !== undefined) params.set("limit", String(query.limit));
    if (query.offset !== undefined) params.set("offset", String(query.offset));

    const qs = params.toString();
    const endpoint = qs
      ? `${API_ENDPOINTS.vehicles.inventory}?${qs}`
      : API_ENDPOINTS.vehicles.inventory;

    return apiClient<VehicleInventoryResponse>(endpoint);
  },

  addToInventory: (form: AddVehicleFormState, apiUrl?: string) => {
    const endpoint = apiUrl || API_ENDPOINTS.vehicles.inventory;
    if (hasDocumentFiles(form)) {
      return apiClient<AddVehicleInventoryResponse>(
        endpoint,
        {
          method: "POST",
          formData: buildAddVehicleFormData(form),
        },
      );
    }

    return apiClient<AddVehicleInventoryResponse>(
      endpoint,
      {
        method: "POST",
        body: buildAddVehicleJsonPayload(form),
      },
    );
  },
};
