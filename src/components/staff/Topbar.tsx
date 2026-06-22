"use client";

import { usePathname } from "next/navigation";
import { User } from "@/components/common/Svgs";
import { Topbar } from "@/components/shared/layout";
import { getStaffPageTitle } from "@/lib/staffNav";
import { StaffProfileCard } from "./StaffProfileCard";

export function StaffTopbar() {
  const pathname = usePathname();
  const page = getStaffPageTitle(pathname);

  return (
    <Topbar
      breadcrumb={
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[13px] tracking-[0.14em] uppercase"
        >
          <span className="font-roboto text-secondary">TOYBOX</span>
          <span className="font-roboto text-secondary">/</span>
          <span className="font-roboto text-primary">{page}</span>
        </nav>
      }
      profileTrigger={<User />}
      profileTriggerClassName="flex size-10 cursor-pointer items-center justify-center rounded-full border border-accent/10 transition-colors hover:border-primary/40 [&_svg]:size-[18px]"
      profileCard={<StaffProfileCard />}
    />
  );
}
