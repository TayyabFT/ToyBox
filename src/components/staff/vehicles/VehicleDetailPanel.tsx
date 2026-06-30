import { VehicleDetailAlert } from "./VehicleDetailAlert";
import { VehicleInfoGrid } from "./VehicleInfoGrid";
import { HealthConditionGrid } from "./HealthConditionGrid";
import { ServiceHistory } from "./ServiceHistory";
import { QuickActions } from "./QuickActions";
import { StaffNote } from "./StaffNote";
import type { VehicleDetail } from "./types";

type VehicleDetailPanelProps = {
  detail: VehicleDetail;
};

export function VehicleDetailPanel({ detail }: VehicleDetailPanelProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-accent/12 bg-card">
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

      <div className="grid grid-cols-1 gap-6 p-5 xl:grid-cols-2">
        <ServiceHistory entries={detail.serviceHistory} />
        <div className="space-y-6">
          <QuickActions />
          <StaffNote />
        </div>
      </div>
    </section>
  );
}
