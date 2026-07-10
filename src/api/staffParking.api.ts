import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  StaffParkingSlotCreateRequest,
  StaffParkingSlotCreateResponse,
} from "@/types/api";

export const staffParkingApi = {
  createSlot: (body: StaffParkingSlotCreateRequest) =>
    apiClient<StaffParkingSlotCreateResponse>(
      API_ENDPOINTS.staffParking.slots,
      {
        method: "POST",
        body,
      },
    ),
};
