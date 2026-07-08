import { Agent, fetch as undiciFetch } from "undici";
import { API_ENDPOINTS } from "@/api/endpoints";
import { SERVER_UNAVAILABLE_MESSAGE } from "@/lib/apiError";
import { buildUpstreamUrl, getUpstreamBaseUrl } from "@/lib/server/apiBaseUrl";

export { buildUpstreamUrl, getUpstreamBaseUrl };

/**
 * Some staging/self-hosted upstreams (e.g. a raw IP with a self-signed cert)
 * fail Node's default TLS verification even though browsers accept them
 * after a manual click-through. Opt-in only, and scoped to upstream calls —
 * never disables verification process-wide.
 */
const allowInsecureUpstreamTls = process.env.ALLOW_INSECURE_UPSTREAM_TLS === "true";

let insecureAgent: Agent | undefined;

function getInsecureAgent(): Agent {
  if (!insecureAgent) {
    insecureAgent = new Agent({ connect: { rejectUnauthorized: false } });
  }
  return insecureAgent;
}

export async function upstreamFetch(
  url: string,
  init: RequestInit,
): Promise<Response> {
  if (allowInsecureUpstreamTls) {
    return undiciFetch(url, {
      ...init,
      dispatcher: getInsecureAgent(),
    } as Parameters<typeof undiciFetch>[1]) as unknown as Response;
  }

  return fetch(url, init);
}

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
    response = await upstreamFetch(refreshUrl, {
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
