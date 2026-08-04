"use client";

import { ConciergeFilterTabs } from "@/components/staff/concierge/ConciergeFilterTabs";
import type { ConciergeFilter } from "@/components/staff/concierge/types";

type ConciergeGreetingProps = {
  activeFilter: ConciergeFilter;
  onFilterChange: (filter: ConciergeFilter) => void;
};

export function ConciergeGreeting({
  activeFilter,
  onFilterChange,
}: ConciergeGreetingProps) {
  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <p className="font-roboto text-xs tracking-[0.14em] text-primary uppercase">
          {dateLabel}
        </p>
        <h1 className="font-copperplate text-[28px] leading-tight tracking-[0.03em] sm:text-[36px]">
          <span className="text-foreground">Concierge </span>
          <span className="text-primary">Desk</span>
        </h1>
      </div>

      <ConciergeFilterTabs active={activeFilter} onChange={onFilterChange} />
    </div>
  );
}
