import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  StaffHealthReportDetailResponse,
  StaffHealthReportVehiclesResponse,
} from "@/types/api";

export const staffHealthReportsApi = {
  getVehicles: () =>
    apiClient<StaffHealthReportVehiclesResponse>(
      API_ENDPOINTS.staffHealthReports.vehicles,
    ),

  getVehicleDetail: (id: string | number) =>
    apiClient<StaffHealthReportDetailResponse>(
      API_ENDPOINTS.staffHealthReports.vehicleDetail(id),
    ),
};
