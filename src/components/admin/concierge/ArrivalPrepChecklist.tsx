"use client";

import { ActivityCheck } from "@/components/common/Svgs";
import { conciergeSectionLabelClass } from "./panelStyles";
import type { ConciergeChecklistItem } from "./types";

type ArrivalPrepChecklistProps = {
  items: ConciergeChecklistItem[];
  onToggle?: (id: string) => void;
};

export function ArrivalPrepChecklist({
  items,
  onToggle,
}: ArrivalPrepChecklistProps) {
  return (
    <div className="space-y-5">
      <h3 className={conciergeSectionLabelClass}>Arrival Prep Checklist</h3>

      <div className="divide-y divide-accent/8 border-y border-accent/8">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onToggle?.(item.id)}
            className="flex w-full cursor-pointer items-center gap-3.5 py-4 text-left first:pt-4 last:pb-4"
          >
            <span
              className={`flex size-[18px] shrink-0 items-center justify-center rounded-[4px] border ${
                item.completed
                  ? "border-teal/60 bg-teal/10 text-teal"
                  : "border-accent/40 bg-transparent"
              }`}
            >
              {item.completed && (
                <ActivityCheck color="currentColor" className="size-3" />
              )}
            </span>
            <span
              className={`font-roboto text-[13px] leading-snug tracking-[0.02em] ${
                item.completed
                  ? "text-secondary/80 line-through"
                  : "text-foreground-soft"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
