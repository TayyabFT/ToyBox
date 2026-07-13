"use client";

import type { ClubhouseZoneFilter, ClubhouseZoneTab } from "./types";

type ClubhouseFilterTabsProps = {
  active: ClubhouseZoneFilter;
  tabs: ClubhouseZoneTab[];
  onChange: (filter: ClubhouseZoneFilter) => void;
};

export function ClubhouseFilterTabs({
  active,
  tabs,
  onChange,
}: ClubhouseFilterTabsProps) {
  return (
    <div className="flex shrink-0 items-center rounded-full border border-accent/10 bg-surface p-1.5">
      {tabs.map((filter) => {
        const isActive = active === filter.id;

        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onChange(filter.id)}
            className={`font-roboto cursor-pointer rounded-full px-4 py-[7px] text-[11px] font-bold tracking-[0.12em] uppercase transition-colors ${
              isActive
                ? "bg-accent/12 text-accent"
                : "text-secondary hover:text-accent"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
