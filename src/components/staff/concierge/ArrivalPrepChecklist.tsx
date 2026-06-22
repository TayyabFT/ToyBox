"use client";

import { ActivityCheck, Edit } from "@/components/common/Svgs";
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
    <div className="space-y-4">
      <h3 className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
        Arrival Prep Checklist
      </h3>

      <div className="space-y-2.5">
        {items.length === 0 ? (
          <p className="font-roboto text-[11px] tracking-[0.03em] text-secondary">
            No checklist items yet
          </p>
        ) : (
          items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onToggle?.(item.id)}
            className="flex w-full cursor-pointer items-center gap-3 text-left"
          >
            <span
              className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                item.completed
                  ? "border-teal/40 bg-teal/10"
                  : "border-secondary/30 bg-transparent"
              }`}
            >
              {item.completed && <ActivityCheck color="var(--teal)" />}
            </span>
            <span
              className={`font-roboto text-[11px] tracking-[0.03em] ${
                item.completed
                  ? "text-secondary line-through"
                  : "text-foreground"
              }`}
            >
              {item.label}
            </span>
          </button>
          ))
        )}
      </div>

      <button
        type="button"
        className="font-roboto flex cursor-pointer items-center gap-2 rounded-lg border border-[#D4A8471A] bg-surface px-4 py-2.5 text-[10px] font-medium tracking-[0.1em] text-primary uppercase transition-colors hover:border-primary/35 hover:bg-accent/8"
      >
        <Edit active />
        Add Note
      </button>
    </div>
  );
}
