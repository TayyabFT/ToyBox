import type {
  StaffClubhouseReservationRaw,
  StaffClubhouseSummaryRaw,
  StaffClubhouseZoneTabRaw,
} from "@/types/api";
import type {
  ClubhouseReservation,
  ClubhouseReservationStatus,
  ClubhouseSummaryDisplay,
  ClubhouseZoneFilter,
} from "@/components/staff/clubhouse/types";

const avatarClasses = [
  "bg-gradient-to-b from-gold-bright to-gold-deep text-dark",
  "bg-avatar-slate text-foreground",
  "bg-avatar-rose text-foreground",
  "bg-avatar-purple text-foreground",
  "bg-avatar-green text-foreground",
];

const defaultZoneTabs: { id: ClubhouseZoneFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "restaurant", label: "Restaurant" },
  { id: "lounge", label: "Lounge" },
  { id: "suite", label: "Suite" },
];

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function extractArray<T>(
  value: unknown,
  keys: string[] = ["reservations", "items", "records", "data"],
): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  const record = asRecord(value);

  if (!record) {
    return [];
  }

  for (const key of keys) {
    const candidate = record[key];

    if (Array.isArray(candidate)) {
      return candidate as T[];
    }
  }

  return [];
}

function pickCount(
  record: StaffClubhouseSummaryRaw,
  keys: string[],
): number {
  for (const key of keys) {
    const value = record[key as keyof StaffClubhouseSummaryRaw];

    if (typeof value === "number" && !Number.isNaN(value)) {
      return value;
    }
  }

  return 0;
}

function normalizeZoneFilter(
  zone?: string,
): Exclude<ClubhouseZoneFilter, "all"> {
  const normalized = zone?.trim().toLowerCase() ?? "";

  if (normalized.includes("suite")) {
    return "suite";
  }

  if (normalized.includes("lounge")) {
    return "lounge";
  }

  return "restaurant";
}

function normalizeStatus(status?: string): ClubhouseReservationStatus {
  const normalized = status?.trim().toLowerCase() ?? "pending";

  if (normalized === "confirmed") {
    return "confirmed";
  }

  if (normalized === "prep" || normalized === "preparation") {
    return "prep";
  }

  if (normalized === "cancelled" || normalized === "canceled") {
    return "cancelled";
  }

  return "pending";
}

function toOptionalString(value: unknown): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || undefined;
  }

  if (typeof value === "number" && !Number.isNaN(value)) {
    return String(value);
  }

  const record = asRecord(value);

  if (record) {
    for (const key of ["name", "label", "title", "tier", "value", "slug"]) {
      const candidate = toOptionalString(record[key]);

      if (candidate) {
        return candidate;
      }
    }
  }

  return undefined;
}

function resolveMemberName(raw: StaffClubhouseReservationRaw): string {
  return (
    toOptionalString(raw.memberName) ||
    toOptionalString(raw.member?.fullName) ||
    toOptionalString(raw.member?.name) ||
    "Member"
  );
}

function resolveMemberNumber(raw: StaffClubhouseReservationRaw): string {
  const number =
    toOptionalString(raw.memberNumber) ||
    toOptionalString(raw.member?.memberNumber) ||
    toOptionalString(raw.member?.number) ||
    "";

  if (!number) {
    return "Member No. —";
  }

  return number.toLowerCase().startsWith("member")
    ? number
    : `Member No. ${number}`;
}

function resolveMemberTier(raw: StaffClubhouseReservationRaw): string {
  return (
    toOptionalString(raw.memberTier) ||
    toOptionalString(raw.member?.tier) ||
    toOptionalString(raw.member?.tierLabel) ||
    toOptionalString(raw.member?.membershipTier) ||
    "Member"
  );
}

function resolveMemberInitial(
  raw: StaffClubhouseReservationRaw,
  memberName: string,
): string {
  const initial =
    toOptionalString(raw.memberInitial) || toOptionalString(raw.member?.initial);

  if (initial) {
    return initial.slice(0, 1).toUpperCase();
  }

  return memberName.trim().charAt(0).toUpperCase() || "M";
}

function resolveZone(raw: StaffClubhouseReservationRaw): string {
  return (
    raw.zone?.trim() ||
    raw.venueTitle?.trim() ||
    raw.venue?.trim() ||
    raw.zoneType?.trim() ||
    "Restaurant"
  );
}

function resolveTime(raw: StaffClubhouseReservationRaw): string {
  return raw.timeSlot?.trim() || raw.time?.trim() || "—";
}

function formatDateLabel(date?: string): string {
  if (!date?.trim()) {
    return "—";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date.trim();
  }

  return parsed.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
  });
}

function formatDateTime(raw: StaffClubhouseReservationRaw): string {
  const dateLabel = formatDateLabel(raw.date);
  const time = resolveTime(raw);

  if (dateLabel === "—") {
    return time;
  }

  return `${dateLabel} · ${time}`;
}

