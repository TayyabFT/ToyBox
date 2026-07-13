const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  available: {
    label: "AVAILABLE",
    className: "border-teal/47 bg-teal/10 text-teal",
  },
  occupied: {
    label: "OCCUPIED",
    className: "border-pink/47 bg-pink/10 text-pink",
  },
  maintenance: {
    label: "MAINTENANCE",
    className: "border-primary/45 bg-primary/10 text-primary",
  },
  reserved: {
    label: "RESERVED",
    className: "border-vehicle-blue/28 bg-vehicle-blue/10 text-vehicle-blue",
  },
};

type ParkingSlotStatusBadgeProps = {
  status: string;
  label?: string;
};

export function ParkingSlotStatusBadge({
  status,
  label,
}: ParkingSlotStatusBadgeProps) {
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
