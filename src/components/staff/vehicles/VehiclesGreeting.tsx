import { StaffShiftMeta } from "@/components/staff/StaffShiftMeta";
import { PlusSmall } from "@/components/common/Svgs";

type VehiclesGreetingProps = {
  onAddVehicle: () => void;
};

export function VehiclesGreeting({ onAddVehicle }: VehiclesGreetingProps) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="space-y-3">
        <StaffShiftMeta />
        <h1 className="font-copperplate text-[32px] leading-tight text-foreground">
          Vehicles
        </h1>
      </div>

      <button
        type="button"
        onClick={onAddVehicle}
        className="staff-add-cta font-roboto flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-gold-bright to-primary px-5 py-3 text-[11px] !font-bold tracking-[0.14em] text-dark uppercase"
      >
        <PlusSmall />
        Add Vehicle
      </button>
    </div>
  );
}
