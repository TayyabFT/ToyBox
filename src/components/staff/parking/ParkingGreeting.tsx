import { StaffShiftMeta } from "@/components/staff/StaffShiftMeta";
import { PlusSmall } from "@/components/common/Svgs";

type ParkingGreetingProps = {
  onAddSlots: () => void;
};

export function ParkingGreeting({ onAddSlots }: ParkingGreetingProps) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="space-y-3">
        <StaffShiftMeta />
        <div className="space-y-1">
          <h1 className="font-copperplate text-[32px] leading-tight">
            <span className="text-foreground">Parking </span>
            <span className="text-primary">Slots</span>
          </h1>
        </div>
      </div>

      <button
        type="button"
        onClick={onAddSlots}
        className="staff-add-cta font-roboto flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-[#D4A847] bg-surface px-5 py-3 text-[11px] font-semibold tracking-[0.14em] text-[#D4A847] uppercase transition-colors hover:bg-accent/8"
      >
        <PlusSmall color="currentColor" />
        Add Slots
      </button>
    </div>
  );
}
