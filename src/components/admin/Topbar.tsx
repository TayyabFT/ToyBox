"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Topbar } from "@/components/shared/layout";
import {
  getAdminMemberProfileId,
  getAdminStaffProfileId,
  getAdminVehicleProfileId,
  useAdminPageMeta,
} from "@/lib/adminPageMeta";
import { getAdminPageTitle } from "@/lib/adminNav";
import { AdminProfileCard } from "./AdminProfileCard";

export function AdminTopbar() {
  const pathname = usePathname();
  const { meta } = useAdminPageMeta();
  const page = getAdminPageTitle(pathname).toUpperCase();
  const memberProfileId = getAdminMemberProfileId(pathname);
  const staffProfileId = getAdminStaffProfileId(pathname);
  const vehicleProfileId = getAdminVehicleProfileId(pathname);

  return (
    <Topbar
      breadcrumb={
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[11px] tracking-[0.16em] uppercase"
        >
          <span className="font-roboto text-secondary">TOYBOX ADMIN</span>
          <span className="font-roboto text-secondary">/</span>
          {memberProfileId ? (
            <>
              <Link
                href="/admin/members"
                className="font-roboto text-secondary transition-colors hover:text-primary"
              >
                MEMBERS
              </Link>
              <span className="font-roboto text-secondary">/</span>
              <span className="font-roboto text-primary">
                {meta.subtitle?.toUpperCase() ?? `MEMBER ${memberProfileId}`}
              </span>
            </>
          ) : staffProfileId ? (
            <>
              <Link
                href="/admin/staff"
                className="font-roboto text-secondary transition-colors hover:text-primary"
              >
                STAFF
              </Link>
              <span className="font-roboto text-secondary">/</span>
              <span className="font-roboto text-primary">
                {meta.subtitle?.toUpperCase() ?? `STAFF ${staffProfileId}`}
              </span>
            </>
          ) : vehicleProfileId ? (
            <>
              <Link
                href="/admin/vehicles"
                className="font-roboto text-secondary transition-colors hover:text-primary"
              >
                VEHICLES
              </Link>
              <span className="font-roboto text-secondary">/</span>
              <span className="font-roboto text-primary">
                {meta.subtitle?.toUpperCase() ?? `VEHICLE ${vehicleProfileId}`}
              </span>
            </>
          ) : (
            <span className="font-roboto text-primary">{page}</span>
          )}
        </nav>
      }
      profileTrigger="F"
      profileTriggerClassName="flex size-10 cursor-pointer items-center justify-center rounded-full bg-gradient-to-b from-[#F0C566] to-[#8B6F2A] text-sm font-medium text-dark uppercase"
      profileCard={<AdminProfileCard />}
    />
  );
}
