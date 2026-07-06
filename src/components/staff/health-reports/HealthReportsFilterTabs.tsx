"use client";

import type { HealthFilter } from "./types";

const DEFAULT_FILTERS: { id: HealthFilter; label: string }[] = [
  { id: "all", label: "All Vehicles" },
  { id: "critical", label: "Critical" },
  { id: "due-service", label: "Due Service" },
  { id: "healthy", label: "Healthy" },
];

type HealthReportsFilterTabsProps = {
  active: HealthFilter;
  onChange: (filter: HealthFilter) => void;
  tabs?: { id: HealthFilter; label: string }[];
};

export function HealthReportsFilterTabs({
  active,
  onChange,
  tabs = DEFAULT_FILTERS,
}: HealthReportsFilterTabsProps) {
  return (
    <div className="flex shrink-0 items-center rounded-full border border-accent/10 bg-card p-1.5">
      {tabs.map((filter) => {
        const isActive = active === filter.id;

        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onChange(filter.id)}
            className={`font-roboto cursor-pointer rounded-full px-4 py-[7px] text-[11px] font-bold tracking-[0.12em] uppercase transition-colors ${
              isActive
                ? "border border-primary/35 bg-primary/10 text-primary"
                : "border border-transparent text-secondary hover:text-primary"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
