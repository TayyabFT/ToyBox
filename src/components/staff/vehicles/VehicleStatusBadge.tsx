import type { VehicleStatus } from "./types";

const statusConfig: Record<
  VehicleStatus,
  { label: string; className: string }
> = {
  "in-service": {
    label: "IN SERVICE",
    className: "border-accent/28 bg-accent/10 text-accent",
  },
  ready: {
    label: "READY",
    className: "border-teal/47 bg-teal/10 text-teal",
  },
  overdue: {
    label: "OVERDUE",
    className: "border-pink/47 bg-pink/10 text-pink",
  },
  dispatched: {
    label: "DISPATCHED",
    className: "border-vehicle-blue/28 bg-vehicle-blue/10 text-vehicle-blue",
  },
  away: {
    label: "AWAY",
    className: "border-secondary/47 bg-secondary/10 text-secondary",
  },
};

type VehicleStatusBadgeProps = {
  status: VehicleStatus;
};

export function VehicleStatusBadge({ status }: VehicleStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`font-roboto inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[8px] font-medium tracking-[0.08em] uppercase ${config.className}`}
    >
      <span className="size-1 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
