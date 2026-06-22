import {
  ActionCamera,
  ActivityCheck,
  ConciergeGear,
  StatCarIcon,
} from "@/components/common/Svgs";
import {
  ConciergeStatusBadge,
  getConciergeTimeClass,
} from "./ConciergeStatusBadge";
import { conciergeRowMetaClass, conciergeRowTitleClass } from "./panelStyles";
import type { ConciergeOpenRequest, ConciergeRequestIcon } from "./types";

const iconBoxClass: Record<
  ConciergeOpenRequest["status"],
  { box: string; color: string }
> = {
  urgent: {
    box: "border-[#F87171]/20 bg-[#2D1616]",
    color: "#F87171",
  },
  review: {
    box: "border-[#C5A059]/20 bg-[#2A2418]",
    color: "#C5A059",
  },
  active: {
    box: "border-[#7DBFA0]/20 bg-[#162D24]",
    color: "#7DBFA0",
  },
  pending: {
    box: "border-[#6B8FA8]/20 bg-[#1A1F24]",
    color: "#8BB4D4",
  },
  done: {
    box: "border-[#7DBFA0]/20 bg-[#162D24]",
    color: "#7DBFA0",
  },
};

function RequestIcon({
  icon,
  status,
}: {
  icon: ConciergeRequestIcon;
  status: ConciergeOpenRequest["status"];
}) {
  const tone = iconBoxClass[status];
  const boxClass = `flex size-10 shrink-0 items-center justify-center rounded-lg border ${tone.box}`;

  switch (icon) {
    case "car":
      return (
        <span className={boxClass}>
          <StatCarIcon color={tone.color} className="size-4" />
        </span>
      );
    case "camera":
      return (
        <span className={boxClass}>
          <ActionCamera className="size-4 [&_*]:stroke-[#C5A059]" />
        </span>
      );
    case "gear":
      return (
        <span className={boxClass}>
          <ConciergeGear color={tone.color} className="size-4" />
        </span>
      );
    case "check":
      return (
        <span className={boxClass}>
          <ActivityCheck color={tone.color} className="size-4" />
        </span>
      );
  }
}

type OpenRequestRowProps = {
  request: ConciergeOpenRequest;
  selected?: boolean;
  onSelect?: () => void;
};

export function OpenRequestRow({
  request,
  selected = false,
  onSelect,
}: OpenRequestRowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full cursor-pointer items-center gap-3.5 border-b border-[#1E1A14] px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-[#16140F]/50 ${
        selected
          ? "border-l-2 border-l-[#C5A059] bg-[#16140F]/70 pl-[18px]"
          : "border-l-2 border-l-transparent"
      }`}
    >
      <RequestIcon icon={request.icon} status={request.status} />

      <div className="min-w-0 flex-1 space-y-1">
        <p className={conciergeRowTitleClass}>{request.title}</p>
        <p className={conciergeRowMetaClass}>
          {request.member} · {request.tier}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span
          className={`font-roboto text-[11px] tracking-[0.04em] ${getConciergeTimeClass(request.status)}`}
        >
          {request.timeLabel}
        </span>
        <ConciergeStatusBadge status={request.status} />
      </div>
    </button>
  );
}
