import { ParkingSlotListItemRow } from "./ParkingSlotListItemRow";
import type { ParkingSlotListItem } from "./types";

type ParkingSlotListPanelProps = {
  slots: ParkingSlotListItem[];
  selectedId: string;
  loading: boolean;
  onSelect: (id: string) => void;
};

export function ParkingSlotListPanel({
  slots,
  selectedId,
  loading,
  onSelect,
}: ParkingSlotListPanelProps) {
  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-accent/10 bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-accent/6 px-5 py-4">
        <h2 className="font-copperplate text-[10px] tracking-[0.12em] text-secondary uppercase">
          Parking Slots
        </h2>
        <span className="font-roboto flex items-center gap-1.5 text-[9px] font-medium tracking-[0.1em] text-teal uppercase">
          <span className="size-1.5 rounded-full bg-teal shadow-[var(--shadow-glow-teal-strong)]" />
          Live
        </span>
      </div>

      <div className="Custom__Scrollbar max-h-[520px] overflow-y-auto">
        {loading && (
          <p className="font-roboto px-5 py-8 text-center text-sm text-secondary">
            Loading parking slots...
          </p>
        )}

        {!loading && slots.length === 0 && (
          <p className="font-roboto px-5 py-8 text-center text-sm text-secondary">
            No parking slots available
          </p>
        )}

        {!loading &&
          slots.map((slot) => (
            <ParkingSlotListItemRow
              key={slot.id}
              slot={slot}
              selected={slot.id === selectedId}
              onSelect={() => onSelect(slot.id)}
            />
          ))}
      </div>
    </section>
  );
}
