"use client";

import {
  MemberCheckStat,
  MemberStarStat,
  MemberTargetStat,
  MemberUserStat,
} from "@/components/common/Svgs";
import { StatCard } from "@/components/staff/overview/StatCard";
import type { MemberStatsDisplay } from "./types";

type MembersStatsRowProps = {
  stats: MemberStatsDisplay;
  loading?: boolean;
};

export function MembersStatsRow({ stats, loading = false }: MembersStatsRowProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-4 ${
        loading ? "opacity-70" : ""
      }`}
      aria-busy={loading}
    >
      <StatCard
        label={stats.totalMembers.label}
        value={stats.totalMembers.value}
        subtext={stats.totalMembers.subtext}
        trend={stats.totalMembers.trend}
        icon={<MemberUserStat color="var(--primary)" />}
      />
      <StatCard
        label={stats.vipTier.label}
        value={stats.vipTier.value}
        subtext={stats.vipTier.subtext}
        icon={<MemberStarStat color="var(--primary)" />}
      />
      <StatCard
        label={stats.onPremises.label}
        value={stats.onPremises.value}
        subtext={stats.onPremises.subtext}
        icon={<MemberTargetStat color="var(--primary)" />}
      />
      <StatCard
        label={stats.retentionYtd.label}
        value={stats.retentionYtd.value}
        subtext={stats.retentionYtd.subtext}
        trend={stats.retentionYtd.trend}
        icon={<MemberCheckStat color="var(--primary)" />}
      />
    </div>
  );
}
