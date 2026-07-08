import { NextResponse, type NextRequest } from "next/server";
import { API_ENDPOINTS } from "@/api/endpoints";
import { clearAuthCookies, setAuthCookies } from "@/lib/authCookies";
import {
  buildUpstreamUrl,
  getUpstreamBaseUrl,
  SERVER_UNAVAILABLE_BODY,
  upstreamFetch,
  upstreamHeaders,
} from "@/lib/server/upstream";

export async function POST(request: NextRequest) {
  if (!getUpstreamBaseUrl()) {
    return NextResponse.json(SERVER_UNAVAILABLE_BODY, { status: 502 });
  }

  const payload = await request.json().catch(() => ({}));

  let upstream: Response;

  try {
    upstream = await upstreamFetch(buildUpstreamUrl(API_ENDPOINTS.auth.signIn), {
      method: "POST",
      headers: upstreamHeaders({ "content-type": "application/json" }),
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(SERVER_UNAVAILABLE_BODY, { status: 502 });
  }

  const data = await upstream.json().catch(() => null);

  if (!upstream.ok || !data?.success || !data?.data) {
    return NextResponse.json(
      data ?? { success: false, message: "Sign in failed", data: "" },
      { status: upstream.status || 400 },
    );
  }

  const { role, panel, accessToken, refreshToken } = data.data as {
    role?: string;
    panel?: string;
    accessToken?: string;
    refreshToken?: string;
  };

  const response = NextResponse.json({
    success: true,
    message: data.message ?? "Signed in",
    data: { role, panel },
  });

  setAuthCookies(response, { accessToken, refreshToken, role });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out",
    data: "",
  });

  clearAuthCookies(response);

  return response;
}
