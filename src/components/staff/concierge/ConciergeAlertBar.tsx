import { AlertTriangle, ChevronRight } from "@/components/common/Svgs";
import type { ConciergeAlert } from "./types";

type ConciergeAlertBarProps = {
  alert: ConciergeAlert;
  onHandle?: () => void;
};

export function ConciergeAlertBar({ alert, onHandle }: ConciergeAlertBarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#D4A8471A] bg-card px-5 py-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-pink/28 bg-pink/[0.06]">
          <AlertTriangle color="var(--pink)" className="size-[18px]" />
        </span>

        <div className="min-w-0 space-y-1">
          <p className="font-roboto text-[13px] font-medium tracking-[0.02em] text-foreground">
            {alert.highlight}
          </p>
          <p className="font-roboto text-[11px] tracking-[0.04em] text-secondary">
            {alert.detail}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onHandle}
        className="font-roboto flex shrink-0 cursor-pointer items-center gap-2 self-start rounded-lg border border-[#D4A8471A] bg-surface px-4 py-2.5 text-[10px] font-semibold tracking-[0.12em] text-primary uppercase transition-colors hover:border-primary/40 hover:bg-accent/8 sm:self-center"
      >
        Handle Now
        <ChevronRight className="size-3 [&_*]:stroke-primary" />
      </button>
    </div>
  );
}
