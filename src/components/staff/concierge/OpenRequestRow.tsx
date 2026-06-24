import {
  ActivityCheck,
  Car,
  ConciergeGear,
  FileReport,
} from "@/components/common/Svgs";
import { ConciergeStatusBadge } from "./ConciergeStatusBadge";
import type { ConciergeOpenRequest, ConciergeRequestIcon } from "./types";

function RequestIcon({ icon }: { icon: ConciergeRequestIcon }) {
  const boxClass =
    "flex size-10 shrink-0 items-center justify-center rounded-lg border border-primary/22 bg-primary/[0.06] [&_svg]:size-[16px]";

  switch (icon) {
    case "car":
      return (
        <span className={`${boxClass} [&_path]:stroke-primary`}>
          <Car />
        </span>
      );
    case "clipboard":
      return (
        <span className={boxClass}>
          <FileReport color="var(--primary)" />
        </span>
      );
    case "gear":
      return (
        <span className={boxClass}>
          <ConciergeGear color="var(--primary)" />
        </span>
      );
    case "check":
      return (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-teal/22 bg-teal/[0.06]">
          <ActivityCheck color="var(--teal)" />
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
      className={`flex w-full cursor-pointer items-center gap-3 border-b border-accent/6 px-4 py-3.5 text-left transition-colors last:border-b-0 hover:bg-accent/[0.03] ${
        selected
          ? "border-l-2 border-l-primary bg-accent/[0.04] pl-[14px]"
          : "border-l-2 border-l-transparent"
      }`}
    >
      <RequestIcon icon={request.icon} />

      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="font-roboto truncate text-[14px] font-medium tracking-[0.02em] text-foreground">
          {request.title}
        </p>
        <p className="font-roboto truncate text-[11px] tracking-[0.1em] text-secondary uppercase">
          {request.member} · {request.tier}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="font-roboto text-[10px] tracking-[0.06em] text-secondary">
          {request.timeLabel}
        </span>
        <ConciergeStatusBadge status={request.status} />
      </div>
    </button>
  );
}
