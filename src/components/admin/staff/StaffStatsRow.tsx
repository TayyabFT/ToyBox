"use client";

import {
  MemberCheckStat,
  MemberStarStat,
  MemberTargetStat,
  MemberUserStat,
} from "@/components/common/Svgs";
import { StatCard } from "@/components/staff/overview/StatCard";
import type { StaffStatsDisplay } from "./types";

type StaffStatsRowProps = {
  stats: StaffStatsDisplay;
  loading?: boolean;
};

export function StaffStatsRow({ stats, loading = false }: StaffStatsRowProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-4 ${
        loading ? "opacity-70" : ""
      }`}
      aria-busy={loading}
    >
      <StatCard
        label={stats.totalStaff.label}
        value={stats.totalStaff.value}
        subtext={stats.totalStaff.subtext}
        trend={stats.totalStaff.trend}
        icon={<MemberUserStat color="var(--primary)" />}
      />
      <StatCard
        label={stats.activeStaff.label}
        value={stats.activeStaff.value}
        subtext={stats.activeStaff.subtext}
        icon={<MemberCheckStat color="var(--primary)" />}
      />
      <StatCard
        label={stats.pendingActivation.label}
        value={stats.pendingActivation.value}
        subtext={stats.pendingActivation.subtext}
        icon={<MemberTargetStat color="var(--primary)" />}
      />
      <StatCard
        label={stats.invitedThisMonth.label}
        value={stats.invitedThisMonth.value}
        subtext={stats.invitedThisMonth.subtext}
        trend={stats.invitedThisMonth.trend}
        icon={<MemberStarStat color="var(--primary)" />}
      />
    </div>
  );
}
