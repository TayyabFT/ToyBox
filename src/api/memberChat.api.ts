import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  ApiError,
  ApiResponse,
  ChatInitiateResponse,
  ChatSendMessageResponse,
  MemberChatInboxResponse,
  MemberChatInitiateRequest,
  MemberChatSendMessageRequest,
  MemberChatThreadMessagesResponse,
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

export const memberChatApi = {
  getInbox: async () =>
    ensureSuccess(
      await apiClient<MemberChatInboxResponse>(API_ENDPOINTS.memberChat.messages),
    ),

  getMessages: async (contactId: string) =>
    ensureSuccess(
      await apiClient<MemberChatThreadMessagesResponse>(
        `${API_ENDPOINTS.memberChat.messages}?contactId=${encodeURIComponent(contactId)}`,
      ),
    ),

  sendMessage: async (body: MemberChatSendMessageRequest) =>
    ensureSuccess(
      await apiClient<ChatSendMessageResponse>(API_ENDPOINTS.memberChat.messages, {
        method: "POST",
        body,
      }),
    ),

  initiate: async (body: MemberChatInitiateRequest) =>
    ensureSuccess(
      await apiClient<ChatInitiateResponse>(API_ENDPOINTS.memberChat.initiate, {
        method: "POST",
        body,
      }),
    ),
};
