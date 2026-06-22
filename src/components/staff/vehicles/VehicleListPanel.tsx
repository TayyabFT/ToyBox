import { VehicleListItemRow } from "./VehicleListItemRow";
import type { VehicleListItem } from "./types";

type VehicleListPanelProps = {
  vehicles: VehicleListItem[];
  selectedId: string;
  loading: boolean;
  onSelect: (id: string) => void;
};

export function VehicleListPanel({
  vehicles,
  selectedId,
  loading,
  onSelect,
}: VehicleListPanelProps) {
  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-[#D4A8471A] bg-[#11100C]">
      <div className="flex items-center justify-between gap-3 border-b border-[#D4A8470F] px-5 py-4">
        <h2 className="font-copperplate text-[10px] tracking-[0.12em] text-secondary uppercase">
          My Assigned Vehicles · Wing A
        </h2>
        <span className="font-roboto flex items-center gap-1.5 text-[9px] font-medium tracking-[0.1em] text-teal uppercase">
          <span className="size-1.5 rounded-full bg-teal shadow-[0_0_6px_rgba(125,191,160,0.6)]" />
          Live
        </span>
      </div>

      <div className="Custom__Scrollbar max-h-[720px] overflow-y-auto">
        {loading && (
          <p className="font-roboto px-5 py-8 text-center text-sm text-secondary">
            Loading vehicles...
          </p>
        )}

        {!loading && vehicles.length === 0 && (
          <p className="font-roboto px-5 py-8 text-center text-sm text-secondary">
            No inventory vehicles available
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
