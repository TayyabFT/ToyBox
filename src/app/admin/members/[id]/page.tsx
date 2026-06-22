import { MemberProfilePage } from "@/components/admin/members/MemberProfilePage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminMemberProfilePage({ params }: PageProps) {
  const { id } = await params;

  return <MemberProfilePage memberId={id} />;
}
