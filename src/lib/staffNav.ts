export const STAFF_BASE = "/staff";

export type StaffNavBadgeTone = "gold" | "pink" | "teal";

export type StaffNavItem = {
  id: string;
  label: string;
  href: string;
  section: "operations" | "management";
  badge?: { count: number; tone: StaffNavBadgeTone };
};

export const staffOperationsNav: StaffNavItem[] = [
  {
    id: "overview",
    label: "Overview",
    href: `${STAFF_BASE}/overview`,
    section: "operations",
  },
  {
    id: "bookings",
    label: "Bookings",
    href: `${STAFF_BASE}/bookings`,
    section: "operations",
  },
  {
    id: "inspections",
    label: "Inspections",
    href: `${STAFF_BASE}/inspections`,
    section: "operations",
    badge: { count: 4, tone: "gold" },
  },
  {
    id: "health-reports",
    label: "Health Reports",
    href: `${STAFF_BASE}/health-reports`,
    section: "operations",
  },
  {
    id: "service-requests",
    label: "Service Requests",
    href: `${STAFF_BASE}/service-requests`,
    section: "operations",
    badge: { count: 3, tone: "pink" },
  },
  {
    id: "photo-uploads",
    label: "Photo Uploads",
    href: `${STAFF_BASE}/photo-uploads`,
    section: "operations",
    badge: { count: 6, tone: "teal" },
  },
  {
    id: "clubhouse",
    label: "Club House",
    href: `${STAFF_BASE}/clubhouse`,
    section: "management",
  },
];

export const staffManagementNav: StaffNavItem[] = [
  {
    id: "vehicles",
    label: "Vehicles",
    href: `${STAFF_BASE}/vehicles`,
    section: "management",
  },
  {
    id: "parking",
    label: "Parking",
    href: `${STAFF_BASE}/parking`,
    section: "management",
  },
  {
    id: "concierge",
    label: "Concierge",
    href: `${STAFF_BASE}/concierge`,
    section: "management",
  },
  {
    id: "op-updates",
    label: "Op. Updates",
    href: `${STAFF_BASE}/op-updates`,
    section: "management",
  },
];

export const staffNavItems: StaffNavItem[] = [
  ...staffOperationsNav,
  ...staffManagementNav,
];

export function isStaffNavActive(pathname: string, href: string): boolean {
  if (href === `${STAFF_BASE}/overview`) {
    return pathname === STAFF_BASE || pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getActiveStaffNavItem(pathname: string): StaffNavItem | null {
  return (
    staffNavItems.find((item) => isStaffNavActive(pathname, item.href)) ?? null
  );
}

export function getStaffPageTitle(pathname: string): string {
  return getActiveStaffNavItem(pathname)?.label ?? "Overview";
}
