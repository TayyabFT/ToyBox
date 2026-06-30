import { StatusPill } from "@/components/staff/overview/StatusPill";
import { VehicleListItemRow } from "@/components/staff/vehicles/VehicleListItemRow";
import { mapInspectionQueueItem } from "./mapInspectionQueueItem";
import type { InspectionQueueItem } from "./types";

type InspectionQueuePanelProps = {
  items: InspectionQueueItem[];
  selectedId: string;
  pendingCount: number;
  onSelect: (id: string) => void;
};

export function InspectionQueuePanel({
  items,
  selectedId,
  pendingCount,
  onSelect,
}: InspectionQueuePanelProps) {
  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-accent/10 bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-accent/6 px-5 py-4">
        <h2 className="font-roboto text-sm uppercase text-secondary">
          Inspection Queue
        </h2>
        <StatusPill label={`${pendingCount} Pending`} tone="gold" />
      </div>

      <div className="Custom__Scrollbar max-h-[720px] overflow-y-auto">
        {items.map((item) => (
          <VehicleListItemRow
            key={item.id}
            vehicle={mapInspectionQueueItem(item)}
            selected={item.id === selectedId}
            trailingText={item.time}
            onSelect={() => onSelect(item.id)}
          />
        ))}
      </div>
    </section>
  );
}
