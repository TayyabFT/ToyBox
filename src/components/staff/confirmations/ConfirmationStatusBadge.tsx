import type { ConfirmationBadgeTone } from "./types";

const badgeClass: Record<ConfirmationBadgeTone, string> = {
  confirmed: "border-teal/35 text-teal",
  pending: "border-accent/28 bg-accent/10 text-accent",
  "in-review": "border-info/28 bg-info/10 text-info",
  awaiting: "border-primary/45 text-primary",
  "sign-off": "border-primary/55 text-primary",
  done: "border-teal/35 bg-teal/8 text-teal",
};

type ConfirmationStatusBadgeProps = {
  label: string;
  tone: ConfirmationBadgeTone;
  showDot?: boolean;
};

const labelMap: Record<ConfirmationBadgeTone, string> = {
  confirmed: "Confirmed",
  pending: "Pending",
  "in-review": "In Review",
  awaiting: "Awaiting Confirm",
  "sign-off": "Sign-Off Needed",
  done: "Done",
};

export function ConfirmationStatusBadge({
  label,
  tone,
  showDot = false,
}: ConfirmationStatusBadgeProps) {
  return (
    <span
      className={`font-roboto inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] uppercase ${badgeClass[tone]}`}
    >
      {showDot && <span className="size-1.5 rounded-full bg-current" />}
      {label || labelMap[tone]}
    </span>
  );
}
