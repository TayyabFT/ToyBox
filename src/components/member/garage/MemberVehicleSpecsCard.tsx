import type { MemberVehicleOwnership, MemberVehicleSpecs } from "./types";
import { Chip } from "@/components/ui/Chip";

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="font-roboto text-[11px] text-secondary">{label}</span>
      <span className="font-roboto text-right text-[11px] font-medium text-foreground uppercase">
        {value}
      </span>
    </div>
  );
}

type MemberVehicleSpecsCardProps = {
  specs: MemberVehicleSpecs;
  ownership: MemberVehicleOwnership;
};

export function MemberVehicleSpecsCard({
  specs,
  ownership,
}: MemberVehicleSpecsCardProps) {
  return (
    <div className="rounded-2xl border border-accent/10 bg-card p-4 sm:p-5">
      <h2 className="font-copperplate text-[14px] sm:text-[15px] uppercase">
        <span className="text-foreground">Specs and </span>
        <span className="text-primary">Info</span>
      </h2>

      <div className="mt-3 sm:mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="border border-accent/10 rounded-lg p-3 sm:p-4">
          <p className="font-roboto mb-1 text-[9px] tracking-[0.14em] text-secondary/70 uppercase">
            Vehicle Specs
          </p>
          <div className="divide-y divide-accent/8">
            <div className="flex items-center justify-between gap-4 py-2 sm:py-2.5">
              <span className="font-roboto text-[11px] text-secondary">Make</span>
              <Chip label={specs.make} context="inline" tone="gold" shape="pill" />
            </div>
            <div className="flex items-center justify-between gap-4 py-2 sm:py-2.5">
              <span className="font-roboto text-[11px] text-secondary">Model</span>
              <Chip label={specs.model} context="inline" tone="teal" shape="pill" />
            </div>
            <SpecRow label="Year" value={specs.year} />
            <SpecRow label="Engine" value={specs.engine} />
            <SpecRow label="Power" value={specs.power} />
            <SpecRow label="Transmission" value={specs.transmission} />
            <SpecRow label="Drive" value={specs.drive} />
            <SpecRow label="0-100 km/h" value={specs.zeroToHundred} />
            <SpecRow label="Top speed" value={specs.topSpeed} />
          </div>
        </div>

        <div className="border border-accent/10 rounded-lg p-3 sm:p-4">
          <p className="font-roboto mb-1 text-[9px] tracking-[0.14em] text-secondary/70 uppercase">
            Ownership Info
          </p>
          <div className="divide-y divide-accent/8">
            <div className="flex items-center justify-between gap-4 py-2 sm:py-2.5">
              <span className="font-roboto text-[11px] text-secondary">Colour</span>
              <span className="font-roboto text-right text-[11px] font-medium text-primary uppercase">
                {ownership.colour}
              </span>
            </div>
            <SpecRow label="Chassis No." value={ownership.chassisNo} />
            <SpecRow label="Plate" value={ownership.plate} />
            <SpecRow label="Purchased" value={ownership.purchased} />
            <SpecRow label="Storage bay" value={ownership.storageBay} />
            <SpecRow label="Mileage" value={ownership.mileage} />
          </div>
        </div>
      </div>
    </div>
  );
}
