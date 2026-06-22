import { normalizeHttpError, normalizeRequestError } from "@/lib/apiError";

const PROXY_PREFIX = "/api/backend";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  formData?: FormData;
  /**
   * Retained for backwards compatibility. Auth is now handled by httpOnly
   * cookies via the server-side proxy, so these are no longer used.
   */
  token?: string;
  skipAuth?: boolean;
  isRetry?: boolean;
};

function redirectToLogin(): void {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/auth")) return;

  window.location.assign("/auth/login");
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, formData } = options;

  const headers: HeadersInit = {};

  if (!formData) {
    headers["Content-Type"] = "application/json";
  }

  let response: Response;

  try {
    response = await fetch(`${PROXY_PREFIX}${endpoint}`, {
      method,
      headers,
      credentials: "include",
      body: formData ?? (body ? JSON.stringify(body) : undefined),
    });
  } catch (error) {
    throw normalizeRequestError(error);
  }

  const data = await response.json().catch(() => null);

  if (
    response.status === 401 &&
    !endpoint.includes("/auth/")
  ) {
    redirectToLogin();
  }

  if (!response.ok) {
    throw normalizeHttpError(response.status, data?.message);
  }

  return data as T;
}
