"use client";

import { StaffShiftMeta } from "@/components/staff/StaffShiftMeta";
import { OpUpdatesFilterTabs } from "./OpUpdatesFilterTabs";
import type { OpUpdateFilter, OpUpdateTab } from "./types";

type OpUpdatesGreetingProps = {
  activeFilter: OpUpdateFilter;
  tabs: OpUpdateTab[];
  onFilterChange: (filter: OpUpdateFilter) => void;
};

export function OpUpdatesGreeting({
  activeFilter,
  tabs,
  onFilterChange,
}: OpUpdatesGreetingProps) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <StaffShiftMeta split />
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
