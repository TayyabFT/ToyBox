import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  StaffInspectionCreateRequest,
  StaffInspectionDetailResponse,
  StaffInspectionDraftRequest,
  StaffInspectionListResponse,
  StaffInspectionMutationResponse,
  StaffInspectionSummaryResponse,
} from "@/types/api";

export const staffInspectionsApi = {
  getList: () =>
    apiClient<StaffInspectionListResponse>(API_ENDPOINTS.staffInspections.list),

  getSummary: () =>
    apiClient<StaffInspectionSummaryResponse>(
      API_ENDPOINTS.staffInspections.summary,
    ),

  getDetail: (id: string | number) =>
    apiClient<StaffInspectionDetailResponse>(
      API_ENDPOINTS.staffInspections.detail(id),
    ),

  create: (body: StaffInspectionCreateRequest) =>
    apiClient<StaffInspectionMutationResponse>(
      API_ENDPOINTS.staffInspections.list,
      {
        method: "POST",
        body,
      },
    ),

  saveDraft: (id: string | number, body: StaffInspectionDraftRequest) =>
    apiClient<StaffInspectionMutationResponse>(
      API_ENDPOINTS.staffInspections.detail(id),
      {
        method: "PATCH",
        body,
      },
    ),

  uploadPhoto: (id: string | number, image: File, caption?: string) => {
    const formData = new FormData();
    formData.append("image", image);

    if (caption?.trim()) {
      formData.append("caption", caption.trim());
    }

    return apiClient<StaffInspectionMutationResponse>(
      API_ENDPOINTS.staffInspections.photos(id),
      {
        method: "POST",
        formData,
      },
    );
  },

  submit: (id: string | number) =>
    apiClient<StaffInspectionMutationResponse>(
      API_ENDPOINTS.staffInspections.submit(id),
      {
        method: "POST",
      },
    ),
};
