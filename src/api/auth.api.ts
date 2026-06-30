import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { normalizeHttpError, normalizeRequestError } from "@/lib/apiError";
import type {
  AuthProfileResponse,
  RefreshTokenResponse,
  SetupPasswordRequest,
  SetupPasswordResponse,
  SignInRequest,
  SignInResponse,
} from "@/types/api";

/**
 * Auth requests hit same-origin BFF routes that set/clear httpOnly cookies.
 * Tokens are never returned to the client.
 */
async function postAuth<T>(endpoint: string, payload?: unknown): Promise<T> {
  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: payload ? JSON.stringify(payload) : undefined,
    });
  } catch (error) {
    throw normalizeRequestError(error);
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw normalizeHttpError(response.status, data?.message);
  }

  return data as T;
}

export const authApi = {
  signIn: (payload: SignInRequest) =>
    postAuth<SignInResponse>("/api/auth/session", payload),

  setupPassword: (payload: SetupPasswordRequest) =>
    postAuth<SetupPasswordResponse>("/api/auth/setup-password", payload),

  refreshToken: () => postAuth<RefreshTokenResponse>("/api/auth/refresh"),

  getProfile: () =>
    apiClient<AuthProfileResponse>(API_ENDPOINTS.auth.profile),
};
