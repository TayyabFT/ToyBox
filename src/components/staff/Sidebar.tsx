"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Camera,
  Checkbox,
  CircleCheck,
  Edit,
  Grid,
  Message,
  Sunburst,
  User,
} from "@/components/common/Svgs";
import { chatApi } from "@/api/chat.api";
import { getUnreadConversationCount } from "@/lib/concierge";
import { Sidebar } from "@/components/shared/layout";
import {
  isStaffNavActive,
  staffManagementNav,
  staffOperationsNav,
  type StaffNavItem,
} from "@/lib/staffNav";

type BadgeTone = "gold" | "pink" | "teal";

const badgeToneClass: Record<BadgeTone, string> = {
  gold: "bg-[#F0C566] text-dark",
  pink: "bg-pink text-dark",
  teal: "bg-teal text-dark",
};

const navIcons: Record<string, (active: boolean) => React.ReactNode> = {
  overview: (active) => <Grid active={active} />,
  inspections: (active) => <Checkbox active={active} />,
  "health-reports": (active) => <CircleCheck active={active} />,
  "service-requests": (active) => <Sunburst active={active} />,
  "photo-uploads": (active) => <Camera active={active} />,
  vehicles: (active) => <User active={active} />,
  concierge: (active) => <Message active={active} />,
  bookings: (active) => <Checkbox active={active} />,
  "op-updates": (active) => <Edit active={active} />,
};

function NavSection({
  title,
  items,
  pathname,
}: {
  title: string;
  items: StaffNavItem[];
  pathname: string;
}) {
  return (
    <div className="space-y-2">
      <p className="font-roboto px-3 text-[10px] font-medium tracking-[0.18em] text-section-label uppercase">
        {title}
      </p>

      <ul className="space-y-1">
        {items.map((item) => {
          const active = isStaffNavActive(pathname, item.href);
          const icon = navIcons[item.id];

          return (
            <li key={item.id} className="relative">
              {active && (
                <span
                  aria-hidden
                  className="absolute top-1/2 -left-3 h-6 w-[3px] -translate-y-1/2 rounded-r-lg bg-accent"
                />
              )}

              <Link
                href={item.href}
                className={`relative flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                  active
                    ? "bg-gradient-to-r from-accent/13 to-accent/3 text-accent"
                    : "text-muted hover:bg-[#FFFFFF08] hover:text-foreground"
                }`}
              >
                <span className="flex size-6 shrink-0 items-center justify-center [&_svg]:size-[18px]">
                  {icon?.(active)}
                </span>

                <span
                  className={`font-roboto flex-1 text-[13px] tracking-[0.04em] ${
                    active ? "font-medium text-primary" : "font-normal"
                  }`}
                >
                  {item.label}
                </span>

                {item.badge && (
                  <span
                    className={`flex h-4 min-w-6 shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none ${badgeToneClass[item.badge.tone]}`}
                  >
                    {item.badge.count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function StaffSidebar() {
  const pathname = usePathname();
  const [conciergeUnreadCount, setConciergeUnreadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadConciergeUnreadCount() {
      try {
        const response = await chatApi.getConversations();

        if (!cancelled) {
          setConciergeUnreadCount(
            getUnreadConversationCount(response.data.conversations),
          );
        }
      } catch {
        if (!cancelled) {
          setConciergeUnreadCount(0);
        }
      }
    }

    loadConciergeUnreadCount();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const managementNav = useMemo(
    () =>
      staffManagementNav.map((item) => {
        if (item.id !== "concierge" || conciergeUnreadCount <= 0) {
          return item;
        }

        return {
          ...item,
          badge: { count: conciergeUnreadCount, tone: "gold" as const },
        };
      }),
    [conciergeUnreadCount],
  );

  return (
    <Sidebar
      className="border-accent/8 bg-background"
      navWrapperClassName="border-y border-accent/8 px-4 py-5"
      header={
        <div className="shrink-0 px-5 py-5">
          <div className="flex items-center justify-between gap-2">
            <Image
              src="/images/logo.png"
              alt="logo"
              width={120}
              height={56}
              className="h-14 w-auto"
            />
            <div className="font-roboto flex items-center justify-center rounded-md border border-pink/28 bg-pink/12 px-3 py-1 text-[9px] leading-none tracking-[0.15em] text-pink">
              STAFF
            </div>
          </div>
        </div>
      }
      footer={
        <div className="shrink-0 px-4 py-4">
          <div className="space-y-1 rounded-xl border border-teal/18 bg-teal/4 px-4 py-3">
            <p className="font-roboto text-sm text-teal">Current Shift</p>
            <h3 className="font-copperplate text-lg text-foreground">
              07:00 — 15:00
            </h3>
            <p className="font-roboto text-sm text-secondary">
              5h 18m remaining
            </p>
          </div>
        </div>
      }
    >
      <NavSection
        title="Operations"
        items={staffOperationsNav}
        pathname={pathname}
      />
      <NavSection
        title="Management"
        items={managementNav}
        pathname={pathname}
      />
    </Sidebar>
  );
}
