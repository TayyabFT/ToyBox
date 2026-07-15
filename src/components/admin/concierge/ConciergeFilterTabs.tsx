"use client";

import type { ConciergeFilter } from "./types";

const filters: { id: ConciergeFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "urgent", label: "Urgent" },
  { id: "my-requests", label: "My Requests" },
  { id: "resolved", label: "Resolved" },
];

type ConciergeFilterTabsProps = {
  active: ConciergeFilter;
  onChange: (filter: ConciergeFilter) => void;
};

export function ConciergeFilterTabs({
  active,
  onChange,
}: ConciergeFilterTabsProps) {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-0.5 rounded-full border border-accent/12 bg-card p-1">
      {filters.map((filter) => {
        const isActive = active === filter.id;

        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onChange(filter.id)}
            className={`font-roboto cursor-pointer rounded-full px-4 py-2.5 text-[11px] font-medium tracking-[0.12em] uppercase transition-colors ${
              isActive
                ? "bg-accent/20 text-foreground"
                : "text-section-label/80 hover:text-accent"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
