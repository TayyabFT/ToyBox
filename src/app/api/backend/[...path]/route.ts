import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/authConstants";
import { clearAuthCookies, setAuthCookies } from "@/lib/authCookies";
import { buildUpstreamUrl, getUpstreamBaseUrl } from "@/lib/server/apiBaseUrl";
import {
  isUpstreamUnreachableBody,
  refreshUpstreamTokens,
  SERVER_UNAVAILABLE_BODY,
  upstreamHeaders,
  type RotatedTokens,
} from "@/lib/server/upstream";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

function serverUnavailable() {
  return NextResponse.json(SERVER_UNAVAILABLE_BODY, { status: 502 });
}

async function handle(request: NextRequest, context: RouteContext) {
  if (!getUpstreamBaseUrl()) {
    return serverUnavailable();
  }

  const { path } = await context.params;
  const search = request.nextUrl.search;
  const target = buildUpstreamUrl(`/${path.join("/")}${search}`);

  if (!target) {
    return serverUnavailable();
  }

  const method = request.method;
  const hasBody = method !== "GET" && method !== "HEAD";
  const bodyBuffer = hasBody ? await request.arrayBuffer() : undefined;
  const contentType = request.headers.get("content-type");

  let accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  let rotated: RotatedTokens | null = null;

  if (!accessToken && refreshToken) {
    rotated = await refreshUpstreamTokens(refreshToken);
    if (rotated) {
      accessToken = rotated.accessToken;
    }
  }

  async function forward(token: string | undefined): Promise<Response | null> {
    const headers = upstreamHeaders();

    if (contentType) {
      (headers as Record<string, string>)["content-type"] = contentType;
    }
    if (token) {
      (headers as Record<string, string>).authorization = `Bearer ${token}`;
    }

    try {
      return await fetch(target, {
        method,
        headers,
        body: bodyBuffer ? new Uint8Array(bodyBuffer) : undefined,
        cache: "no-store",
      });
    } catch {
      return null;
    }
  }

  let upstream = await forward(accessToken);

  if (!upstream) {
    return serverUnavailable();
  }

  if (upstream.status === 401 && refreshToken) {
    const newTokens = await refreshUpstreamTokens(refreshToken);

    if (newTokens) {
      rotated = newTokens;
      upstream = await forward(newTokens.accessToken);

      if (!upstream) {
        return serverUnavailable();
      }
    } else {
      const response = NextResponse.json(
        {
          success: false,
          message: "Session expired. Please sign in again.",
          data: "",
        },
        { status: 401 },
      );
      clearAuthCookies(response);
      return response;
    }
  }

  const responseBody = await upstream.text();

  if (
    isUpstreamUnreachableBody(responseBody) ||
    (upstream.status === 404 &&
      upstream.headers.get("content-type")?.includes("text/html"))
  ) {
    return serverUnavailable();
  }

  const response = new NextResponse(responseBody, {
    status: upstream.status,
    headers: {
      "content-type":
        upstream.headers.get("content-type") ?? "application/json",
    },
  });

  if (rotated) {
    setAuthCookies(response, {
      accessToken: rotated.accessToken,
      refreshToken: rotated.refreshToken,
    });
  }

  return response;
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
