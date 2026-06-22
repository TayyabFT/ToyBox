import { API_ENDPOINTS } from "@/api/endpoints";
import { SERVER_UNAVAILABLE_MESSAGE } from "@/lib/apiError";
import { buildUpstreamUrl, getUpstreamBaseUrl } from "@/lib/server/apiBaseUrl";

export { buildUpstreamUrl, getUpstreamBaseUrl };

export const SERVER_UNAVAILABLE_BODY = {
  success: false,
  message: SERVER_UNAVAILABLE_MESSAGE,
  data: "",
};

export function upstreamHeaders(extra?: Record<string, string>): HeadersInit {
  return {
    "ngrok-skip-browser-warning": "true",
    accept: "application/json",
    ...extra,
  };
}

export type RotatedTokens = {
  accessToken: string;
  refreshToken?: string;
};

export function isUpstreamUnreachableBody(body: string): boolean {
  const normalized = body.toLowerCase();

  return (
    normalized.includes("err_ngrok") ||
    normalized.includes("ngrok-free.dev is offline") ||
    normalized.includes("tunnel") && normalized.includes("offline")
  );
}

/**
 * Exchanges a refresh token for a new access/refresh token pair using the
 * upstream API. Returns null when the refresh attempt fails.
 */
export async function refreshUpstreamTokens(
  refreshToken: string,
): Promise<RotatedTokens | null> {
  const refreshUrl = buildUpstreamUrl(API_ENDPOINTS.auth.refresh);
  if (!refreshUrl) return null;

  let response: Response;

  try {
    response = await fetch(refreshUrl, {
      method: "POST",
      headers: upstreamHeaders({ "content-type": "application/json" }),
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
  } catch {
    return null;
  }

  const data = (await response.json().catch(() => null)) as {
    data?: { accessToken?: string; refreshToken?: string };
  } | null;

  if (!response.ok || !data?.data?.accessToken) {
    return null;
  }

  return {
    accessToken: data.data.accessToken,
    refreshToken: data.data.refreshToken,
  };
}
