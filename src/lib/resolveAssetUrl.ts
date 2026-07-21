/**
 * Resolve an asset URL returned by the backend so it is always loadable from
 * the browser, regardless of whether the backend is using local-disk storage
 * (development / no S3) or a cloud provider.
 *
 * Rules:
 *  1. Empty / falsy → return ""
 *  2. Already a data-URI → pass through unchanged
 *  3. Starts with "/"  → relative path from the backend; prepend API base URL
 *  4. Absolute URL whose origin matches the current API base URL → pass through
 *  5. Absolute URL whose origin DIFFERS from the API base URL but the path
 *     is under /uploads → rewrite the origin to the current API base URL so
 *     stale ngrok / host URLs are transparently fixed
 *  6. Any other absolute URL (S3, CDN, …) → pass through unchanged
 */
export function resolveAssetUrl(url: string | null | undefined): string {
  if (!url) return "";

  // data URIs — pass through
  if (url.startsWith("data:")) return url;

  const apiBase = (
    process.env.NEXT_PUBLIC_API_BASE_URL ?? ""
  ).trim().replace(/\/$/, "");

  // Relative path — prefix with backend base
  if (url.startsWith("/")) {
    return apiBase ? `${apiBase}${url}` : url;
  }

  // Absolute URL
  try {
    const parsed = new URL(url);

    // Already uses the current API host — fine as-is
    if (apiBase) {
      try {
        const base = new URL(apiBase);
        if (parsed.host === base.host) return url;
      } catch {
        // apiBase isn't a valid URL — ignore
      }
    }

    // Path is under /uploads → likely a locally-stored file whose origin has
    // rotated (e.g. an old ngrok URL).  Rewrite origin to current API base.
    if (parsed.pathname.startsWith("/uploads/") && apiBase) {
      return `${apiBase}${parsed.pathname}${parsed.search}`;
    }
  } catch {
    // Not a valid URL — return as-is
  }

  return url;
}
