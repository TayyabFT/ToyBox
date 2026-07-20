import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import { VehicleDetailAlert } from "./VehicleDetailAlert";
import { VehicleDetailImage } from "./VehicleDetailImage";
import { VehicleDetailNotes } from "./VehicleDetailNotes";
import { VehicleInfoGrid } from "./VehicleInfoGrid";
import { HealthConditionGrid } from "./HealthConditionGrid";
// import { QuickActions } from "./QuickActions";
// import { StaffNote } from "./StaffNote";
import type { VehicleDetail } from "./types";

type VehicleDetailPanelProps = {
  detail: VehicleDetail | null;
  loading?: boolean;
};

export function VehicleDetailPanel({
  detail,
  loading = false,
}: VehicleDetailPanelProps) {
  if (loading) {
    return (
      <section
        className="overflow-hidden rounded-2xl border border-accent/12 bg-card"
        aria-busy="true"
        aria-live="polite"
      >
        <ShimmerBlock className="aspect-[16/9] w-full rounded-none border-b border-accent/10" />

        <div className="grid grid-cols-2 gap-4 border-b border-accent/10 px-5 py-5 md:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="space-y-1.5">
              <ShimmerBlock className="h-2.5 w-16" />
              <ShimmerBlock className="h-3.5 w-20" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 border-b border-accent/10 px-5 py-5 md:grid-cols-2">
          {Array.from({ length: 2 }, (_, groupIndex) => (
            <div key={groupIndex} className="space-y-4">
              <ShimmerBlock className="h-3 w-24" />
              <div className="space-y-4">
                {Array.from({ length: 3 }, (_, rowIndex) => (
                  <div key={rowIndex} className="space-y-1.5">
                    <ShimmerBlock className="h-2.5 w-20" />
                    <ShimmerBlock className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!detail) {
    return (
      <section className="overflow-hidden rounded-2xl border border-accent/12 bg-card px-5 py-8 text-center">
        <p className="font-roboto text-sm text-secondary">
          Select a vehicle
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-accent/12 bg-card">
      <VehicleDetailImage imageUrl={detail.imageUrl} name={detail.name} />
      <VehicleDetailAlert isOverdue={detail.isOverdue} />

      <VehicleInfoGrid
        name={detail.name}
        bay={detail.bay}
        mileage={detail.mileage}
        member={detail.member}
        memberBadge={detail.memberBadge}
      />

      <HealthConditionGrid
        health={detail.health}
        condition={detail.condition}
      />

      <VehicleDetailNotes notes={detail.notes} />
    </section>
  );
}
