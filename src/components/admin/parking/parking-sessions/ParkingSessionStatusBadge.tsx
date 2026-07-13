const statusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: "PENDING",
    className: "border-primary/45 bg-primary/10 text-primary",
  },
  requested: {
    label: "REQUESTED",
    className: "border-primary/45 bg-primary/10 text-primary",
  },
  queue: {
    label: "QUEUE",
    className: "border-primary/45 bg-primary/10 text-primary",
  },
  accepted: {
    label: "ACCEPTED",
    className: "border-vehicle-blue/28 bg-vehicle-blue/10 text-vehicle-blue",
  },
  confirmed: {
    label: "CONFIRMED",
    className: "border-vehicle-blue/28 bg-vehicle-blue/10 text-vehicle-blue",
  },
  active: {
    label: "ACTIVE",
    className: "border-pink/47 bg-pink/10 text-pink",
  },
  started: {
    label: "STARTED",
    className: "border-pink/47 bg-pink/10 text-pink",
  },
  parking: {
    label: "PARKING",
    className: "border-pink/47 bg-pink/10 text-pink",
  },
  completed: {
    label: "COMPLETED",
    className: "border-teal/47 bg-teal/10 text-teal",
  },
  cancelled: {
    label: "CANCELLED",
    className: "border-secondary/47 bg-secondary/10 text-secondary",
  },
};

type ParkingSessionStatusBadgeProps = {
  status: string;
  label?: string;
};

export function ParkingSessionStatusBadge({
  status,
  label,
}: ParkingSessionStatusBadgeProps) {
  const normalized = status.trim().toLowerCase();
  const config = statusConfig[normalized] ?? {
    label: label?.toUpperCase() || normalized.toUpperCase() || "UNKNOWN",
    className: "border-secondary/47 bg-secondary/10 text-secondary",
  };

  return (
    <span
      className={`font-roboto inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[8px] font-medium tracking-[0.08em] uppercase ${config.className}`}
    >
      <span className="size-1 rounded-full bg-current" />
      {label?.toUpperCase() || config.label}
    </span>
  );
}
