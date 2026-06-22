import { HealthProgressBar } from "./HealthProgressBar";
import type { HealthMetric } from "./types";

type HealthConditionGridProps = {
  health: HealthMetric[];
  condition: HealthMetric[];
};

export function HealthConditionGrid({
  health,
  condition,
}: HealthConditionGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 border-b border-accent/10 px-5 py-5 md:grid-cols-2">
      <div className="space-y-4">
        <h3 className="font-copperplate text-[11px] text-foreground">
          System Health
        </h3>
        <div className="space-y-4">
          {health.map((metric) => (
            <HealthProgressBar key={metric.label} metric={metric} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-copperplate text-[11px] text-foreground">
          Condition
        </h3>
        <div className="space-y-4">
          {condition.map((metric) => (
            <HealthProgressBar key={metric.label} metric={metric} />
          ))}
        </div>
      </div>
    </div>
  );
}
