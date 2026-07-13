import { notFound } from "next/navigation";
import { AnalyticsPage } from "@/components/admin/analytics";
import { ClubhousePage } from "@/components/admin/clubhouse";
import { CommunicationsPage } from "@/components/admin/communications";
import { ConfirmationsPage } from "@/components/admin/confirmations";
import { ConciergePage } from "@/components/admin/concierge";
import { EventsPage } from "@/components/admin/events";
import { MembersPage } from "@/components/admin/members";
import { AdminOverviewPage } from "@/components/admin/overview";
import { ParkingPage } from "@/components/admin/parking";
import { ServiceRequestsPage } from "@/components/admin/service-requests";
import { WorkshopPage } from "@/components/admin/workshop";
import { StaffPage } from "@/components/admin/staff";
import { VehiclesPage } from "@/components/admin/vehicles";
import { adminNavItems } from "@/lib/adminNav";

type PageProps = {
  params: Promise<{ section: string }>;
};

export default async function AdminSectionPage({ params }: PageProps) {
  const { section } = await params;
  const navItem = adminNavItems.find((item) => item.href.endsWith(`/${section}`));

  if (!navItem) notFound();

  if (navItem.id === "overview") {
    return <AdminOverviewPage />;
  }

  if (navItem.id === "staff") {
    return <StaffPage />;
  }

  if (navItem.id === "members") {
    return <MembersPage />;
  }

  if (navItem.id === "bookings") {
    return <ConfirmationsPage />;
  }

  if (navItem.id === "concierge") {
    return <ConciergePage />;
  }

  if (navItem.id === "events") {
    return <EventsPage />;
  }

  if (navItem.id === "clubhouse") {
    return <ClubhousePage />;
  }

  if (navItem.id === "parking") {
    return <ParkingPage />;
  }

  if (navItem.id === "vehicles") {
    return <VehiclesPage />;
  }

  if (navItem.id === "service-requests") {
    return <ServiceRequestsPage />;
  }

  if (navItem.id === "workshop") {
    return <WorkshopPage />;
  }

  if (navItem.id === "communications") {
    return <CommunicationsPage />;
  }

  if (navItem.id === "analytics") {
    return <AnalyticsPage />;
  }

  return (
    <div className="p-8 font-roboto text-[11px] tracking-[0.1em] text-secondary uppercase">
      {navItem.label} — coming soon
    </div>
  );
}
