import { ParkingSlotStatusBadge } from "./ParkingSlotStatusBadge";
import type { ParkingSlotListItem } from "./types";

type ParkingSlotListItemRowProps = {
  slot: ParkingSlotListItem;
  selected: boolean;
  onSelect: () => void;
};

export function ParkingSlotListItemRow({
  slot,
  selected,
  onSelect,
}: ParkingSlotListItemRowProps) {
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
        <span className="font-copperplate text-[12px] text-primary">
          {slot.zone}
        </span>
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={`font-copperplate block truncate text-[12px] tracking-[0.04em] ${
            selected ? "text-primary" : "text-foreground"
          }`}
        >
          {slot.slotCode}
        </span>
        <span className="mt-1 block font-roboto truncate text-[9px] tracking-[0.06em] text-secondary uppercase">
          Level {slot.level} · {slot.slotType}
        </span>
      </span>

      <span className="flex shrink-0 flex-col items-end gap-2">
        <ParkingSlotStatusBadge
          status={slot.status}
          label={slot.statusLabel}
        />
        {!slot.isActive && (
          <span className="font-roboto text-[8px] tracking-[0.08em] text-secondary uppercase">
            Inactive
          </span>
        )}
      </span>
    </button>
  );
}