function formatConfirmedAt(value?: string): string | undefined {
  if (!value?.trim()) {
    return undefined;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value.trim();
  }

  return parsed.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function resolveStatusDetail(
  raw: StaffClubhouseReservationRaw,
  status: ClubhouseReservationStatus,
): string {
  if (raw.statusDetail?.trim()) {
    return raw.statusDetail.trim();
  }

  if (status === "confirmed") {
    const confirmedBy =
      raw.confirmedBy?.trim() || raw.confirmedByName?.trim() || "";

    if (confirmedBy) {
      return `by ${confirmedBy}`;
    }

    return "confirmed";
  }

  if (status === "prep") {
    return "prep in progress";
  }

  return "awaiting staff";
}

function resolveAvatarClass(index: number): string {
  return avatarClasses[index % avatarClasses.length];
}

function mapZoneTab(
  tab: StaffClubhouseZoneTabRaw,
): { id: ClubhouseZoneFilter; label: string } | null {
  const id = (tab.id || tab.key || tab.value || "").trim().toLowerCase();
  const label = tab.label?.trim();

  if (!id) {
    return null;
  }

  if (id === "all") {
    return { id: "all", label: label || "All" };
  }

  if (id.includes("suite")) {
    return { id: "suite", label: label || "Suite" };
  }

  if (id.includes("lounge")) {
    return { id: "lounge", label: label || "Lounge" };
  }

  if (id.includes("restaurant")) {
    return { id: "restaurant", label: label || "Restaurant" };
  }

  return {
    id: normalizeZoneFilter(id),
    label: label || id,
  };
}

export function mapClubhouseSummary(data: unknown): ClubhouseSummaryDisplay {
  const record =
    (asRecord(data) as StaffClubhouseSummaryRaw | null) ??
    (asRecord(asRecord(data)?.summary) as StaffClubhouseSummaryRaw | null) ??
    {};

  const zoneTabsSource =
    record.zoneTabs ?? record.filters ?? record.tabs ?? defaultZoneTabs;

  const zoneTabs = (Array.isArray(zoneTabsSource) ? zoneTabsSource : defaultZoneTabs)
    .map((tab) =>
      typeof tab === "string"
        ? mapZoneTab({ id: tab, label: tab })
        : mapZoneTab(tab),
    )
    .filter((tab): tab is { id: ClubhouseZoneFilter; label: string } => tab !== null);

  return {
    dateLabel: record.dateLabel?.trim() || record.displayDate?.trim() || "Today",
    shiftLabel: record.shiftLabel?.trim() || record.shift?.trim() || "Shift",
    confirmedCount: pickCount(record, ["confirmedCount", "confirmed"]),
    walkInCount: pickCount(record, ["walkInCount", "walkIns"]),
    pendingCount: pickCount(record, ["pendingCount", "pending"]),
    prepCount: pickCount(record, ["prepCount", "prep"]),
    zoneTabs: zoneTabs.length > 0 ? zoneTabs : defaultZoneTabs,
  };
}

export function createEmptyClubhouseSummary(): ClubhouseSummaryDisplay {
  return {
    dateLabel: "Today",
    shiftLabel: "Shift",
    confirmedCount: 0,
    walkInCount: 0,
    pendingCount: 0,
    prepCount: 0,
    zoneTabs: defaultZoneTabs,
  };
}

export function mapClubhouseReservationsList(
  data: unknown,
): ClubhouseReservation[] {
  return extractArray<StaffClubhouseReservationRaw>(data)
    .map((raw, index) => mapClubhouseReservation(raw, index))
    .filter((item): item is ClubhouseReservation => item !== null);
}

export function mapClubhouseReservation(
  raw: StaffClubhouseReservationRaw | undefined | null,
  index = 0,
): ClubhouseReservation | null {
  if (!raw || raw.id === undefined || raw.id === null) {
    return null;
  }

  const memberName = resolveMemberName(raw);
  const zone = resolveZone(raw);
  const status = normalizeStatus(raw.status);
  const confirmedBy =
    raw.confirmedBy?.trim() || raw.confirmedByName?.trim() || undefined;

  return {
    id: String(raw.id),
    time: resolveTime(raw),
    memberName,
    memberInitial: resolveMemberInitial(raw, memberName),
    memberNumber: resolveMemberNumber(raw),
    memberTier: resolveMemberTier(raw),
    avatarClass: resolveAvatarClass(index),
    zone,
    zoneFilter: normalizeZoneFilter(zone),
    venueTitle: raw.venueTitle?.trim() || zone,
    pax: raw.guests ?? raw.pax ?? 0,
    date: raw.date?.trim() || "",
    dateTime: formatDateTime(raw),
    occasion: raw.occasion?.trim() || "—",
    specialRequests: raw.specialRequests?.trim() || "—",
    arrivalNote: raw.arrivalNote?.trim() || "",
    status,
    statusDetail: resolveStatusDetail(raw, status),
    confirmedBy,
    confirmedAt: formatConfirmedAt(raw.confirmedAt),
  };
}

export function toReservationDateQuery(date?: string): string | undefined {
  if (!date?.trim()) {
    return undefined;
  }

  const trimmed = date.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const parsed = new Date(trimmed);

  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed.toISOString().slice(0, 10);
}
