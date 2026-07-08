import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  ApiError,
  ApiResponse,
  ChatSendMessageRequest,
  ChatSendMessageResponse,
  MemberChatConversationResponse,
  MemberChatInitiateRequest,
  MemberChatMessagesResponse,
  ChatInitiateResponse,
  ChatMarkReadResponse,
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
  getConversation: async () =>
    ensureSuccess(
      await apiClient<MemberChatConversationResponse>(
        API_ENDPOINTS.memberChat.conversation,
      ),
    ),

  getMessages: async () =>
    ensureSuccess(
      await apiClient<MemberChatMessagesResponse>(
        API_ENDPOINTS.memberChat.messages,
      ),
    ),

  sendMessage: async (body: ChatSendMessageRequest) =>
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

  markRead: async () =>
    ensureSuccess(
      await apiClient<ChatMarkReadResponse>(API_ENDPOINTS.memberChat.read, {
        method: "PATCH",
      }),
    ),
};
