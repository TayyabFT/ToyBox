import { ParkingSessionStatusBadge } from "./ParkingSessionStatusBadge";
import type { ParkingSessionListItem } from "./types";

type ParkingSessionListItemRowProps = {
  session: ParkingSessionListItem;
  selected: boolean;
  onSelect: () => void;
};

export function ParkingSessionListItemRow({
  session,
  selected,
  onSelect,
}: ParkingSessionListItemRowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex w-full cursor-pointer items-center gap-3 border-b border-accent/6 px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-accent/3 ${
        selected ? "bg-accent/5" : "bg-transparent"
      }`}
    >
      {selected && (
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-[3px] bg-accent"
        />
      )}

      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/8">
        <span className="font-copperplate text-[11px] text-primary">
          {session.slotZone !== "—" ? session.slotZone : "P"}
        </span>
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={`font-copperplate block truncate text-[12px] tracking-[0.04em] ${
            selected ? "text-primary" : "text-foreground"
          }`}
        >
          {session.vehicleName}
        </span>
        <span className="mt-1 block font-roboto truncate text-[9px] tracking-[0.06em] text-secondary uppercase">
          {session.memberName}
          {session.vehiclePlate ? ` · ${session.vehiclePlate}` : ""}
        </span>
        <span className="mt-1 block font-roboto truncate text-[8px] tracking-[0.06em] text-secondary uppercase">
          Bay {session.slotCode} · {session.reference}
        </span>
      </span>

      <span className="flex shrink-0 flex-col items-end gap-2">
        <ParkingSessionStatusBadge
          status={session.status}
          label={session.statusLabel}
        />
        <span className="font-roboto text-[8px] tracking-[0.08em] text-secondary uppercase">
          {session.requestedTime}
        </span>
      </span>
    </button>
  );
}
