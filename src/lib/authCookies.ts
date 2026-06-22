import type { NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
  ROLE_COOKIE,
} from "@/lib/authConstants";

const isProd = process.env.NODE_ENV === "production";

const secureCookieBase = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax" as const,
  path: "/",
};

type AuthCookiePayload = {
  accessToken?: string | null;
  refreshToken?: string | null;
  role?: string | null;
};

export function setAuthCookies(
  response: NextResponse,
  { accessToken, refreshToken, role }: AuthCookiePayload,
): void {
  if (accessToken) {
    response.cookies.set({
      name: ACCESS_COOKIE,
      value: accessToken,
      ...secureCookieBase,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });
  }

  if (refreshToken) {
    response.cookies.set({
      name: REFRESH_COOKIE,
      value: refreshToken,
      ...secureCookieBase,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
  }

  if (role) {
    // Role is not a secret; expose it to the client for UI routing/guards.
    response.cookies.set({
      name: ROLE_COOKIE,
      value: role,
      httpOnly: false,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
  }
}

export function clearAuthCookies(response: NextResponse): void {
  response.cookies.set({
    name: ACCESS_COOKIE,
    value: "",
    ...secureCookieBase,
    maxAge: 0,
  });
  response.cookies.set({
    name: REFRESH_COOKIE,
    value: "",
    ...secureCookieBase,
    maxAge: 0,
  });
  response.cookies.set({
    name: ROLE_COOKIE,
    value: "",
    httpOnly: false,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
