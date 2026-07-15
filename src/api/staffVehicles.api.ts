import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  StaffAssignedVehicleDetailResponse,
  StaffAssignedVehiclesResponse,
  StaffVehicleSummaryResponse,
} from "@/types/api";

export const staffVehiclesApi = {
  getSummary: () =>
    apiClient<StaffVehicleSummaryResponse>(API_ENDPOINTS.staffVehicles.summary),

  getAssigned: () =>
    apiClient<StaffAssignedVehiclesResponse>(
      API_ENDPOINTS.staffVehicles.assigned,
    ),

  getAssignedDetail: (id: string) =>
    apiClient<StaffAssignedVehicleDetailResponse>(
      API_ENDPOINTS.staffVehicles.assignedDetail(id),
    ),
};
