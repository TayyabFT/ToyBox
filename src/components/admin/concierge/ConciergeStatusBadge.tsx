import type { ConciergeRequestStatus } from "./types";

const badgeClass: Record<ConciergeRequestStatus, string> = {
  urgent: "border-[#F87171]/25 bg-[#2D1616] text-[#F87171]",
  review: "border-[#C5A059]/25 bg-[#2A2418] text-[#C5A059]",
  active: "border-[#7DBFA0]/25 bg-[#162D24] text-[#7DBFA0]",
  pending: "border-[#6B665E]/25 bg-[#1A1917] text-[#8A8378]",
  done: "border-[#7DBFA0]/25 bg-[#162D24] text-[#7DBFA0]",
};

const labelMap: Record<ConciergeRequestStatus, string> = {
  urgent: "Urgent",
  review: "Review",
  active: "Active",
  pending: "Pending",
  done: "Done",
};

const timeClass: Record<ConciergeRequestStatus, string> = {
  urgent: "text-[#F87171]",
  review: "text-[#8A8378]",
  active: "text-[#8A8378]",
  pending: "text-[#8A8378]",
  done: "text-[#8A8378]",
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
        <span className="size-1.5 rounded-full bg-[#7DBFA0] shadow-[0_0_6px_#7DBFA0]" />
      )}
      {labelMap[status]}
    </span>
  );
}

export function getConciergeTimeClass(status: ConciergeRequestStatus): string {
  return timeClass[status];
}
