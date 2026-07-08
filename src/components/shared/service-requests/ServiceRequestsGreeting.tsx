import { ServiceRequestsFilterTabs } from "./ServiceRequestsFilterTabs";
import type { ServiceRequestFilter } from "./types";

type ServiceRequestsGreetingProps = {
  activeFilter: ServiceRequestFilter;
  onFilterChange: (filter: ServiceRequestFilter) => void;
};

export function ServiceRequestsGreeting({
  activeFilter,
  onFilterChange,
}: ServiceRequestsGreetingProps) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <p className="font-roboto text-xs tracking-[0.14em] uppercase">
          <span className="text-foreground">Saturday, 17 July 2026 · </span>
          <span className="text-primary">Morning Shift</span>
        </p>
        <h1 className="font-copperplate text-[32px] leading-tight">
          <span className="text-foreground">Service </span>
          <span className="text-primary">Requests</span>
        </h1>
      </div>

      <ServiceRequestsFilterTabs
        active={activeFilter}
        onChange={onFilterChange}
      />
    </div>
  );
}
