import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import { ParkingSessionListItemRow } from "./ParkingSessionListItemRow";
import type { ParkingSessionListItem } from "./types";

type ParkingSessionListPanelProps = {
  sessions: ParkingSessionListItem[];
  selectedId: string;
  loading: boolean;
  onSelect: (id: string) => void;
};

function ParkingSessionRowSkeleton() {
  return (
    <div className="flex items-center gap-3 border-b border-accent/6 px-5 py-4 last:border-b-0">
      <ShimmerBlock className="size-10 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1 space-y-2">
        <ShimmerBlock className="h-3 w-28" />
        <ShimmerBlock className="h-2.5 w-36" />
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <ShimmerBlock className="h-5 w-16 rounded-full" />
        <ShimmerBlock className="h-2 w-10" />
      </div>
    </div>
  );
}

export function ParkingSessionListPanel({
  sessions,
  selectedId,
  loading,
  onSelect,
}: ParkingSessionListPanelProps) {
  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-accent/10 bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-accent/6 px-5 py-4">
        <h2 className="font-copperplate text-[10px] tracking-[0.12em] text-secondary uppercase">
          Parking Queue
        </h2>
        <span className="font-roboto flex items-center gap-1.5 text-[9px] font-medium tracking-[0.1em] text-teal uppercase">
          <span className="size-1.5 rounded-full bg-teal shadow-[var(--shadow-glow-teal-strong)]" />
          Live
        </span>
      </div>

      <div className="Custom__Scrollbar max-h-[520px] overflow-y-auto">
        {loading && (
          <div aria-busy="true" aria-live="polite">
            {Array.from({ length: 5 }, (_, index) => (
              <ParkingSessionRowSkeleton key={index} />
            ))}
          </div>
        )}

        {!loading && sessions.length === 0 && (
          <p className="font-roboto px-5 py-8 text-center text-sm text-secondary">
            No parking requests in queue
          </p>
        )}

        {!loading &&
          sessions.map((session) => (
            <ParkingSessionListItemRow
              key={session.id}
              session={session}
              selected={session.id === selectedId}
              onSelect={() => onSelect(session.id)}
            />
          ))}
      </div>
    </section>
  );
}
