import { ClubhouseRestaurantDetailPage } from "@/components/admin/clubhouse/restaurant";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminClubhouseRestaurantDetailPage({
  params,
}: PageProps) {
  const { id } = await params;

  return <ClubhouseRestaurantDetailPage restaurantId={id} />;
}
