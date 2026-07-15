import type { GarageFilter, GarageFilterKey } from "./types";

type MemberGarageFiltersProps = {
  filters: GarageFilter[];
  activeFilter: GarageFilterKey;
  onFilterChange: (key: GarageFilterKey) => void;
};

export function MemberGarageFilters({
  filters,
  activeFilter,
  onFilterChange,
}: MemberGarageFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.key;

        return (
          <button
            key={filter.key}
            type="button"
            onClick={() => onFilterChange(filter.key)}
            className={`font-roboto cursor-pointer rounded-full px-4 py-2 text-[10px] font-semibold tracking-[0.14em] uppercase transition-[color,border-color] ${
              isActive
                ? "garage-filter-active"
                : "garage-filter-inactive"
            }`}
          >
            {filter.count != null ? `${filter.label} · ${filter.count}` : filter.label}
          </button>
        );
      })}
    </div>
  );
}
