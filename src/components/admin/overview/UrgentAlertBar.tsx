"use client";

import { AlertTriangle } from "@/components/common/Svgs";

export type UrgentAlertItem = {
  highlight: string;
  detail: string;
};

type UrgentAlertBarProps = {
  count: number;
  items: UrgentAlertItem[];
  actionLabel?: string;
  onReviewAll?: () => void;
};

export function UrgentAlertBar({
  count,
  items,
  actionLabel = "Review all",
  onReviewAll,
}: UrgentAlertBarProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-pink/20 bg-[var(--critical-banner)] px-6 py-4">
      <div className="flex shrink-0 items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-lg border border-pink/30 bg-pink/8 text-pink">
          <AlertTriangle color="currentColor" className="size-4" />
        </span>
        <span className="font-roboto text-[11px] font-semibold tracking-[0.12em] text-pink uppercase">
          {count} critical
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
        {items.map((item, index) => (
          <div
            key={`${item.highlight}-${item.detail}`}
            className="flex items-center gap-3"
          >
            {index > 0 && (
              <span aria-hidden className="font-roboto text-[12px] text-secondary/50">
                |
              </span>
            )}
            <p className="font-roboto text-[12px] tracking-[0.03em] whitespace-nowrap">
              <span className="text-pink">{item.highlight}</span>{" "}
              <span className="text-foreground">{item.detail}</span>
            </p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onReviewAll}
        className="font-roboto shrink-0 cursor-pointer rounded-full border border-pink/35 bg-transparent px-4 py-2 text-[10px] font-semibold tracking-[0.12em] text-pink uppercase transition-colors hover:border-pink/55 hover:bg-pink/8"
      >
        {actionLabel} →
      </button>
    </div>
  );
}
