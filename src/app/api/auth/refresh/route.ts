import { NextResponse, type NextRequest } from "next/server";
import { REFRESH_COOKIE } from "@/lib/authConstants";
import { clearAuthCookies, setAuthCookies } from "@/lib/authCookies";
import { refreshUpstreamTokens } from "@/lib/server/upstream";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  if (!refreshToken) {
    const response = NextResponse.json(
      { success: false, message: "Session expired", data: "" },
      { status: 401 },
    );
    clearAuthCookies(response);
    return response;
  }

  const rotated = await refreshUpstreamTokens(refreshToken);

  if (!rotated) {
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

  const response = NextResponse.json({
    success: true,
    message: "Session refreshed",
    data: "",
  });

  setAuthCookies(response, {
    accessToken: rotated.accessToken,
    refreshToken: rotated.refreshToken,
  });

  return response;
}
