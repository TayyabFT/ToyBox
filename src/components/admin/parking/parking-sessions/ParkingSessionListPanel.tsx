import { ParkingSessionListItemRow } from "./ParkingSessionListItemRow";
import type { ParkingSessionListItem } from "./types";

type ParkingSessionListPanelProps = {
  sessions: ParkingSessionListItem[];
  selectedId: string;
  loading: boolean;
  onSelect: (id: string) => void;
};

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
          <p className="font-roboto px-5 py-8 text-center text-sm text-secondary">
            Loading parking requests...
          </p>
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
