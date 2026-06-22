"use client";

import { usePathname } from "next/navigation";
import {
  Building,
  Calendar,
  Members,
  Message,
  NavAnalytics,
  NavCar,
  NavDollar,
  NavMegaphone,
  NavConfirmationCheck,
  OverviewPulse,
  ToyBoxLogoMark,
  User,
  Wrench,
  Sunburst,
} from "@/components/common/Svgs";
import { Sidebar } from "@/components/shared/layout";
import { AdminSidebarNavSection, adminNavStroke } from "@/components/ui";
import {
  adminManageNav,
  adminOperationsNav,
  isAdminNavActive,
} from "@/lib/adminNav";

const navIcons: Record<string, (active: boolean) => React.ReactNode> = {
  overview: (active) => <OverviewPulse stroke={adminNavStroke(active)} />,
  members: (active) => <User stroke={adminNavStroke(active)} />,
  vehicles: (active) => <NavCar stroke={adminNavStroke(active)} />,
  concierge: (active) => <Message stroke={adminNavStroke(active)} />,
  confirmations: (active) => (
    <NavConfirmationCheck stroke={adminNavStroke(active)} />
  ),
  "service-requests": (active) => <Sunburst active={active} />,
  events: (active) => <Calendar stroke={adminNavStroke(active)} />,
  clubhouse: (active) => <Building stroke={adminNavStroke(active)} />,
  workshop: (active) => <Wrench stroke={adminNavStroke(active)} />,
  communications: (active) => <NavMegaphone stroke={adminNavStroke(active)} />,
  finance: (active) => <NavDollar stroke={adminNavStroke(active)} />,
  analytics: (active) => <NavAnalytics stroke={adminNavStroke(active)} />,
  staff: (active) => <Members stroke={adminNavStroke(active)} />,
};

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      className="border-white/5 bg-[#0B0908]"
      navWrapperClassName="px-4 py-2"
      header={
        <div className="shrink-0 px-5 pt-5 pb-4">
          <div className="flex items-center gap-2.5">
            <ToyBoxLogoMark />
            <span className="font-roboto text-[13px] font-normal tracking-[0.28em] text-[#E7E5E4]">
              TOY BOX
            </span>
            <div className="font-roboto ml-auto rounded-full bg-[#3D2226] px-2.5 py-1 text-[8px] leading-none tracking-[0.15em] text-[#E8D4D4]">
              ADMIN
            </div>
          </div>
        </div>
      }
    >
      <AdminSidebarNavSection
        title="Operations"
        items={adminOperationsNav}
        pathname={pathname}
        isActive={isAdminNavActive}
        icons={navIcons}
      />
      <AdminSidebarNavSection
        title="Manage"
        items={adminManageNav}
        pathname={pathname}
        isActive={isAdminNavActive}
        icons={navIcons}
      />
    </Sidebar>
  );
}
