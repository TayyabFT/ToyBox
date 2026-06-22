/**
 * Reads the upstream API base URL at request time from .env.
 * Browser calls same-origin /api/backend/*; the server forwards to this URL.
 */
export function getUpstreamBaseUrl(): string {
  const raw =
    process.env.API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
    "";

  return raw.replace(/\/+$/, "");
}

export function buildUpstreamUrl(path: string): string {
  const base = getUpstreamBaseUrl();
  if (!base) return "";

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
