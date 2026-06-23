export const ADMIN_BASE = "/admin";

export type AdminNavBadgeTone = "gold" | "pink" | "teal";

export type AdminNavChildItem = {
  id: string;
  label: string;
  href: string;
  icon?: string;
};

export type AdminNavItem = {
  id: string;
  label: string;
  href: string;
  section: "operations" | "manage";
  badge?: { count: number; tone: AdminNavBadgeTone };
  children?: AdminNavChildItem[];
};

export const adminOperationsNav: AdminNavItem[] = [
  {
    id: "overview",
    label: "Overview",
    href: `${ADMIN_BASE}/overview`,
    section: "operations",
  },
  {
    id: "members",
    label: "Members",
    href: `${ADMIN_BASE}/members`,
    section: "operations",
    badge: { count: 142, tone: "gold" },
  },
  {
    id: "staff",
    label: "Staff",
    href: `${ADMIN_BASE}/staff`,
    section: "operations",
  },
  {
    id: "vehicles",
    label: "Vehicles",
    href: `${ADMIN_BASE}/vehicles`,
    section: "operations",
    badge: { count: 287, tone: "gold" },
  },
  {
    id: "concierge",
    label: "Concierge",
    href: `${ADMIN_BASE}/concierge`,
    section: "operations",
  },
  {
    id: "bookings",
    label: "Bookings",
    href: `${ADMIN_BASE}/bookings`,
    section: "operations",
    badge: { count: 5, tone: "gold" },
  },
  {
    id: "service-requests",
    label: "Service Requests",
    href: `${ADMIN_BASE}/service-requests`,
    section: "operations",
  },
  {
    id: "events",
    label: "Events",
    href: `${ADMIN_BASE}/events`,
    section: "operations",
    badge: { count: 12, tone: "gold" },
  },
  {
    id: "clubhouse",
    label: "Clubhouse",
    href: `${ADMIN_BASE}/clubhouse`,
    section: "operations",
  },
  {
    id: "workshop",
    label: "Workshop",
    href: `${ADMIN_BASE}/workshop`,
    section: "operations",
    badge: { count: 5, tone: "gold" },
  },
];

export const adminManageNav: AdminNavItem[] = [
  {
    id: "communications",
    label: "Communications",
    href: `${ADMIN_BASE}/communications`,
    section: "manage",
  },
  {
    id: "finance",
    label: "Finance",
    href: `${ADMIN_BASE}/finance`,
    section: "manage",
  },
  {
    id: "analytics",
    label: "Analytics",
    href: `${ADMIN_BASE}/analytics`,
    section: "manage",
  },
];

export const adminNavItems: AdminNavItem[] = [
  ...adminOperationsNav,
  ...adminManageNav,
];

export function isAdminNavActive(pathname: string, href: string): boolean {
  if (href === `${ADMIN_BASE}/overview`) {
    return pathname === ADMIN_BASE || pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getActiveAdminNavItem(pathname: string): AdminNavItem | null {
  return (
    adminNavItems.find((item) => isAdminNavActive(pathname, item.href)) ?? null
  );
}

export function getAdminPageTitle(pathname: string): string {
  return getActiveAdminNavItem(pathname)?.label ?? "Overview";
}
