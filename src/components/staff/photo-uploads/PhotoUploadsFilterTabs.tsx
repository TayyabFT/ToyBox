"use client";

import type { PhotoUploadFilter, PhotoUploadTab } from "./types";

const DEFAULT_FILTERS: PhotoUploadTab[] = [
  { id: "all", label: "All" },
  { id: "today", label: "Today" },
  { id: "pending-upload", label: "Pending Upload" },
  { id: "inspection", label: "Inspection" },
  { id: "service", label: "Service" },
];

type PhotoUploadsFilterTabsProps = {
  active: PhotoUploadFilter;
  onChange: (filter: PhotoUploadFilter) => void;
  tabs?: PhotoUploadTab[];
};

export function PhotoUploadsFilterTabs({
  active,
  onChange,
  tabs = DEFAULT_FILTERS,
}: PhotoUploadsFilterTabsProps) {
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
