import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  InviteRequest,
  InviteResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "@/types/api";

export const invitationsApi = {
  send: (payload: InviteRequest) =>
    apiClient<InviteResponse>(API_ENDPOINTS.auth.invitations, {
      method: "POST",
      body: payload,
    }),

  verifyOtp: (payload: VerifyOtpRequest) =>
    apiClient<VerifyOtpResponse>(API_ENDPOINTS.auth.verifyOtp, {
      method: "POST",
      body: payload,
      skipAuth: true,
    }),

  resend: (payload: ResendOtpRequest) =>
    apiClient<ResendOtpResponse>(API_ENDPOINTS.auth.resend, {
      method: "POST",
      body: payload,
    }),
};
