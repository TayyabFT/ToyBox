import type { ConciergeRequestStatus } from "./types";

const badgeClass: Record<ConciergeRequestStatus, string> = {
  urgent: "border-pink/25 bg-pink/10 text-pink",
  review: "border-accent/25 bg-accent/10 text-accent",
  active: "border-teal/25 bg-teal/10 text-teal",
  pending: "border-secondary/25 bg-elevated text-section-label",
  done: "border-teal/25 bg-teal/10 text-teal",
};

const labelMap: Record<ConciergeRequestStatus, string> = {
  urgent: "Urgent",
  review: "Review",
  active: "Active",
  pending: "Pending",
  done: "Done",
};

const timeClass: Record<ConciergeRequestStatus, string> = {
  urgent: "text-pink",
  review: "text-section-label",
  active: "text-section-label",
  pending: "text-section-label",
  done: "text-section-label",
};

type ConciergeStatusBadgeProps = {
  status: ConciergeRequestStatus;
};

export function ConciergeStatusBadge({ status }: ConciergeStatusBadgeProps) {
  return (
    <span
      className={`font-roboto inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-semibold tracking-[0.08em] uppercase ${badgeClass[status]}`}
    >
      {status === "active" && (
        <span className="size-1.5 rounded-full bg-teal shadow-[var(--shadow-glow-teal-strong)]" />
      )}
      {labelMap[status]}
    </span>
  );
}

export function getConciergeTimeClass(status: ConciergeRequestStatus): string {
  return timeClass[status];
}
