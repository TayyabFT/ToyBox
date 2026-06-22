import type { ConfirmationBadgeTone } from "./types";

const badgeClass: Record<ConfirmationBadgeTone, string> = {
  confirmed: "border-[#7DBFA0]/50 bg-transparent text-[#7DBFA0]",
  pending: "border-[#C5A059]/50 bg-transparent text-[#C5A059]",
  "in-review": "border-[#6B8FA8]/55 bg-[#1C2530] text-[#8BB4D4]",
  awaiting: "border-[#C5A059]/50 bg-transparent text-[#C5A059]",
  "sign-off": "border-[#C5A059]/50 bg-transparent text-[#C5A059]",
  done: "border-[#7DBFA0]/55 bg-[#12110E] text-[#7DBFA0] shadow-[0_0_8px_rgba(125,191,160,0.15)]",
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
    <span className="font-roboto inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#7DBFA0]/55 bg-[#12110E] px-3 py-1 text-[9px] font-bold tracking-[0.1em] text-[#7DBFA0] uppercase shadow-[0_0_8px_rgba(125,191,160,0.2)]">
      <span className="size-1.5 rounded-full bg-[#7DBFA0] shadow-[0_0_6px_#7DBFA0]" />
      Done
    </span>
  );
}
