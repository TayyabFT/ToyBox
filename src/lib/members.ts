import { memberStats } from "@/components/admin/members/mockData";
import type {
  MemberProfile,
  MemberProfileDetail,
  MemberStatItem,
  MemberStatsDisplay,
  MembersDirectoryResult,
} from "@/components/admin/members/types";
import type {
  MemberFilterOption,
  MemberListItemRaw,
  MemberProfileData,
  MemberSummaryStat,
  MembersListData,
  MembersSummary,
  MemberTierFilter,
} from "@/types/api";

export const DEFAULT_MEMBER_FILTERS: MemberFilterOption[] = [
  { key: "all", label: "ALL" },
  { key: "access", label: "ACCESS" },
  { key: "private", label: "PRIVATE" },
  { key: "principal", label: "PRINCIPLE" },
  { key: "black_card", label: "BLACK CARD" },
];

function formatStatValue(stat: MemberSummaryStat): string {
  if (stat.displayValue?.trim()) {
    return stat.displayValue.trim();
  }

  if (stat.value === undefined || stat.value === null) {
    return "0";
  }

  return String(stat.value);
}

function mapSummaryStat(
  stat: MemberSummaryStat | undefined,
  fallback: MemberStatItem,
): MemberStatItem {
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

export function mapMemberSummary(data: unknown): MemberStatsDisplay | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;
  const summary = (record.summary ?? data) as MembersSummary;

  if (
    !summary.totalMembers &&
    !summary.vipTier &&
    !summary.onPremises &&
    !summary.retentionYtd
  ) {
    return null;
  }

  return {
    totalMembers: mapSummaryStat(summary.totalMembers, memberStats.totalMembers),
    vipTier: mapSummaryStat(summary.vipTier, memberStats.vipTier),
    onPremises: mapSummaryStat(summary.onPremises, memberStats.onPremises),
    retentionYtd: mapSummaryStat(summary.retentionYtd, memberStats.retentionYtd),
  };
}

export function createEmptyMemberStats(): MemberStatsDisplay {
  return {
    totalMembers: {
      label: "TOTAL MEMBERS",
      value: "0",
      subtext: "FOUNDING",
    },
    vipTier: {
      label: "VIP TIER",
      value: "0",
      subtext: "TOP SPEND",
    },
    onPremises: {
      label: "ON PREMISES",
      value: "0",
      subtext: "REAL-TIME",
    },
    retentionYtd: {
      label: "RETENTION - YTD",
      value: "0%",
      subtext: "%",
    },
  };
}

function getMemberInitial(name: string): string {
  return name.charAt(0).toUpperCase() || "?";
}

export function mapMemberListItem(
  member: MemberListItemRaw,
): MemberProfile | null {
  if (member.id === undefined || member.id === null) {
    return null;
  }

  const name = member.displayName?.trim() || `Member #${member.id}`;
  const memberNo = member.memberNumber?.trim() || String(member.id);
  const since = member.memberSince?.trim() || "—";
  const tier = member.tierLabel?.trim() || member.membershipTier?.toUpperCase() || "—";
  const stats = member.headerStats;

  return {
    id: String(member.id),
    initial: getMemberInitial(name),
    name,
    memberNo,
    since,
    tier,
    vehicles: stats?.vehicles ?? 0,
    events: stats?.events ?? 0,
    miles: stats?.miles ?? 0,
    days: stats?.days ?? 0,
    lastSeen: member.lastSeen?.trim() || "—",
  };
}

export function mapMembersDirectory(data: unknown): MembersDirectoryResult {
  const record =
    data && typeof data === "object" ? (data as MembersListData) : {};

  const members = (record.members ?? [])
    .map(mapMemberListItem)
    .filter((member): member is MemberProfile => member !== null);

  return {
    summary: mapMemberSummary(record) ?? createEmptyMemberStats(),
    filters:
      record.filters && record.filters.length > 0
        ? record.filters
        : DEFAULT_MEMBER_FILTERS,
    tier: record.tier ?? "all",
    members,
    total: typeof record.total === "number" ? record.total : members.length,
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

export function mapMemberProfile(data: unknown): MemberProfileDetail | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const member = data as MemberProfileData;

  if (member.id === undefined || member.id === null) {
    return null;
  }

  const displayName = member.displayName?.trim() || `Member #${member.id}`;
  const stats = member.headerStats;

  return {
    id: String(member.id),
    initial: getMemberInitial(displayName),
    displayName,
    firstName: displayValue(member.firstName),
    lastName: displayValue(member.lastName),
    email: displayValue(member.email),
    memberNumber: displayValue(member.memberNumber),
    memberNumberLabel: displayValue(member.memberNumberLabel),
    memberSince: displayValue(member.memberSince),
    memberSinceLabel: displayValue(member.memberSinceLabel),
    membershipTier: displayValue(member.membershipTier),
    tierLabel: displayValue(member.tierLabel),
    lastSeen: displayValue(member.lastSeen),
    profileImageUrl: member.profileImageUrl?.trim() ?? "",
    accountStatus: displayValue(member.accountStatus),
    onPremises: displayValue(member.onPremises),
    mobile: displayValue(member.mobile),
    mobileCountryCode: displayValue(member.mobileCountryCode),
    residence: displayValue(member.residence),
    displayHandle: displayValue(member.displayHandle),
    membershipValidUntil: displayValue(member.membershipValidUntil),
    membershipValidityMonths: displayValue(member.membershipValidityMonths),
    invitedAt: formatDateTime(member.invitedAt),
    invitationAcceptedAt: formatDateTime(member.invitationAcceptedAt),
    privacySettings: displayValue(member.privacySettings),
    vehicles: stats?.vehicles ?? 0,
    events: stats?.events ?? 0,
    miles: stats?.miles ?? 0,
    days: stats?.days ?? 0,
  };
}
