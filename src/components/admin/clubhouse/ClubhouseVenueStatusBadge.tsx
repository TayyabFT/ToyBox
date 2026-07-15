import type { ClubhouseVenueStatusTone } from "./types";

const statusToneClass: Record<
  ClubhouseVenueStatusTone,
  { pill: string; dot: string }
> = {
  active: {
    pill: "border-teal/25 bg-teal/8 text-teal",
    dot: "bg-teal",
  },
  quiet: {
    pill: "border-[var(--tag-purple)]/30 bg-[var(--tag-purple)]/10 text-[var(--tag-purple)]",
    dot: "bg-[var(--tag-purple)]",
  },
  prep: {
    pill: "border-accent/25 bg-accent/8 text-accent",
    dot: "bg-accent",
  },
};

type ClubhouseVenueStatusBadgeProps = {
  label: string;
  tone: ClubhouseVenueStatusTone;
};

export function ClubhouseVenueStatusBadge({
  label,
  tone,
}: ClubhouseVenueStatusBadgeProps) {
  const styles = statusToneClass[tone];

  return (
    <span
      className={`font-roboto inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-semibold tracking-[0.1em] uppercase ${styles.pill}`}
    >
      <span className={`size-1.5 rounded-full ${styles.dot}`} />
      {label}
    </span>
  );
}
