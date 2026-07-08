import { notFound } from "next/navigation";
import { garageVehicleDetails } from "./mockData";
import { MemberVehicleDetailHeader } from "./MemberVehicleDetailHeader";
import { MemberVehicleHeroCard } from "./MemberVehicleHeroCard";
import { MemberVehicleHealthCard } from "./MemberVehicleHealthCard";
import { MemberVehicleRequestsCard } from "./MemberVehicleRequestsCard";
import { MemberVehicleSpecsCard } from "./MemberVehicleSpecsCard";

type MemberVehicleDetailPageProps = {
  vehicleId: string;
};

export function MemberVehicleDetailPage({
  vehicleId,
}: MemberVehicleDetailPageProps) {
  const vehicle = garageVehicleDetails[vehicleId];

  if (!vehicle) notFound();

  return (
    <div className="space-y-6 p-8">
      <MemberVehicleDetailHeader />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <MemberVehicleHeroCard vehicle={vehicle} />
          <MemberVehicleRequestsCard requests={vehicle.requests} />
        </div>

        <div className="space-y-6">
          <MemberVehicleSpecsCard specs={vehicle.specs} ownership={vehicle.ownership} />
          <MemberVehicleHealthCard
            health={vehicle.health}
            ctaLabel={vehicle.healthCtaLabel}
          />
        </div>
      </div>
    </div>
  );
}
