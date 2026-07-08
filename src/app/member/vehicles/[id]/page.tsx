import { MemberVehicleDetailPage } from "@/components/member";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MemberVehicleDetailRoutePage({ params }: PageProps) {
  const { id } = await params;

  return <MemberVehicleDetailPage vehicleId={id} />;
}
