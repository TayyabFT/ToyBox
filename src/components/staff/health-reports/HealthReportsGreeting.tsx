"use client";

import type { HealthFilter } from "./types";
import { HealthReportsFilterTabs } from "./HealthReportsFilterTabs";

type HealthReportsGreetingProps = {
  activeFilter: HealthFilter;
  onFilterChange: (filter: HealthFilter) => void;
};

export function HealthReportsGreeting({
  activeFilter,
  onFilterChange,
}: HealthReportsGreetingProps) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <p className="font-roboto text-xs tracking-[0.14em] uppercase">
          <span className="text-foreground">Saturday, 17 July 2026 · </span>
          <span className="text-primary">Morning Shift</span>
        </p>
        <h1 className="font-copperplate text-[32px] leading-tight">
          <span className="text-foreground">Health </span>
          <span className="text-primary">Reports</span>
        </h1>
      </div>

      <HealthReportsFilterTabs
        active={activeFilter}
        onChange={onFilterChange}
      />
    </div>
  );
}
