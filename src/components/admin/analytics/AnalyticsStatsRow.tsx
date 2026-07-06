import { StatCard } from "@/components/staff/overview/StatCard";
import type { AnalyticsStatItem } from "./types";

type AnalyticsStatsRowProps = {
  stats: AnalyticsStatItem[];
  loading?: boolean;
};

export function AnalyticsStatsRow({ stats, loading = false }: AnalyticsStatsRowProps) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          subtext={stat.subtext}
          trend={stat.trend}
          icon={stat.icon}
          valueLoading={loading}
        />
      ))}
    </div>
  );
}
