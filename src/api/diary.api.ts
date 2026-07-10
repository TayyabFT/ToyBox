import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { MemberDiaryData } from "@/components/member/diary/types";
import type { ApiResponse } from "@/types/api";

export const diaryApi = {
  getDiary: () =>
    apiClient<ApiResponse<MemberDiaryData>>(`${API_ENDPOINTS.member.diary}?full=true`),
};
