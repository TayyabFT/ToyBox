import { StatCard } from "@/components/staff/overview/StatCard";
import type { CommunicationStatItem } from "./types";

type CommunicationsStatsRowProps = {
  stats: CommunicationStatItem[];
};

export function CommunicationsStatsRow({ stats }: CommunicationsStatsRowProps) {
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
        />
      ))}
    </div>
  );
}
