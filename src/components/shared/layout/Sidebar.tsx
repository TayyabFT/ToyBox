"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  Building,
  Calendar,
  Camera,
  Checkbox,
  CircleCheck,
  Edit,
  Finance,
  Grid,
  Members,
  Message,
  NavAnalytics,
  NavCommunications,
  Sunburst,
  User,
  VehicleCalendar,
  Wrench,
} from "@/components/common/Svgs";
import { chatApi } from "@/api/chat.api";
import { getUnreadConversationCount } from "@/lib/concierge";
import { useTheme } from "@/components/common/ThemeProvider";
import { adminManageNav, adminOperationsNav } from "@/lib/adminNav";
import { staffManagementNav, staffOperationsNav } from "@/lib/staffNav";
import { memberNav } from "@/lib/memberNav";
import type { UserRole } from "@/lib/auth";

type BadgeTone = "gold" | "pink" | "teal";

type SidebarNavItem = {
  id: string;
  label: string;
  href: string;
  badge?: { count: number; tone: BadgeTone };
};

type SidebarSection = {
  title: string;
  items: SidebarNavItem[];
};

type SidebarSpec = {
  /** Route prefix used to resolve the active nav item. */
  base: string;
  /** Portal badge shown beside the logo. */
  badge: { label: string; className: string };
  /** Grouped navigation shown in the scroll area. */
  sections: SidebarSection[];
  /** Staff-only footer (current shift card). */
  showShiftCard?: boolean;
};

/* ------------------------------------------------------------------ *
 * Per-role sidebar specifications.
 * The shared design is the staff sidebar; only the data differs.
 * ------------------------------------------------------------------ */

const ADMIN_SIDEBAR: SidebarSpec = {
  base: "/admin",
  badge: {
    label: "ADMIN",
    className: "border-accent/30 bg-accent/12 text-accent",
  },
  sections: [
    { title: "Operations", items: adminOperationsNav },
    { title: "Manage", items: adminManageNav },
  ],
};

const STAFF_SIDEBAR: SidebarSpec = {
  base: "/staff",
  badge: {
    label: "STAFF",
    className: "border-pink/28 bg-pink/12 text-pink",
  },
  sections: [
    { title: "Operations", items: staffOperationsNav },
    { title: "Management", items: staffManagementNav },
  ],
  showShiftCard: true,
};

const MEMBER_SIDEBAR: SidebarSpec = {
  base: "/member",
  badge: {
    label: "MEMBER",
    className: "border-teal/28 bg-teal/12 text-teal",
  },
  sections: [{ title: "Menu", items: memberNav }],
};

const SIDEBAR_SPECS: Record<UserRole, SidebarSpec> = {
  admin: ADMIN_SIDEBAR,
  staff: STAFF_SIDEBAR,
  member: MEMBER_SIDEBAR,
};

const badgeToneClass: Record<BadgeTone, string> = {
  gold: "bg-[#F0C566] text-dark",
  pink: "bg-pink text-dark",
  teal: "bg-teal text-dark",
};

const navIcons: Record<string, (active: boolean) => ReactNode> = {
  overview: (active) => <Grid active={active} />,
  bookings: (active) => (
    <VehicleCalendar
      color={active ? "var(--nav-icon-active)" : "var(--muted)"}
    />
  ),
  inspections: (active) => <Checkbox active={active} />,
  "health-reports": (active) => <CircleCheck active={active} />,
  "service-requests": (active) => <Sunburst active={active} />,
  "photo-uploads": (active) => <Camera active={active} />,
  vehicles: (active) => <User active={active} />,
  concierge: (active) => <Message active={active} />,
  confirmations: (active) => <Checkbox active={active} />,
  "op-updates": (active) => <Edit active={active} />,
  members: (active) => <Members active={active} />,
  staff: (active) => <Members active={active} />,
  events: (active) => <Calendar active={active} />,
  clubhouse: (active) => <Building active={active} />,
  workshop: (active) => <Wrench active={active} />,
  communications: (active) => <NavCommunications active={active} />,
  finance: (active) => <Finance active={active} />,
  analytics: (active) => <NavAnalytics active={active} />,
};

function isNavActive(pathname: string, href: string, base: string): boolean {
  if (href === base || href === `${base}/overview`) {
    return pathname === base || pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavSection({
  section,
  pathname,
  base,
}: {
  section: SidebarSection;
  pathname: string;
  base: string;
}) {
  return (
    <div className="space-y-2">
      <p className="font-roboto px-3 text-[10px] font-medium tracking-[0.18em] text-section-label uppercase">
        {section.title}
      </p>

      <ul className="space-y-1">
        {section.items.map((item) => {
          const active = isNavActive(pathname, item.href, base);
          const icon = navIcons[item.id];

          return (
            <li key={item.id} className="relative">
              {active && (
                <span
                  aria-hidden
                  className="absolute top-1/2 -left-3 h-6 w-[3px] -translate-y-1/2 rounded-r-lg bg-[var(--nav-active-indicator)]"
                />
              )}

              <Link
                href={item.href}
                className={`relative flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                  active
                    ? "sidebar-nav-link--active"
                    : "sidebar-nav-link--inactive"
                }`}
              >
                <span className="flex size-6 shrink-0 items-center justify-center [&_svg]:size-[18px]">
                  {icon?.(active)}
                </span>

                <span
                  className={`font-roboto flex-1 text-[13px] tracking-[0.04em] ${
                    active ? "font-medium text-[var(--nav-active-fg)]" : "font-normal"
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

export function Sidebar({ role }: { role: UserRole }) {
  const spec = SIDEBAR_SPECS[role];
  const pathname = usePathname();
  const { theme } = useTheme();
  const isLightMode = theme === "light";
  const [conciergeUnreadCount, setConciergeUnreadCount] = useState(0);

  useEffect(() => {
    if (role !== "staff") return;

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
  }, [role, pathname]);

  const sections = useMemo(
    () =>
      spec.sections.map((section) => ({
        ...section,
        items: section.items.map((item) =>
          role === "staff" && item.id === "concierge" && conciergeUnreadCount > 0
            ? {
                ...item,
                badge: { count: conciergeUnreadCount, tone: "gold" as const },
              }
            : item,
        ),
      })),
    [spec, role, conciergeUnreadCount],
  );

  return (
    <aside className="sidebar fixed flex h-screen w-[330px] shrink-0 flex-col overflow-hidden border-r border-accent/8 bg-[var(--sidebar-bg)]">
      <div className="shrink-0 px-5 py-5">
        <div className="flex items-center justify-between gap-2">
          <Image
            src={isLightMode ? "/images/lightlogo.png" : "/images/logo.png"}
            alt="Toy Box"
            width={120}
            height={56}
            className="h-14 w-auto"
          />
          <div
            className={`font-roboto flex items-center justify-center rounded-md border px-3 py-1 text-[9px] leading-none tracking-[0.15em] ${spec.badge.className}`}
          >
            {spec.badge.label}
          </div>
        </div>
      </div>

      <div className="Custom__Scrollbar min-h-0 flex-1 overflow-y-auto border-y border-accent/8 px-4 py-5">
        <nav className="space-y-7">
          {sections.map((section) => (
            <NavSection
              key={section.title}
              section={section}
              pathname={pathname}
              base={spec.base}
            />
          ))}
        </nav>
      </div>

      {spec.showShiftCard && (
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
      )}
    </aside>
  );
}
