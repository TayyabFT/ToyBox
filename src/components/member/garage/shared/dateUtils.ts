// ── Shared date utilities for all garage request modals ──────────────────────

export const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const LONG_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Parses a date value that may be:
 *  - an ISO string "YYYY-MM-DD"           (standard format)
 *  - a plain day-of-month string "30"/"1" (legacy — treated as current/next month)
 */
export function parseDateValue(value: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  // Legacy: plain day number e.g. "30", "1"
  const now = new Date();
  const dayNum = Number(value);
  const month =
    dayNum < now.getDate()
      ? new Date(now.getFullYear(), now.getMonth() + 1, 1).getMonth()
      : now.getMonth();
  const year =
    dayNum < now.getDate() && now.getMonth() === 11
      ? now.getFullYear() + 1
      : now.getFullYear();

  return new Date(year, month, dayNum);
}

/** "Thursday, 1 May 2026" */
export function formatFullDate(value: string): string {
  const d = parseDateValue(value);
  const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
  return `${weekday}, ${d.getDate()} ${LONG_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "1 May" */
export function formatShortDate(value: string): string {
  const d = parseDateValue(value);
  return `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]}`;
}

/** "1 May 2026" */
export function formatShortDateWithYear(value: string): string {
  const d = parseDateValue(value);
  return `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
