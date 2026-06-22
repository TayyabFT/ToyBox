import { VehicleProfilePage } from "@/components/admin/vehicles/VehicleProfilePage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminVehicleProfilePage({ params }: PageProps) {
  const { id } = await params;

  return <VehicleProfilePage vehicleId={id} />;
}
