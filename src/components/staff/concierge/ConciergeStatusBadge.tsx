import type { ConciergeRequestStatus } from "./types";

const badgeClass: Record<ConciergeRequestStatus, string> = {
  urgent: "border-pink/35 bg-pink/8 text-pink",
  review: "border-primary/35 bg-primary/8 text-primary",
  active: "border-teal/35 bg-teal/8 text-teal",
  pending: "border-secondary/25 bg-secondary/8 text-secondary",
  done: "border-teal/35 text-teal",
};

const labelMap: Record<ConciergeRequestStatus, string> = {
  urgent: "Urgent",
  review: "Review",
  active: "Active",
  pending: "Pending",
  done: "Done",
};

type ConciergeStatusBadgeProps = {
  status: ConciergeRequestStatus;
};

export function ConciergeStatusBadge({ status }: ConciergeStatusBadgeProps) {
  return (
    <span
      className={`font-roboto inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[8px] font-medium tracking-[0.08em] uppercase ${badgeClass[status]}`}
    >
      {(status === "active" || status === "urgent") && (
        <span className="size-1.5 rounded-full bg-current" />
      )}
      {labelMap[status]}
    </span>
  );
}
