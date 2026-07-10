import { StaffShiftMeta } from "@/components/staff/StaffShiftMeta";
import { PlusSmall } from "@/components/common/Svgs";

type VehiclesGreetingProps = {
  onAddSlots: () => void;
  onAddVehicle: () => void;
};

export function VehiclesGreeting({
  onAddSlots,
  onAddVehicle,
}: VehiclesGreetingProps) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="space-y-3">
        <StaffShiftMeta />
        <h1 className="font-copperplate text-[32px] leading-tight text-foreground">
          Vehicles
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={onAddSlots}
          className="font-roboto flex cursor-pointer items-center gap-2 rounded-full border border-[#D4A847] bg-surface px-5 py-3 text-[11px] font-semibold tracking-[0.14em] text-[#D4A847] uppercase transition-colors hover:bg-accent/8"
        >
          <PlusSmall color="currentColor" />
          Add Slots
        </button>

        <button
          type="button"
          onClick={onAddVehicle}
          className="font-roboto flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-gold-bright to-primary px-5 py-3 text-[11px] !font-bold tracking-[0.14em] text-dark uppercase"
        >
          <PlusSmall />
          Add Vehicle
        </button>
      </div>
    </div>
  );
}
