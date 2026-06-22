import type { JobStatusTone } from "./types";

const toneClass: Record<JobStatusTone, string> = {
  urgent: "border-pink/35 bg-pink/10 text-pink",
  assigned: "border-primary/35 bg-primary/8 text-primary",
  overdue: "border-pink/35 bg-pink/10 text-pink",
  "in-progress": "border-teal/35 bg-teal/8 text-teal",
  pending: "border-secondary/30 bg-secondary/8 text-secondary",
  active: "border-teal/35 bg-teal/8 text-teal",
};

type JobStatusBadgeProps = {
  label: string;
  tone: JobStatusTone;
};

export function JobStatusBadge({ label, tone }: JobStatusBadgeProps) {
  return (
    <span
      className={`font-roboto inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[8px] font-medium tracking-[0.08em] uppercase ${toneClass[tone]}`}
    >
      {label}
    </span>
  );
}
