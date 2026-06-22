import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { toResourceId } from "@/lib/resourceId";
import type {
  ApiError,
  ApiResponse,
  ChatInitiateRequest,
  ChatInitiateResponse,
  ChatConversationsResponse,
  ChatMarkReadResponse,
  ChatMessagesResponse,
  ChatSendMessageRequest,
  ChatSendMessageResponse,
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

export const chatApi = {
  getConversations: async () =>
    ensureSuccess(await apiClient<ChatConversationsResponse>(
      API_ENDPOINTS.chat.conversations,
    )),

  getMessages: async (memberId: string | number) =>
    ensureSuccess(
      await apiClient<ChatMessagesResponse>(
        API_ENDPOINTS.chat.messages(toResourceId(memberId)),
      ),
    ),

  sendMessage: async (memberId: string | number, body: ChatSendMessageRequest) =>
    ensureSuccess(
      await apiClient<ChatSendMessageResponse>(
        API_ENDPOINTS.chat.messages(toResourceId(memberId)),
        {
          method: "POST",
          body,
        },
      ),
    ),

  markRead: async (memberId: string | number) =>
    ensureSuccess(
      await apiClient<ChatMarkReadResponse>(
        API_ENDPOINTS.chat.markRead(toResourceId(memberId)),
        {
          method: "PATCH",
        },
      ),
    ),

  initiate: async (body: ChatInitiateRequest) =>
    ensureSuccess(
      await apiClient<ChatInitiateResponse>(API_ENDPOINTS.chat.initiate, {
        method: "POST",
        body: {
          initialMessage: body.initialMessage,
          memberId: toResourceId(body.memberId),
        },
      }),
    ),
};
