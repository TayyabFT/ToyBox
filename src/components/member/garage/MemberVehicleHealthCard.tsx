import type { MemberVehicleHealthMetric, MemberVehicleHealthTone } from "./types";

function getTone(percentage: number): MemberVehicleHealthTone {
  if (percentage >= 80) return "good";
  if (percentage >= 50) return "warning";
  return "critical";
}

const barToneClass: Record<MemberVehicleHealthTone, string> = {
  good: "bg-teal",
  warning: "bg-primary",
  critical: "bg-pink",
};

const valueToneClass: Record<MemberVehicleHealthTone, string> = {
  good: "text-teal",
  warning: "text-primary",
  critical: "text-pink",
};

function HealthRow({ metric }: { metric: MemberVehicleHealthMetric }) {
  const tone = getTone(metric.percentage);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="font-roboto text-[13px] font-medium text-foreground">
          {metric.label}
        </span>
        <span className={`font-roboto text-[13px] font-semibold ${valueToneClass[tone]}`}>
          {metric.percentage}%
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-accent/10">
        <div
          className={`h-full rounded-full ${barToneClass[tone]}`}
          style={{ width: `${metric.percentage}%` }}
        />
      </div>
      <p className="font-roboto text-[10px] tracking-[0.02em] text-secondary/70">
        {metric.note}
      </p>
    </div>
  );
}

type MemberVehicleHealthCardProps = {
  health: MemberVehicleHealthMetric[];
  ctaLabel: string;
  onCtaClick?: () => void;
};

export function MemberVehicleHealthCard({
  health,
  ctaLabel,
  onCtaClick,
}: MemberVehicleHealthCardProps) {
  return (
    <div className="rounded-2xl border border-accent/10 bg-card p-4 sm:p-5">
      <h2 className="font-copperplate text-[14px] sm:text-[15px] uppercase">
        <span className="text-foreground">Vehicle </span>
        <span className="text-primary">Health</span>
      </h2>

      <div className="mt-4 sm:mt-5 space-y-4 sm:space-y-5">
        {health.map((metric) => (
          <HealthRow key={metric.label} metric={metric} />
        ))}
      </div>

      <button
        type="button"
        onClick={onCtaClick}
        className="font-roboto mt-5 sm:mt-6 w-full cursor-pointer rounded-xl bg-primary py-3 sm:py-3.5 text-[13px] font-semibold text-dark transition-colors hover:bg-[#D4B45C]"
      >
        {ctaLabel}
      </button>
    </div>
  );
}
