export const MEMBER_BASE = "/member";

export type MemberNavBadgeTone = "gold" | "pink" | "teal";

export type MemberNavItem = {
  id: string;
  label: string;
  href: string;
  badge?: { count: number; tone: MemberNavBadgeTone };
};

// Menu section
export const memberNav: MemberNavItem[] = [
  { id: "overview", label: "Home", href: MEMBER_BASE },
  { id: "garage", label: "Garage", href: `${MEMBER_BASE}/vehicles` },
  { id: "events", label: "Events", href: `${MEMBER_BASE}/events`, badge: { count: 3, tone: "gold" } },
  { id: "marketplace", label: "Marketplace", href: `${MEMBER_BASE}/marketplace`, badge: { count: 4, tone: "teal" } },
];

// Services section
export const memberServicesNav: MemberNavItem[] = [
  { id: "concierge", label: "Concierge", href: `${MEMBER_BASE}/concierge`, badge: { count: 1, tone: "pink" } },
  { id: "hub-store", label: "Hub Store", href: `${MEMBER_BASE}/hub-store`, badge: { count: 2, tone: "gold" } },
];

// Account section
export const memberAccountNav: MemberNavItem[] = [
  { id: "profile", label: "Profile", href: `${MEMBER_BASE}/profile` },
  { id: "help", label: "Help & Support", href: `${MEMBER_BASE}/help` },
];

// All nav items combined — used for page title resolution
export const allMemberNavItems: MemberNavItem[] = [
  ...memberNav,
  ...memberServicesNav,
  ...memberAccountNav,
];

export function isMemberNavActive(pathname: string, href: string): boolean {
  if (href === MEMBER_BASE) {
    return pathname === MEMBER_BASE;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getMemberPageTitle(pathname: string): string {
  return (
    allMemberNavItems.find((item) => isMemberNavActive(pathname, item.href))?.label ??
    "Home"
  );
}
