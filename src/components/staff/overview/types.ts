import type { ReactNode } from "react";

export type OverviewKpiItem = {
  label: string;
  value: string;
  subtext: string;
  trend?: string;
  iconKey: string;
};

export type OverviewQuickActionItem = {
  id: string;
  title: string;
  subtitle: string;
  iconKey: string;
    href: string;
};

export type OverviewPriorityTaskItem = {
  id: string;
  index: string;
  title: string;
  detail: string;
  time?: string;
  status?: { label: string; tone: "green" };
  iconKey: string;
  iconTone: "pink" | "gold" | "blue" | "teal";
};

export type OverviewScheduleItem = {
  id: string;
  time: string;
  title: string;
  detail: string;
};

export type OverviewSystemAlertItem = {
  id: string;
  message: string;
  time: string;
  iconKey: string;
};

export type OverviewStaffDutyItem = {
  id: string;
  initial: string;
  name: string;
  role: string;
  avatarClass: string;
  statusTone: "green" | "gold";
  highlight?: boolean;
};

export type OverviewShiftStatItem = {
  label: string;
  value: string;
};

export type OverviewAssignment = {
  bay: string;
  location: string;
  vehicle: string;
  shiftStatus: string;
};

export type StaffOverviewDisplay = {
  greeting: {
    displayDate: string;
    shiftLabel: string;
    staffName: string;
    timeRemainingLabel?: string;
  };
  kpis: OverviewKpiItem[];
  quickActions: OverviewQuickActionItem[];
  priorityTasks: {
    urgentCount: number;
    items: OverviewPriorityTaskItem[];
  };
  schedule: {
    eventCount: number;
    items: OverviewScheduleItem[];
  };
  systemAlerts: {
    criticalCount: number;
    items: OverviewSystemAlertItem[];
  };
  staffOnDuty: {
    activeCount: number;
    items: OverviewStaffDutyItem[];
  };
  shiftStats: {
    shiftLabel: string;
    items: OverviewShiftStatItem[];
  };
  assignment: OverviewAssignment | null;
};

export type OverviewIconResolver = (iconKey: string) => ReactNode;
