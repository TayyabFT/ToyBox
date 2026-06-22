import { NextResponse, type NextRequest } from "next/server";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  ROLE_COOKIE,
} from "@/lib/authConstants";

type Role = "admin" | "staff" | "member";

const ROLE_DASHBOARD: Record<Role, string> = {
  admin: "/admin",
  staff: "/staff",
  member: "/member",
};

const PROTECTED_PREFIXES: { prefix: string; role: Role }[] = [
  { prefix: "/admin", role: "admin" },
  { prefix: "/staff", role: "staff" },
  { prefix: "/member", role: "member" },
];

function isRole(value: string | undefined): value is Role {
  return value === "admin" || value === "staff" || value === "member";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasSession =
    Boolean(request.cookies.get(REFRESH_COOKIE)?.value) ||
    Boolean(request.cookies.get(ACCESS_COOKIE)?.value);
  const roleValue = request.cookies.get(ROLE_COOKIE)?.value;
  const role = isRole(roleValue) ? roleValue : null;

  const protectedMatch = PROTECTED_PREFIXES.find(
    ({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (protectedMatch) {
    if (!hasSession) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (role && role !== protectedMatch.role) {
      return NextResponse.redirect(new URL(ROLE_DASHBOARD[role], request.url));
    }

    return NextResponse.next();
  }

  // Authenticated users shouldn't sit on the login screen.
  if (pathname === "/auth/login" && hasSession && role) {
    return NextResponse.redirect(new URL(ROLE_DASHBOARD[role], request.url));
  }

  // Landing route: send straight to the right place.
  if (pathname === "/") {
    if (hasSession && role) {
      return NextResponse.redirect(new URL(ROLE_DASHBOARD[role], request.url));
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)"],
};
