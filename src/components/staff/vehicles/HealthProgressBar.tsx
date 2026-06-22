import type { HealthMetric } from "./types";

const barToneClass = {
  pink: "bg-pink",
  gold: "bg-primary",
  teal: "bg-teal",
};

const valueToneClass = {
  pink: "text-pink",
  gold: "text-primary",
  teal: "text-teal",
};

type HealthProgressBarProps = {
  metric: HealthMetric;
};

export function HealthProgressBar({ metric }: HealthProgressBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="font-roboto text-[10px] tracking-[0.04em] text-secondary uppercase">
          {metric.label}
        </span>
        <span
          className={`font-roboto text-[10px] font-medium tracking-[0.04em] ${valueToneClass[metric.tone]}`}
        >
          {metric.value}%
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-accent/10">
        <div
          className={`h-full rounded-full ${barToneClass[metric.tone]}`}
          style={{ width: `${metric.value}%` }}
        />
      </div>
    </div>
  );
}
