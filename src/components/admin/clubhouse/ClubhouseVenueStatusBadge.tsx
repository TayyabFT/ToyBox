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
    pill: "border-[#6B5B9E]/30 bg-[#6B5B9E]/10 text-[#9B8BC8]",
    dot: "bg-[#9B8BC8]",
  },
  prep: {
    pill: "border-primary/25 bg-primary/8 text-primary",
    dot: "bg-primary",
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
