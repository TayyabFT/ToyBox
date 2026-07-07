import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  StaffPhotoUploadCreateRequest,
  StaffPhotoUploadDetailResponse,
  StaffPhotoUploadListResponse,
  StaffPhotoUploadMutationResponse,
  StaffPhotoUploadSummaryResponse,
  StaffPhotoUploadTodayResponse,
  StaffPhotoUploadUpdateRequest,
} from "@/types/api";

export type PhotoUploadListQuery = {
  filter?: string;
  search?: string;
  limit?: number;
  offset?: number;
};

export type PhotoUploadFilePayload = {
  photo: File;
  sectionLabel?: string;
  linkedJobReference?: string;
  categoryTags?: string[];
  caption?: string;
  isIssueFlagged?: boolean;
};

function buildListEndpoint(query: PhotoUploadListQuery = {}) {
  const params = new URLSearchParams();

  if (query.filter) params.set("filter", query.filter);
  if (query.search) params.set("search", query.search);
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.offset !== undefined) params.set("offset", String(query.offset));

  const qs = params.toString();

  return qs
    ? `${API_ENDPOINTS.staffPhotoUploads.list}?${qs}`
    : API_ENDPOINTS.staffPhotoUploads.list;
}

export const staffPhotoUploadsApi = {
  getSummary: () =>
    apiClient<StaffPhotoUploadSummaryResponse>(
      API_ENDPOINTS.staffPhotoUploads.summary,
    ),

  getList: (query: PhotoUploadListQuery = {}) =>
    apiClient<StaffPhotoUploadListResponse>(buildListEndpoint(query)),

  getToday: () =>
    apiClient<StaffPhotoUploadTodayResponse>(
      API_ENDPOINTS.staffPhotoUploads.today,
    ),

  getDetail: (id: string | number) =>
    apiClient<StaffPhotoUploadDetailResponse>(
      API_ENDPOINTS.staffPhotoUploads.detail(id),
    ),

  createDraft: (body: StaffPhotoUploadCreateRequest) =>
    apiClient<StaffPhotoUploadMutationResponse>(
      API_ENDPOINTS.staffPhotoUploads.list,
      {
        method: "POST",
        body,
      },
    ),

  update: (id: string | number, body: StaffPhotoUploadUpdateRequest) =>
    apiClient<StaffPhotoUploadMutationResponse>(
      API_ENDPOINTS.staffPhotoUploads.detail(id),
      {
        method: "PATCH",
        body,
      },
    ),

  delete: (id: string | number) =>
    apiClient<StaffPhotoUploadMutationResponse>(
      API_ENDPOINTS.staffPhotoUploads.detail(id),
      {
        method: "DELETE",
      },
    ),

  syncOne: (id: string | number) =>
    apiClient<StaffPhotoUploadMutationResponse>(
      API_ENDPOINTS.staffPhotoUploads.sync(id),
      {
        method: "POST",
      },
    ),

  syncAll: () =>
    apiClient<StaffPhotoUploadMutationResponse>(
      API_ENDPOINTS.staffPhotoUploads.syncAll,
      {
        method: "POST",
      },
    ),

  uploadFile: (payload: PhotoUploadFilePayload) => {
    const formData = new FormData();
    formData.append("photo", payload.photo);

    if (payload.sectionLabel?.trim()) {
      formData.append("sectionLabel", payload.sectionLabel.trim());
    }

    if (payload.linkedJobReference?.trim()) {
      formData.append("linkedJobReference", payload.linkedJobReference.trim());
    }

    if (payload.categoryTags?.length) {
      formData.append("categoryTags", JSON.stringify(payload.categoryTags));
    }

    if (payload.caption?.trim()) {
      formData.append("caption", payload.caption.trim());
    }

    if (payload.isIssueFlagged !== undefined) {
      formData.append("isIssueFlagged", String(payload.isIssueFlagged));
    }

    return apiClient<StaffPhotoUploadMutationResponse>(
      API_ENDPOINTS.staffPhotoUploads.upload,
      {
        method: "POST",
        formData,
      },
    );
  },
};
