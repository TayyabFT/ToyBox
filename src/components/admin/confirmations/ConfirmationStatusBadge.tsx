import type { ConfirmationBadgeTone } from "./types";

const badgeClass: Record<ConfirmationBadgeTone, string> = {
  confirmed: "border-teal/50 bg-transparent text-teal",
  pending: "border-accent/50 bg-transparent text-accent",
  "in-review": "border-info/55 bg-info/10 text-info",
  awaiting: "border-accent/50 bg-transparent text-accent",
  "sign-off": "border-accent/50 bg-transparent text-accent",
  done: "border-teal/55 bg-card text-teal shadow-[var(--shadow-glow-teal)]",
};

const labelMap: Record<ConfirmationBadgeTone, string> = {
  confirmed: "Confirmed",
  pending: "Pending",
  "in-review": "In Review",
  awaiting: "No Vehicle Offer",
  "sign-off": "No Vehicle Offer",
  done: "Done",
};

type ConfirmationStatusBadgeProps = {
  tone: ConfirmationBadgeTone;
  label?: string;
};

export function ConfirmationStatusBadge({ tone, label }: ConfirmationStatusBadgeProps) {
  return (
    <span
      className={`font-roboto inline-flex shrink-0 rounded-full border px-3 py-1 text-[9px] font-bold tracking-[0.1em] uppercase ${badgeClass[tone]}`}
    >
      {label ?? labelMap[tone]}
    </span>
  );
}

export function DoneStatusBadge() {
  return (
    <span className="font-roboto inline-flex shrink-0 items-center gap-1.5 rounded-full border border-teal/55 bg-card px-3 py-1 text-[9px] font-bold tracking-[0.1em] text-teal uppercase shadow-[var(--shadow-glow-teal)]">
      <span className="size-1.5 rounded-full bg-teal shadow-[var(--shadow-glow-teal-strong)]" />
      Done
    </span>
  );
}
