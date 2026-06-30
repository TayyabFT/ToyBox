import type { ReactNode } from "react";
import { VehicleListItemRow } from "./VehicleListItemRow";
import type { VehicleListItem } from "./types";

type VehicleListPanelProps = {
  vehicles: VehicleListItem[];
  selectedId: string;
  loading: boolean;
  onSelect: (id: string) => void;
  title?: string;
  headerRight?: ReactNode;
  emptyMessage?: string;
};

export function VehicleListPanel({
  vehicles,
  selectedId,
  loading,
  onSelect,
  title = "My Assigned Vehicles · Wing A",
  headerRight,
  emptyMessage = "No inventory vehicles available",
}: VehicleListPanelProps) {
  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-accent/10 bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-accent/6 px-5 py-4">
        <h2 className="font-copperplate text-[10px] tracking-[0.12em] text-secondary uppercase">
          {title}
        </h2>
        {headerRight ?? (
          <span className="font-roboto flex items-center gap-1.5 text-[9px] font-medium tracking-[0.1em] text-teal uppercase">
            <span className="size-1.5 rounded-full bg-teal shadow-[var(--shadow-glow-teal-strong)]" />
            Live
          </span>
        )}
      </div>

      <div className="Custom__Scrollbar max-h-[720px] overflow-y-auto">
        {loading && (
          <p className="font-roboto px-5 py-8 text-center text-sm text-secondary">
            Loading vehicles...
          </p>
        )}

        {!loading && vehicles.length === 0 && (
          <p className="font-roboto px-5 py-8 text-center text-sm text-secondary">
            {emptyMessage}
          </p>
        )}

        {!loading &&
          vehicles.map((vehicle) => (
            <VehicleListItemRow
              key={vehicle.id}
              vehicle={vehicle}
              selected={vehicle.id === selectedId}
              onSelect={() => onSelect(vehicle.id)}
            />
          ))}
      </div>
    </section>
  );
}
