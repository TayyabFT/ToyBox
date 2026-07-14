"use client";

import type { EventFilter } from "./types";

const FILTER_TABS: { id: EventFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "drives", label: "Drives" },
  { id: "auctions", label: "Auctions" },
  { id: "dining", label: "Dining" },
  { id: "track", label: "Track" },
  { id: "concours", label: "Concours" },
];

type EventsFilterTabsProps = {
  active: EventFilter;
  onChange: (f: EventFilter) => void;
};

export function EventsFilterTabs({ active, onChange }: EventsFilterTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3.5">
      {FILTER_TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`font-roboto cursor-pointer rounded-full px-5 py-[8px] text-[11px] font-medium tracking-[0.02em] transition-colors duration-250 ${
              isActive
                ? "border-transparent bg-accent text-dark"
                : "border border-accent/25 bg-card text-secondary hover:border-accent/40 hover:text-accent"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
