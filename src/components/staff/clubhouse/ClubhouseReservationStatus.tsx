import type { ClubhouseReservationStatus } from "./types";

const statusToneClass: Record<
  ClubhouseReservationStatus,
  { pill: string; dot: string; label: string }
> = {
  confirmed: {
    pill: "border-teal/25 bg-teal/8 text-teal",
    dot: "bg-teal",
    label: "Confirmed",
  },
  pending: {
    pill: "border-primary/25 bg-primary/8 text-primary",
    dot: "bg-primary",
    label: "Pending",
  },
  prep: {
    pill: "border-accent/25 bg-accent/8 text-accent",
    dot: "bg-accent",
    label: "Prep",
  },
  cancelled: {
    pill: "border-secondary/25 bg-secondary/8 text-secondary",
    dot: "bg-secondary",
    label: "Cancelled",
  },
};

type ClubhouseReservationStatusProps = {
  status: ClubhouseReservationStatus;
  detail: string;
};

export function ClubhouseReservationStatusBadge({
  status,
  detail,
}: ClubhouseReservationStatusProps) {
  const styles = statusToneClass[status];

  return (
    <div className="space-y-1.5">
      <span
        className={`font-roboto inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-semibold tracking-[0.1em] uppercase ${styles.pill}`}
      >
        <span className={`size-1.5 rounded-full ${styles.dot}`} />
        {styles.label}
      </span>
      <p className="font-roboto text-[10px] tracking-[0.04em] text-secondary">
        {detail}
      </p>
    </div>
  );
}
