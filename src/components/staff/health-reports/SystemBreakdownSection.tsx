import { HealthProgressBar } from "@/components/staff/vehicles/HealthProgressBar";
import type { HealthMetric } from "@/components/staff/vehicles/types";
import { Chip } from "@/components/ui/Chip";

type SystemBreakdownSectionProps = {
  metrics: HealthMetric[];
  criticalCount?: number;
};

export function SystemBreakdownSection({
  metrics,
  criticalCount = 0,
}: SystemBreakdownSectionProps) {
  const midpoint = Math.ceil(metrics.length / 2);
  const leftColumn = metrics.slice(0, midpoint);
  const rightColumn = metrics.slice(midpoint);

  return (
    <section className="space-y-4 px-5 py-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-copperplate text-[11px] tracking-[0.04em] text-foreground uppercase">
          System Breakdown
        </h3>
        {criticalCount > 0 && (
          <Chip
            label={`+ ${criticalCount} Critical`}
            context="inline"
            tone="pink"
            shape="pill"
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
        {[leftColumn, rightColumn].map((column, columnIndex) => (
          <div key={columnIndex} className="space-y-4">
            {column.map((metric) => (
              <HealthProgressBar key={metric.label} metric={metric} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
