// ── Static option lists for the Parking modal ────────────────────────────────

export type ParkingChipOption = {
  key: string;
  label: string;
};

export const LEVEL_OPTIONS: ParkingChipOption[] = [
  { key: "any", label: "Any" },
  { key: "01", label: "Level 01" },
  { key: "02", label: "Level 02" },
  { key: "03", label: "Level 03" },
];

export const ZONE_OPTIONS: ParkingChipOption[] = [
  { key: "any", label: "Any" },
  { key: "A", label: "Zone A" },
  { key: "B", label: "Zone B" },
  { key: "C", label: "Zone C" },
];

export const SLOT_TYPE_OPTIONS: ParkingChipOption[] = [
  { key: "any", label: "Any" },
  { key: "standard", label: "Standard" },
  { key: "covered", label: "Covered" },
  { key: "ev", label: "EV" },
  { key: "premium", label: "Premium" },
  { key: "oversized", label: "Oversized" },
];

export const SLOT_TYPE_LABELS: Record<string, string> = {
  standard: "Standard",
  covered: "Covered",
  ev: "EV",
  premium: "Premium",
  oversized: "Oversized",
};

export function getSlotTypeLabel(key: string): string {
  return SLOT_TYPE_LABELS[key] ?? key;
}

// ── Date/time helpers ─────────────────────────────────────────────────────────

/** Returns today's date as YYYY-MM-DD */
export function todayIso(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Returns current time rounded to next 15 min, as HH:mm */
export function currentRoundedTime(offsetMinutes = 0): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() + offsetMinutes);
  const rounded = Math.ceil(d.getMinutes() / 15) * 15;
  d.setMinutes(rounded, 0, 0);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/** Formats a YYYY-MM-DD + HH:mm pair into an ISO 8601 string for the API */
export function toIsoString(date: string, time: string): string {
  return `${date}T${time}:00`;
}

/**
 * Formats a date+time into the design's display format:
 * "20-Jul-2026 · 7:29 PM"
 */
export function formatParkingDateTime(date: string, time: string): string {
  const [yyyy, mm, dd] = date.split("-").map(Number);
  const [hh, min] = time.split(":").map(Number);
  const d = new Date(yyyy, mm - 1, dd, hh, min);

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dayPart = `${String(dd).padStart(2, "0")}-${months[mm - 1]}-${yyyy}`;

  const hours12 = d.getHours() % 12 || 12;
  const ampm = d.getHours() < 12 ? "AM" : "PM";
  const timePart = `${hours12}:${String(min).padStart(2, "0")} ${ampm}`;

  return `${dayPart} · ${timePart}`;
}

/**
 * Formats a window like the review/confirmed rows:
 * "21 Jul 2026 · 19:29 → 24 Jul 2026 · 22:29"
 */
export function formatParkingWindow(
  fromDate: string,
  fromTime: string,
  toDate: string,
  toTime: string,
): string {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  function fmt(date: string, time: string) {
    const [yyyy, mm, dd] = date.split("-").map(Number);
    return `${dd} ${months[mm - 1]} ${yyyy} · ${time}`;
  }

  return `${fmt(fromDate, fromTime)} → ${fmt(toDate, toTime)}`;
}
