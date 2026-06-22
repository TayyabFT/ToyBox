import { StaffProfilePage } from "@/components/admin/staff/StaffProfilePage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminStaffProfilePage({ params }: PageProps) {
  const { id } = await params;

  return <StaffProfilePage staffId={id} />;
}
