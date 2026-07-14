import type { ClubhouseReservationStatus } from "./types";

const statusToneClass: Record<
  ClubhouseReservationStatus,
  { pill: string; dot: string }
> = {
  confirmed: {
    pill: "border-teal/25 bg-teal/8 text-teal",
    dot: "bg-teal",
  },
  prep: {
    pill: "border-accent/25 bg-accent/8 text-accent",
    dot: "bg-accent",
  },
  pending: {
    pill: "border-primary/25 bg-primary/8 text-primary",
    dot: "bg-primary",
  },
};

const statusLabel: Record<ClubhouseReservationStatus, string> = {
  confirmed: "Confirmed",
  prep: "Prep",
  pending: "Pending",
};

type ClubhouseReservationStatusBadgeProps = {
  status: ClubhouseReservationStatus;
  label?: string;
};

export function ClubhouseReservationStatusBadge({
  status,
  label,
}: ClubhouseReservationStatusBadgeProps) {
  const styles = statusToneClass[status];

  return (
    <span
      className={`font-roboto inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-semibold tracking-[0.1em] uppercase ${styles.pill}`}
    >
      <span className={`size-1.5 rounded-full ${styles.dot}`} />
      {label ?? statusLabel[status]}
    </span>
  );
}
