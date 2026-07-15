import { AlertTriangle } from "@/components/common/Svgs";
import type { ConciergeAlert } from "./types";

type ConciergeAlertBarProps = {
  alert: ConciergeAlert;
  onHandle?: () => void;
};

export function ConciergeAlertBar({ alert, onHandle }: ConciergeAlertBarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-accent/12 bg-[var(--critical-banner)] px-5 py-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-start gap-3.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-pink/20 bg-pink/10 text-pink">
          <AlertTriangle color="currentColor" className="size-4" />
        </span>

        <div className="min-w-0 space-y-1">
          <p className="font-roboto text-[14px] font-semibold tracking-[0.02em] text-foreground">
            {alert.highlight}
          </p>
          <p className="font-roboto text-[12px] leading-relaxed tracking-[0.03em] text-section-label">
            {alert.detail}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onHandle}
        className="font-roboto shrink-0 cursor-pointer self-start rounded-full border border-pink/35 bg-transparent px-5 py-2.5 text-[11px] font-semibold tracking-[0.12em] text-pink uppercase transition-colors hover:border-pink/55 hover:bg-pink/8 sm:self-center"
      >
        → Handle Now
      </button>
    </div>
  );
}
