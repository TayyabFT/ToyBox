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
    <div className="flex shrink-0 items-center rounded-full bg-[#11100C] border border-[#D4A8471A] p-1.5">
      {filters.map((filter) => {
        const isActive = active === filter.id;

        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onChange(filter.id)}
            className={`font-roboto cursor-pointer rounded-full px-4 py-[7px] text-[11px] font-bold tracking-[0.12em] uppercase transition-colors ${
              isActive
                ? "bg-[#D4A8471F] text-[#D4A847]"
                : "text-[#7D7460] hover:text-[#D4A847]"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
