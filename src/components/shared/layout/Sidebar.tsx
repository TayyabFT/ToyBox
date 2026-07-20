"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Camera,
  Checkbox,
  CircleCheck,
  Edit,
  Finance,
  Grid,
  Members,
  HelpSupport,
  Message,
  AskSteve,
  TermsPrivacy,
  NavAnalytics,
  NavClubhouse,
  NavCommunications,
  NavGarage,
  NavParking,
  Sunburst,
  User,
  VehicleCalendar,
  Wrench,
} from "@/components/common/Svgs";
import { chatApi } from "@/api/chat.api";
import { memberChatApi } from "@/api/memberChat.api";
import { memberEventsApi } from "@/api/memberEvents.api";
import { getUnreadConversationCount } from "@/lib/concierge";
import { getMemberUnreadMessageCount } from "@/lib/memberConcierge";
import { useTheme } from "@/components/common/ThemeProvider";
import {
  ADMIN_PROFILE_PATH,
  adminManageNav,
  adminOperationsNav,
} from "@/lib/adminNav";
import { staffManagementNav, staffOperationsNav } from "@/lib/staffNav";
import { memberNav, memberServicesNav, memberAccountNav } from "@/lib/memberNav";
import { SidebarProfileFooter } from "@/components/shared/layout/SidebarProfileFooter";
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
  sections: [
    { title: "Menu", items: memberNav },
    { title: "Services", items: memberServicesNav },
    { title: "Account", items: memberAccountNav },
  ],
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
  parking: (active) => <NavParking active={active} />,
  garage: (active) => <NavGarage active={active} />,
  concierge: (active) => <Message active={active} />,
  "ask-steve": (active) => <AskSteve active={active} />,
  confirmations: (active) => <Checkbox active={active} />,
  "op-updates": (active) => <Edit active={active} />,
  members: (active) => <Members active={active} />,
  staff: (active) => <Members active={active} />,
  events: (active) => <Calendar active={active} />,
  clubhouse: (active) => <NavClubhouse active={active} />,
  workshop: (active) => <Wrench active={active} />,
  communications: (active) => <NavCommunications active={active} />,
  finance: (active) => <Finance active={active} />,
  analytics: (active) => <NavAnalytics active={active} />,
  // Member-specific
  "the-club": (active) => <NavClubhouse active={active} />,
  diary: (active) => <Calendar active={active} />,
  marketplace: (active) => <Sunburst active={active} />,
  profile: (active) => <User active={active} />,
  help: (active) => <HelpSupport active={active} />,
  "terms-privacy": (active) => <TermsPrivacy active={active} />,
};

