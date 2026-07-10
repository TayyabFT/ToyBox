import { notFound } from "next/navigation";
import { OverviewPage } from "@/components/staff/overview";
import { VehiclesPage } from "@/components/staff/vehicles";
import { ConfirmationsPage } from "@/components/staff/confirmations";
import { ConciergePage } from "@/components/staff/concierge";
import { InspectionsPage } from "@/components/staff/inspections";
import { HealthReportsPage } from "@/components/staff/health-reports";
import { ServiceRequestsPage } from "@/components/staff/service-requests";
import { PhotoUploadsPage } from "@/components/staff/photo-uploads";
import { OpUpdatesPage } from "@/components/staff/op-updates";
import { ClubhousePage } from "@/components/staff/clubhouse";
import { staffNavItems } from "@/lib/staffNav";

type PageProps = {
  params: Promise<{ section: string }>;
};

const page = async ({ params }: PageProps) => {
  const { section } = await params;
  const navItem = staffNavItems.find((item) => item.href.endsWith(`/${section}`));

  if (!navItem) notFound();

  if (navItem.id === "overview") {
    return <OverviewPage />;
  }

  if (navItem.id === "vehicles") {
    return <VehiclesPage />;
  }

  if (navItem.id === "bookings") {
    return <ConfirmationsPage />;
  }

  if (navItem.id === "inspections") {
    return <InspectionsPage />;
  }

  if (navItem.id === "health-reports") {
    return <HealthReportsPage />;
  }

  if (navItem.id === "concierge") {
    return <ConciergePage />;
  }

  if (navItem.id === "service-requests") {
    return <ServiceRequestsPage />;
  }

  if (navItem.id === "photo-uploads") {
    return <PhotoUploadsPage />;
  }

  if (navItem.id === "op-updates") {
    return <OpUpdatesPage />;
  }

  if (navItem.id === "clubhouse") {
    return <ClubhousePage />;
  }

  return (
    <div className="p-8 font-roboto text-[11px] tracking-[0.1em] text-secondary uppercase">
      {navItem.label} — coming soon
    </div>
  );
};

export default page;
