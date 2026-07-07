"use client";

import { OpUpdatesFilterTabs } from "./OpUpdatesFilterTabs";
import type { OpUpdateFilter, OpUpdateHeader, OpUpdateTab } from "./types";

type OpUpdatesGreetingProps = {
  header: OpUpdateHeader;
  activeFilter: OpUpdateFilter;
  tabs: OpUpdateTab[];
  onFilterChange: (filter: OpUpdateFilter) => void;
};

export function OpUpdatesGreeting({
  header,
  activeFilter,
  tabs,
  onFilterChange,
}: OpUpdatesGreetingProps) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <p className="font-roboto text-xs tracking-[0.14em] uppercase">
          <span className="text-foreground">{header.dateLabel} · </span>
          <span className="text-primary">{header.shiftLabel}</span>
        </p>
        <h1 className="font-copperplate text-[32px] leading-tight">
          <span className="text-foreground">Operational </span>
          <span className="text-primary">Updates</span>
        </h1>
      </div>

      <OpUpdatesFilterTabs
        active={activeFilter}
        tabs={tabs}
        onChange={onFilterChange}
      />
    </div>
  );
}
