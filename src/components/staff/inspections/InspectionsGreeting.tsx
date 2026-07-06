import { PlusSmall } from "@/components/common/Svgs";

type InspectionsGreetingProps = {
  onAddInspection: () => void;
};

export function InspectionsGreeting({ onAddInspection }: InspectionsGreetingProps) {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-end justify-between gap-4">
      <div className="space-y-3">
        <p className="font-roboto text-xs tracking-[0.14em] uppercase">
          <span className="text-foreground">{today} · </span>
          <span className="text-primary">Staff Shift</span>
        </p>
        <h1 className="font-copperplate text-[32px] leading-tight">
          <span className="text-foreground">Vehicle </span>
          <span className="text-primary">Inspections</span>
        </h1>
      </div>

      <button
        type="button"
        onClick={onAddInspection}
        className="font-roboto flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-gold-bright to-primary px-5 py-3 text-[11px] !font-bold tracking-[0.14em] text-dark uppercase"
      >
        <PlusSmall />
        Add Inspection
      </button>
    </div>
  );
}
