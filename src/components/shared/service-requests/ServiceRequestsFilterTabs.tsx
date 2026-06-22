"use client";

import type { ServiceRequestFilter } from "./types";

const filters: { id: ServiceRequestFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "urgent", label: "Urgent" },
  { id: "transport", label: "Transport" },
  { id: "detailing", label: "Detailing" },
  { id: "maintenance", label: "Maintenance" },
];

type ServiceRequestsFilterTabsProps = {
  active: ServiceRequestFilter;
  onChange: (filter: ServiceRequestFilter) => void;
};

export function ServiceRequestsFilterTabs({
  active,
  onChange,
}: ServiceRequestsFilterTabsProps) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-end gap-1 rounded-full border border-[#D4A8471A] bg-card p-1">
      {filters.map((filter) => {
        const isActive = active === filter.id;

        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onChange(filter.id)}
            className={`font-roboto cursor-pointer rounded-full px-3.5 py-2 text-[9px] font-medium tracking-[0.12em] uppercase transition-colors sm:px-4 ${
              isActive
                ? "bg-gradient-to-r from-[#F0C566] to-[#C9A84C] text-dark"
                : "text-secondary hover:text-foreground"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
