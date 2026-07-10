"use client";

import { useEffect, useState } from "react";
import { StatusPill } from "@/components/staff/overview/StatusPill";
import { VehicleListItemRow } from "@/components/staff/vehicles/VehicleListItemRow";
import { mapInspectionQueueItem } from "./mapInspectionQueueItem";
import type { InspectionQueueItem } from "./types";

const PREVIEW_COUNT = 8;

type InspectionQueuePanelProps = {
  items: InspectionQueueItem[];
  selectedId: string;
  pendingCount: number;
  loading?: boolean;
  onSelect: (id: string) => void;
};

export function InspectionQueuePanel({
  items,
  selectedId,
  pendingCount,
  loading = false,
  onSelect,
}: InspectionQueuePanelProps) {
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setShowAll(false);
  }, [items]);

  const visibleItems = showAll ? items : items.slice(0, PREVIEW_COUNT);
  const hasMore = items.length > PREVIEW_COUNT && !showAll;

  return (
    <section className="flex h-full min-h-[600px] flex-col overflow-hidden rounded-2xl border border-accent/10 bg-card">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-accent/6 px-5 py-4">
        <h2 className="font-roboto text-sm uppercase text-secondary">
          Inspection Queue
        </h2>
        <StatusPill label={`${pendingCount} Pending`} tone="gold" />
      </div>

      <div className="Custom__Scrollbar min-h-0 flex-1 overflow-y-auto">
        {loading && items.length === 0 ? (
          <p className="font-roboto px-5 py-8 text-center text-sm text-secondary">
            Loading inspection queue...
          </p>
        ) : null}

        {!loading && items.length === 0 ? (
          <p className="font-roboto px-5 py-8 text-center text-sm text-secondary">
            No inspections in queue.
          </p>
        ) : null}

        {visibleItems.map((item) => (
          <VehicleListItemRow
            key={item.id}
            vehicle={mapInspectionQueueItem(item)}
            selected={item.id === selectedId}
            trailingText={item.time}
            onSelect={() => onSelect(item.id)}
          />
        ))}
      </div>

      {hasMore ? (
        <div className="flex shrink-0 justify-end border-t border-accent/8 p-4">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="font-roboto cursor-pointer rounded-lg border border-accent/20 bg-surface px-4 py-2 text-[10px] font-semibold tracking-[0.1em] text-primary uppercase transition-colors hover:border-primary/35 hover:bg-accent/8"
          >
            Load more
          </button>
        </div>
      ) : null}
    </section>
  );
}
