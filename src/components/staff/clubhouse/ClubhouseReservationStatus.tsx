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
  prep: {
    pill: "border-accent/25 bg-accent/8 text-accent",
    dot: "bg-accent",
    label: "Prep",
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
