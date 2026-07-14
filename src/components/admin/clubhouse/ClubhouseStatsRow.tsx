import {
  StatBuildingIcon,
  StatCalendarIcon,
  StatDollarIcon,
  StatSuiteIcon,
} from "@/components/common/Svgs";
import { StatCard } from "@/components/staff/overview/StatCard";
import type { ClubhouseStatsDisplay } from "./types";

type ClubhouseStatsRowProps = {
  stats: ClubhouseStatsDisplay;
  loading?: boolean;
};

export function ClubhouseStatsRow({
  stats,
  loading = false,
}: ClubhouseStatsRowProps) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-4">
      <StatCard
        label={stats.onPremises.label}
        value={stats.onPremises.value}
        subtext={stats.onPremises.subtext}
        trend={stats.onPremises.trend}
        icon={<StatBuildingIcon color="var(--primary)" />}
        valueLoading={loading}
      />
      <StatCard
        label={stats.reservations.label}
        value={stats.reservations.value}
        subtext={stats.reservations.subtext}
        icon={<StatCalendarIcon color="var(--primary)" />}
        valueLoading={loading}
      />
      <StatCard
        label={stats.fnbRevenue.label}
        value={stats.fnbRevenue.value}
        subtext={stats.fnbRevenue.subtext}
        trend={stats.fnbRevenue.trend}
        icon={<StatDollarIcon color="var(--primary)" />}
        valueLoading={loading}
      />
      <StatCard
        label={stats.suiteOccupancy.label}
        value={stats.suiteOccupancy.value}
        subtext={stats.suiteOccupancy.subtext}
        icon={<StatSuiteIcon color="var(--primary)" />}
        valueLoading={loading}
      />
    </div>
  );
}
