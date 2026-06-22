import { VehicleHistory, VehicleCalendar, VehicleFlag } from "@/components/common/Svgs";

type VehicleDetailAlertProps = {
  isOverdue: boolean;
};

export function VehicleDetailAlert({ isOverdue }: VehicleDetailAlertProps) {
  if (!isOverdue) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-accent/10 px-5 py-4">
      <div className="flex items-center gap-2">
        <VehicleFlag />
        <p className="font-roboto text-[11px] font-medium tracking-[0.08em] text-pink uppercase">
          Overdue Service — Action Required
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="font-roboto flex cursor-pointer items-center gap-2 rounded-lg border border-accent/25 bg-transparent px-4 py-2 text-[10px] font-medium tracking-[0.1em] text-primary uppercase"
        >
          <VehicleHistory />
          History
        </button>
        <button
          type="button"
          className="font-roboto flex cursor-pointer items-center gap-2 rounded-lg border border-accent/25 bg-transparent px-4 py-2 text-[10px] font-medium tracking-[0.1em] text-primary uppercase"
        >
          <VehicleCalendar />
          Book Service
        </button>
      </div>
    </div>
  );
}
