import type { MemberFilterOption, MemberTierFilter } from "@/types/api";

export type { MemberFilterOption, MemberTierFilter };

export type MemberStatItem = {
  label: string;
  value: string;
  subtext: string;
  trend?: string;
};

export type MemberStatsDisplay = {
  totalMembers: MemberStatItem;
  vipTier: MemberStatItem;
  onPremises: MemberStatItem;
  retentionYtd: MemberStatItem;
};

export type MemberProfile = {
  id: string;
  initial: string;
  name: string;
  memberNo: string;
  since: string;
  tier: string;
  vehicles: number;
  events: number;
  miles: number;
  days: number;
  lastSeen: string;
};

export type MembersDirectoryResult = {
  summary: MemberStatsDisplay;
  filters: MemberFilterOption[];
  tier: MemberTierFilter;
  members: MemberProfile[];
  total: number;
  limit: number;
  offset: number;
};

export type MemberProfileDetail = {
  id: string;
  initial: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  memberNumber: string;
  memberNumberLabel: string;
  memberSince: string;
  memberSinceLabel: string;
  membershipTier: string;
  tierLabel: string;
  lastSeen: string;
  profileImageUrl: string;
  accountStatus: string;
  onPremises: string;
  mobile: string;
  mobileCountryCode: string;
  residence: string;
  displayHandle: string;
  membershipValidUntil: string;
  membershipValidityMonths: string;
  invitedAt: string;
  invitationAcceptedAt: string;
  privacySettings: string;
  vehicles: number;
  events: number;
  miles: number;
  days: number;
};
