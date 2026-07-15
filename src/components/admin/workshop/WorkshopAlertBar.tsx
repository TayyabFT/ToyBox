"use client";

import { AlertTriangle } from "@/components/common/Svgs";

export type WorkshopAlertItem = {
  highlight: string;
  detail: string;
};

type WorkshopAlertBarProps = {
  count: number;
  items: WorkshopAlertItem[];
  actionLabel?: string;
  onReviewAll?: () => void;
};

export function WorkshopAlertBar({
  count,
  items,
  actionLabel = "Review all",
  onReviewAll,
}: WorkshopAlertBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-pink/20 bg-[var(--critical-banner)] px-5 py-3.5">
      <div className="flex shrink-0 items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-lg border border-pink/30 bg-pink/8">
          <AlertTriangle color="var(--pink)" className="size-3.5" />
        </span>
        <span className="font-roboto text-[10px] font-semibold tracking-[0.14em] text-pink uppercase">
          {count} critical
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-8 gap-y-2">
        {items.map((item) => (
          <p
            key={`${item.highlight}-${item.detail}`}
            className="font-roboto text-[11px] leading-snug tracking-[0.02em]"
          >
            <span className="font-medium text-pink">{item.highlight}</span>{" "}
            <span className="text-section-label">{item.detail}</span>
          </p>
        ))}
      </div>

      <button
        type="button"
        onClick={onReviewAll}
        className="font-roboto shrink-0 cursor-pointer rounded-full border border-pink/35 bg-transparent px-4 py-1.5 text-[10px] font-semibold tracking-[0.12em] text-pink uppercase transition-colors hover:border-pink/55 hover:bg-pink/8"
      >
        {actionLabel} →
      </button>
    </div>
  );
}
