import { PlusSmall } from "@/components/common/Svgs";
import { StaffShiftMeta } from "@/components/staff/StaffShiftMeta";

type InspectionsGreetingProps = {
  onAddInspection: () => void;
};

export function InspectionsGreeting({ onAddInspection }: InspectionsGreetingProps) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="space-y-3">
        <StaffShiftMeta split />
        <h1 className="font-copperplate text-[32px] leading-tight">
          <span className="text-foreground">Vehicle </span>
          <span className="text-primary">Inspections</span>
        </h1>
      </div>

      <button
        type="button"
        onClick={onAddInspection}
        className="staff-add-cta font-roboto flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-gold-bright to-primary px-5 py-3 text-[11px] !font-bold tracking-[0.14em] text-dark uppercase"
      >
        <PlusSmall />
        Add Inspection
      </button>
    </div>
  );
}
