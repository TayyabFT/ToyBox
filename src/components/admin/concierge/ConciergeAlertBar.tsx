import { AlertTriangle } from "@/components/common/Svgs";
import type { ConciergeAlert } from "./types";

type ConciergeAlertBarProps = {
  alert: ConciergeAlert;
  onHandle?: () => void;
};

export function ConciergeAlertBar({ alert, onHandle }: ConciergeAlertBarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#2A2620] bg-[#141210] px-5 py-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-start gap-3.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#C98B8B]/20 bg-[#1A1414]">
          <AlertTriangle color="#C98B8B" className="size-4" />
        </span>

        <div className="min-w-0 space-y-1">
          <p className="font-roboto text-[14px] font-semibold tracking-[0.02em] text-[#F2EAD5]">
            {alert.highlight}
          </p>
          <p className="font-roboto text-[12px] leading-relaxed tracking-[0.03em] text-[#8A8378]">
            {alert.detail}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onHandle}
        className="font-roboto shrink-0 cursor-pointer self-start rounded-full border border-[#C98B8B]/35 bg-transparent px-5 py-2.5 text-[11px] font-semibold tracking-[0.12em] text-[#C98B8B] uppercase transition-colors hover:border-[#C98B8B]/55 hover:bg-[#C98B8B]/6 sm:self-center"
      >
        → Handle Now
      </button>
    </div>
  );
}
