export function stripEmptyRequestFields<T extends object>(payload: T): T {
  const result = {} as Record<string, unknown>;

  for (const [key, value] of Object.entries(payload)) {
    if (value == null) {
      continue;
    }

    if (typeof value === "string" && value.trim() === "") {
      continue;
    }

    result[key] = value;
  }

  return result as T;
}
