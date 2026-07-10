import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MemberVehicleDetailRedirectPage({ params }: PageProps) {
  const { id } = await params;

  redirect(`/member/garage/${id}`);
}
