import type { StaffFilterOption } from "@/types/api";

export type { StaffFilterOption };

export type StaffStatItem = {
  label: string;
  value: string;
  subtext: string;
  trend?: string;
};

export type StaffStatsDisplay = {
  totalStaff: StaffStatItem;
  activeStaff: StaffStatItem;
  pendingActivation: StaffStatItem;
  invitedThisMonth: StaffStatItem;
};

export type StaffProfile = {
  id: string;
  initial: string;
  name: string;
  email: string;
  jobTitle: string;
  accountStatus: string;
  accountStatusLabel: string;
  lastSeen: string;
  profileImageUrl: string;
};

export type StaffDirectoryResult = {
  summary: StaffStatsDisplay;
  filters: StaffFilterOption[];
  status: string;
  staff: StaffProfile[];
  total: number;
  limit: number;
  offset: number;
};

export type StaffProfileDetail = {
  id: string;
  initial: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  role: string;
  accountStatus: string;
  accountStatusLabel: string;
  lastSeen: string;
  profileImageUrl: string;
  mobile: string;
  mobileCountryCode: string;
  invitedAt: string;
  invitationAcceptedAt: string;
  createdAt: string;
  updatedAt: string;
};
