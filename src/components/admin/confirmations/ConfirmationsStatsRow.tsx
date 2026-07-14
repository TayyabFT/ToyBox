import { ChartBars, CircleCheck, Edit, VehicleClock } from "@/components/common/Svgs";
import { ConfirmationStatCard } from "./ConfirmationStatCard";
import { confirmationStats as fallbackStats } from "./mockData";
import type { ConfirmationStatItem } from "./types";

const statIconClassName =
  "size-4 [&_path]:!stroke-[#C5A059] group-hover:[&_path]:!stroke-[#0A0806]";

const statIcons = [
  <VehicleClock key="clock" color="#C5A059" className={statIconClassName} />,
  <Edit key="edit" active className={statIconClassName} />,
  <CircleCheck key="check" active className={statIconClassName} />,
  <ChartBars key="chart" className={statIconClassName} />,
];

type ConfirmationsStatsRowProps = {
  stats?: ConfirmationStatItem[];
  loading?: boolean;
};

export function ConfirmationsStatsRow({
  stats = fallbackStats,
  loading = false,
}: ConfirmationsStatsRowProps) {
  return (
    <div
      className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-4"
      aria-busy={loading}
    >
      {stats.map((stat, index) => (
        <ConfirmationStatCard
          key={stat.label}
          {...stat}
          icon={statIcons[index]}
          valueLoading={loading}
        />
      ))}
    </div>
  );
}
