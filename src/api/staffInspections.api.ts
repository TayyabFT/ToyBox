import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  StaffInspectionCreateRequest,
  StaffInspectionCreateResponse,
  StaffInspectionDetailResponse,
  StaffInspectionDraftRequest,
  StaffInspectionListResponse,
  StaffInspectionMutationResponse,
  StaffInspectionPhotoUploadPayload,
  StaffInspectionSummaryResponse,
} from "@/types/api";

export type StaffInspectionListQuery = {
  status?: string;
  summaryKey?: string;
  search?: string;
  limit?: number;
  offset?: number;
};

function buildListEndpoint(query: StaffInspectionListQuery = {}) {
  const params = new URLSearchParams();

  if (query.status) params.set("status", query.status);
  if (query.summaryKey) params.set("summaryKey", query.summaryKey);
  if (query.search) params.set("search", query.search);
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.offset !== undefined) params.set("offset", String(query.offset));

  const qs = params.toString();

  return qs
    ? `${API_ENDPOINTS.staffInspections.list}?${qs}`
    : API_ENDPOINTS.staffInspections.list;
}

export const staffInspectionsApi = {
  getList: (query: StaffInspectionListQuery = {}) =>
    apiClient<StaffInspectionListResponse>(buildListEndpoint(query)),

  getSummary: () =>
    apiClient<StaffInspectionSummaryResponse>(
      API_ENDPOINTS.staffInspections.summary,
    ),

  getDetail: (id: string | number) =>
    apiClient<StaffInspectionDetailResponse>(
      API_ENDPOINTS.staffInspections.detail(id),
    ),

  create: (body: StaffInspectionCreateRequest) =>
    apiClient<StaffInspectionCreateResponse>(
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

  uploadPhoto: (
    id: string | number,
    payload: StaffInspectionPhotoUploadPayload,
  ) => {
    const formData = new FormData();
    formData.append("photo", payload.photo);

    if (payload.itemKey?.trim()) {
      formData.append("itemKey", payload.itemKey.trim());
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
