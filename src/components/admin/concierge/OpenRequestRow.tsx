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
    box: "border-pink/20 bg-pink/10 text-pink",
    color: "currentColor",
  },
  review: {
    box: "border-accent/20 bg-accent/10 text-accent",
    color: "currentColor",
  },
  active: {
    box: "border-teal/20 bg-teal/10 text-teal",
    color: "currentColor",
  },
  pending: {
    box: "border-info/20 bg-info/10 text-info",
    color: "currentColor",
  },
  done: {
    box: "border-teal/20 bg-teal/10 text-teal",
    color: "currentColor",
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
          <ActionCamera className="size-4 [&_*]:stroke-current" />
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
      className={`flex w-full cursor-pointer items-center gap-3.5 border-b border-accent/8 px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-elevated/50 ${
        selected
          ? "border-l-2 border-l-accent bg-elevated/70 pl-[18px]"
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
