import { StatCard } from "@/components/admin/overview/StatCard";
import {
  MemberStatVehicleIcon,
  MemberStatRequestIcon,
  MemberStatEventIcon,
  MemberStatDaysIcon,
} from "@/components/common/Svgs";
import type { MemberKpi } from "@/components/member/dashboard/types";

type MemberStatsRowProps = {
  kpis: MemberKpi[];
};

type IconKey = "vehicles" | "requests" | "events" | "days";

const ICON_MAP: Record<IconKey, React.ReactNode> = {
  vehicles: <MemberStatVehicleIcon color="currentColor" />,
  requests: <MemberStatRequestIcon color="currentColor" />,
  events: <MemberStatEventIcon color="currentColor" />,
  days: <MemberStatDaysIcon color="currentColor" />,
};

export function MemberStatsRow({ kpis }: MemberStatsRowProps) {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {kpis.map((kpi, i) => {
        const isFeatured = i === 0;
        const iconKey = kpi.iconKey as IconKey;

        return (
          <StatCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            footnote={kpi.subtext}
            icon={ICON_MAP[iconKey]}
            featured={isFeatured}
          />
        );
      })}
    </div>
  );
}
