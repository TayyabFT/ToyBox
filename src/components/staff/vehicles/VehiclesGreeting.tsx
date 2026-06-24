import { PlusSmall } from "@/components/common/Svgs";

type VehiclesGreetingProps = {
  onAddVehicle: () => void;
};

export function VehiclesGreeting({ onAddVehicle }: VehiclesGreetingProps) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="space-y-3">
        <p className="font-roboto text-xs tracking-[0.14em] text-primary uppercase">
          Saturday, 17 July 2026 · Morning Shift
        </p>
        <h1 className="font-copperplate text-[32px] leading-tight text-foreground">
          Vehicles
        </h1>
      </div>

      <button
        type="button"
        onClick={onAddVehicle}
        className="font-roboto flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-gold-bright to-primary px-5 py-3 text-[11px] !font-bold tracking-[0.14em] text-dark uppercase"
      >
        <PlusSmall />
        Add Vehicle
      </button>
    </div>
  );
}
