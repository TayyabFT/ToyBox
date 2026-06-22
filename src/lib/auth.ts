import { ROLE_COOKIE } from "@/lib/authConstants";

export type UserRole = "admin" | "staff" | "member";

export const SETUP_TOKEN_KEY = "setupToken";
export const SETUP_ROLE_KEY = "setupRole";
export const SETUP_EMAIL_KEY = "setupEmail";

export const ROLE_DASHBOARD: Record<UserRole, string> = {
  admin: "/admin",
  staff: "/staff",
  member: "/member",
};

const VALID_ROLES: UserRole[] = ["admin", "staff", "member"];

export function isUserRole(value: string | null): value is UserRole {
  return VALID_ROLES.includes(value as UserRole);
}

export function getDashboardPath(role: UserRole): string {
  return ROLE_DASHBOARD[role];
}

/**
 * Reads the current role from the (non-httpOnly) role cookie. Access and
 * refresh tokens live in httpOnly cookies and are intentionally NOT readable
 * from client-side JavaScript.
 */
export function getStoredRole(): UserRole | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${ROLE_COOKIE}=([^;]*)`),
  );
  const role = match ? decodeURIComponent(match[1]) : null;

  return isUserRole(role) ? role : null;
}

function clearRoleCookie(): void {
  if (typeof document === "undefined") return;

  document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0`;
}

/**
 * Logs the user out by asking the server to clear the httpOnly auth cookies,
 * then clears the client-readable role cookie as a fallback.
 */
export async function logout(): Promise<void> {
  try {
    await fetch("/api/auth/session", {
      method: "DELETE",
      credentials: "include",
    });
  } catch {
    // Ignore network errors during logout; cookies are cleared below.
  } finally {
    clearRoleCookie();
  }
}

export function isAdminAuthenticated(): boolean {
  return getStoredRole() === "admin";
}

export function getStoredSetupToken(): string | null {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(SETUP_TOKEN_KEY);
}

export function getStoredSetupRole(): UserRole | null {
  if (typeof window === "undefined") return null;

  const role = localStorage.getItem(SETUP_ROLE_KEY);
  return isUserRole(role) ? role : null;
}

export function setSetupSession(role: UserRole, setupToken: string): void {
  localStorage.setItem(SETUP_ROLE_KEY, role);
  localStorage.setItem(SETUP_TOKEN_KEY, setupToken);
}

export function setSetupEmail(email: string): void {
  localStorage.setItem(SETUP_EMAIL_KEY, email);
}

export function getStoredSetupEmail(): string | null {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(SETUP_EMAIL_KEY);
}

export function clearSetupSession(): void {
  localStorage.removeItem(SETUP_ROLE_KEY);
  localStorage.removeItem(SETUP_TOKEN_KEY);
  localStorage.removeItem(SETUP_EMAIL_KEY);
}
