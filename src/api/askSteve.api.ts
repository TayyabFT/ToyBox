import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  AiConversationResponse,
  AiMessagesResponse,
  AiQueryRequest,
  AiQueryResponse,
  AiResetConversationResponse,
  ApiError,
  ApiResponse,
} from "@/types/api";

function ensureSuccess<T>(response: ApiResponse<T>): ApiResponse<T> {
  if (!response.success) {
    const error: ApiError = {
      status: 0,
      message: response.message || "Request failed",
    };
    throw error;
  }

  return response;
}

function buildQuerySearchParams(params: {
  query: string;
  conversationId?: string;
  newConversation?: boolean;
  memberId?: string;
}) {
  const search = new URLSearchParams({ query: params.query });

  if (params.memberId) {
    search.set("memberId", params.memberId);
  }

  if (params.conversationId) {
    search.set("conversationId", params.conversationId);
  }

  if (params.newConversation !== undefined) {
    search.set("newConversation", String(params.newConversation));
  }

  return search.toString();
}

export const askSteveApi = {
  getConversation: async () =>
    ensureSuccess(
      await apiClient<AiConversationResponse>(API_ENDPOINTS.ai.conversation),
    ),

  resetConversation: async () =>
    ensureSuccess(
      await apiClient<AiResetConversationResponse>(
        API_ENDPOINTS.ai.conversationReset,
        { method: "POST" },
      ),
    ),

  getMessages: async (conversationId: string) =>
    ensureSuccess(
      await apiClient<AiMessagesResponse>(
        API_ENDPOINTS.ai.conversationMessages(conversationId),
      ),
    ),

  query: async (body: AiQueryRequest) =>
    ensureSuccess(
      await apiClient<AiQueryResponse>(API_ENDPOINTS.ai.query, {
        method: "POST",
        body,
      }),
    ),

  queryWithParams: async (params: AiQueryRequest) =>
    ensureSuccess(
      await apiClient<AiQueryResponse>(
        `${API_ENDPOINTS.ai.query}?${buildQuerySearchParams(params)}`,
      ),
    ),
};