function isNavActive(pathname: string, href: string, base: string): boolean {
  // Home route: exact match only
  if (href === base) {
    return pathname === base;
  }
  // Overview alias
  if (href === `${base}/overview`) {
    return pathname === base || pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavSection({
  section,
  pathname,
  base,
  isLightMode,
}: {
  section: SidebarSection;
  pathname: string;
  base: string;
  isLightMode: boolean;
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
                    className={`sidebar-count-badge flex h-4 min-w-6 shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none ${
                      isLightMode
                        ? "bg-[#8A7D6A] text-white"
                        : badgeToneClass[item.badge.tone]
                    }`}
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

function StaffShiftCard() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    function updateTime() {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    }

    updateTime();
    const interval = window.setInterval(updateTime, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="shrink-0 px-4 py-4">
      <div className="space-y-1 rounded-xl border border-teal/18 bg-teal/4 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="font-roboto text-sm text-teal">Current Shift</p>
          <p className="font-roboto text-sm text-foreground">{currentTime}</p>
        </div>
        <h3 className="font-copperplate text-lg text-foreground">
          07:00 — 15:00
        </h3>
        <p className="font-roboto text-sm text-secondary">5h 18m remaining</p>
      </div>
    </div>
  );
}

export function Sidebar({
  role,
  mobileOpen = false,
  onMobileClose,
}: {
  role: UserRole;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const spec = SIDEBAR_SPECS[role];
  const pathname = usePathname();
  const { theme } = useTheme();
  const isLightMode = theme === "light";
  const [conciergeUnreadCount, setConciergeUnreadCount] = useState(0);
  const [eventsUpcomingCount, setEventsUpcomingCount] = useState(0);

  useEffect(() => {
    onMobileClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (role !== "staff" && role !== "member") return;

    let cancelled = false;

    async function loadConciergeUnreadCount() {
      try {
        if (role === "staff") {
          const response = await chatApi.getConversations();

          if (!cancelled) {
            setConciergeUnreadCount(
              getUnreadConversationCount(response.data.conversations),
            );
          }
        } else {
          const response = await memberChatApi.getInbox();

          if (!cancelled) {
            setConciergeUnreadCount(
              getMemberUnreadMessageCount(response.data.conversations),
            );
          }
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

  useEffect(() => {
    if (role !== "member") return;

    let cancelled = false;

    async function loadEventsUpcomingCount() {
      try {
        const response = await memberEventsApi.getGrouped();
        if (!cancelled) {
          const { featured, thisWeek, nextMonth } = response.data;
          // Deduplicate by id across all groups, then count events not yet joined
          const seen = new Set<string>();
          const allUpcoming = [...(featured ?? []), ...(thisWeek ?? []), ...(nextMonth ?? [])];
          let count = 0;
          for (const event of allUpcoming) {
            if (!seen.has(event.id)) {
              seen.add(event.id);
              if (!event.isJoined) {
                count++;
              }
            }
          }
          setEventsUpcomingCount(count);
        }
      } catch {
        if (!cancelled) {
          setEventsUpcomingCount(0);
        }
      }
    }

    loadEventsUpcomingCount();

    return () => {
      cancelled = true;
    };
  }, [role, pathname]);

  const sections = useMemo(
    () =>
      spec.sections.map((section) => ({
        ...section,
        items: section.items.map((item) => {
          // Concierge unread badge
          if (item.id === "concierge" && conciergeUnreadCount > 0) {
            if (role === "staff") {
              return {
                ...item,
                badge: { count: conciergeUnreadCount, tone: "gold" as const },
              };
            }
            if (role === "member") {
              return {
                ...item,
                badge: { count: conciergeUnreadCount, tone: "pink" as const },
              };
            }
          }

          // Events upcoming badge (member only)
          if (item.id === "events" && role === "member" && eventsUpcomingCount > 0) {
            return {
              ...item,
              badge: { count: eventsUpcomingCount, tone: "gold" as const },
            };
          }

          return item;
        }),
      })),
    [spec, role, conciergeUnreadCount, eventsUpcomingCount],
  );

  return (
    <>
      {mobileOpen && (
        <div
          aria-hidden
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`sidebar fixed z-50 flex h-screen w-[280px] shrink-0 flex-col overflow-hidden border-r border-accent/8 bg-[var(--sidebar-bg)] transition-transform duration-300 ease-in-out sm:w-[330px] lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="shrink-0 px-5 py-5">
          <div className="flex items-center justify-between gap-2">
            <Image
              src={isLightMode ? "/images/lightlogo.png" : "/images/logo.png"}
              alt="Toy Box"
              width={120}
              height={56}
              className="h-14 w-auto"
            />
            <div className="flex items-center gap-2">
              <div
                className={`font-roboto flex items-center justify-center rounded-md border px-3 py-1 text-[9px] leading-none tracking-[0.15em] ${spec.badge.className}`}
              >
                {spec.badge.label}
              </div>
              <button
                type="button"
                aria-label="Close menu"
                onClick={onMobileClose}
                className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-accent/10 text-secondary transition-colors hover:text-foreground lg:hidden"
              >
                ✕
              </button>
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
                isLightMode={isLightMode}
              />
            ))}
          </nav>
        </div>

        {role === "admin" ? (
          <SidebarProfileFooter profilePath={ADMIN_PROFILE_PATH} />
        ) : null}

        {spec.showShiftCard ? <StaffShiftCard /> : null}
      </aside>
    </>
  );
}
