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
  if (loading || !detail) {
    return (
      <section className="overflow-hidden rounded-2xl border border-accent/12 bg-card px-5 py-8 text-center">
        <p className="font-roboto text-sm text-secondary">
          Loading vehicle details...
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
