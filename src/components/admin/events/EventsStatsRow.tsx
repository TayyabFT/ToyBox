import { StatCard } from "@/components/staff/overview/StatCard";

export type EventStatItem = {
  label: string;
  value: string;
  subtext: string;
  trend?: string;
  icon: React.ReactNode;
};

type EventsStatsRowProps = {
  stats: EventStatItem[];
};

export function EventsStatsRow({ stats }: EventsStatsRowProps) {
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
