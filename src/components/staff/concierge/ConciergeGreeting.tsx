import { StaffShiftMeta } from "@/components/staff/StaffShiftMeta";
import { ConciergeFilterTabs } from "./ConciergeFilterTabs";
import type { ConciergeFilter } from "./types";

type ConciergeGreetingProps = {
  activeFilter: ConciergeFilter;
  onFilterChange: (filter: ConciergeFilter) => void;
};

export function ConciergeGreeting({
  activeFilter,
  onFilterChange,
}: ConciergeGreetingProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <StaffShiftMeta />
        <h1 className="font-copperplate text-[32px] leading-tight">
          <span className="text-foreground">Concierge </span>
          <span className="text-primary">Desk</span>
        </h1>
      </div>

      <ConciergeFilterTabs active={activeFilter} onChange={onFilterChange} />
    </div>
  );
}
