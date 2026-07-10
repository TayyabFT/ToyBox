import { ConciergeStatusBadge } from "./ConciergeStatusBadge";
import type { ConciergeOpenRequest } from "./types";

function getUserInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
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
      className={`flex w-full cursor-pointer items-center gap-3 border-b border-accent/6 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-accent/[0.03] ${
        selected
          ? "border-l-2 border-l-primary bg-accent/[0.04] pl-[14px]"
          : "border-l-2 border-l-transparent"
      }`}
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#F0C566] to-[#8B6F2A] font-copperplate text-[15px] tracking-[0.04em] text-[#0A0806]">
        {getUserInitial(request.member)}
      </span>

      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="font-roboto truncate text-[14px] font-medium tracking-[0.02em] text-foreground">
          {request.member}
        </p>
        <p className="font-roboto truncate text-[11px] tracking-[0.02em] text-secondary">
          {request.title}
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
