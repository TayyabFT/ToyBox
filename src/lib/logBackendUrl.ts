const PROXY_PREFIX = "/api/backend";

let backendUrlLogged = false;

export function logBackendUrlOnce(): void {
  if (backendUrlLogged || typeof window === "undefined") return;
  backendUrlLogged = true;

  const upstream = process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, "");

  if (upstream) {
    console.log("[API] Backend base URL:", upstream);
    console.log("[API] Requests via proxy:", `${window.location.origin}${PROXY_PREFIX}`);
    return;
  }

  console.log("[API] Backend proxy:", `${window.location.origin}${PROXY_PREFIX}`);
}
