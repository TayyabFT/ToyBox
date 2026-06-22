import { staffStats } from "@/components/admin/staff/mockData";
import type {
  StaffDirectoryResult,
  StaffProfile,
  StaffProfileDetail,
  StaffStatItem,
  StaffStatsDisplay,
} from "@/components/admin/staff/types";
import type {
  StaffFilterOption,
  StaffListData,
  StaffListItemRaw,
  StaffProfileData,
  StaffSummary,
  StaffSummaryStat,
} from "@/types/api";

export const DEFAULT_STAFF_FILTERS: StaffFilterOption[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "pending_activation", label: "Pending activation" },
];

function formatStatValue(stat: StaffSummaryStat): string {
  if (stat.displayValue?.trim()) {
    return stat.displayValue.trim();
  }

  if (stat.value === undefined || stat.value === null) {
    return "0";
  }

  return String(stat.value);
}

function mapSummaryStat(
  stat: StaffSummaryStat | undefined,
  fallback: StaffStatItem,
): StaffStatItem {
  if (!stat) {
    return fallback;
  }

  return {
    label: stat.label?.trim() || fallback.label,
    value: formatStatValue(stat),
    subtext: stat.subLabel?.trim() || fallback.subtext,
    trend: stat.trend?.trim() || undefined,
  };
}

export function mapStaffSummary(data: unknown): StaffStatsDisplay | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;
  const summary = (record.summary ?? data) as StaffSummary;

  if (
    !summary.totalStaff &&
    !summary.activeStaff &&
    !summary.pendingActivation &&
    !summary.invitedThisMonth
  ) {
    return null;
  }

  return {
    totalStaff: mapSummaryStat(summary.totalStaff, staffStats.totalStaff),
    activeStaff: mapSummaryStat(summary.activeStaff, staffStats.activeStaff),
    pendingActivation: mapSummaryStat(
      summary.pendingActivation,
      staffStats.pendingActivation,
    ),
    invitedThisMonth: mapSummaryStat(
      summary.invitedThisMonth,
      staffStats.invitedThisMonth,
    ),
  };
}

export function createEmptyStaffStats(): StaffStatsDisplay {
  return {
    totalStaff: { label: "TOTAL STAFF", value: "0", subtext: "OPERATIVES" },
    activeStaff: { label: "ACTIVE", value: "0", subtext: "ON SYSTEM" },
    pendingActivation: {
      label: "PENDING ACTIVATION",
      value: "0",
      subtext: "INVITE SENT",
    },
    invitedThisMonth: {
      label: "INVITED THIS MONTH",
      value: "0",
      subtext: "NEW HIRES",
    },
  };
}

function getStaffInitial(name: string): string {
  return name.charAt(0).toUpperCase() || "?";
}

function formatStatusLabel(status?: string): string {
  const normalized = status?.trim().toLowerCase().replace(/_/g, " ") ?? "";

  if (!normalized) return "—";

  return normalized.toUpperCase();
}

export function mapStaffListItem(
  member: StaffListItemRaw,
): StaffProfile | null {
  if (member.id === undefined || member.id === null) {
    return null;
  }

  const name = member.displayName?.trim() || `Staff #${member.id}`;

  return {
    id: String(member.id),
    initial: getStaffInitial(name),
    name,
    email: member.email?.trim() || "—",
    jobTitle: member.jobTitle?.trim() || member.role?.toUpperCase() || "—",
    accountStatus: member.accountStatus?.trim().toLowerCase() || "",
    accountStatusLabel: formatStatusLabel(member.accountStatus),
    lastSeen: member.lastSeen?.trim() || "—",
    profileImageUrl: member.profileImageUrl?.trim() ?? "",
  };
}

export function mapStaffDirectory(data: unknown): StaffDirectoryResult {
  const record =
    data && typeof data === "object" ? (data as StaffListData) : {};

  const staff = (record.staff ?? [])
    .map(mapStaffListItem)
    .filter((member): member is StaffProfile => member !== null);

  return {
    summary: mapStaffSummary(record) ?? createEmptyStaffStats(),
    filters:
      record.filters && record.filters.length > 0
        ? record.filters
        : DEFAULT_STAFF_FILTERS,
    status: record.status ?? "all",
    staff,
    total: typeof record.total === "number" ? record.total : staff.length,
    limit: typeof record.limit === "number" ? record.limit : 50,
    offset: typeof record.offset === "number" ? record.offset : 0,
  };
}

function displayValue(value?: string | number | boolean | null): string {
  if (value === undefined || value === null) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string" && !value.trim()) return "—";
  return String(value);
}

function formatDateTime(value?: string): string {
  if (!value?.trim()) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function mapStaffProfile(data: unknown): StaffProfileDetail | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const member = data as StaffProfileData;

  if (member.id === undefined || member.id === null) {
    return null;
  }

  const displayName = member.displayName?.trim() || `Staff #${member.id}`;

  return {
    id: String(member.id),
    initial: getStaffInitial(displayName),
    displayName,
    firstName: displayValue(member.firstName),
    lastName: displayValue(member.lastName),
    email: displayValue(member.email),
    jobTitle: member.jobTitle?.trim() || member.role?.toUpperCase() || "—",
    role: displayValue(member.role),
    accountStatus: displayValue(member.accountStatus),
    accountStatusLabel: formatStatusLabel(member.accountStatus),
    lastSeen: displayValue(member.lastSeen),
    profileImageUrl: member.profileImageUrl?.trim() ?? "",
    mobile: displayValue(member.mobile),
    mobileCountryCode: displayValue(member.mobileCountryCode),
    invitedAt: formatDateTime(member.invitedAt),
    invitationAcceptedAt: formatDateTime(member.invitationAcceptedAt),
    createdAt: formatDateTime(member.createdAt),
    updatedAt: formatDateTime(member.updatedAt),
  };
}
