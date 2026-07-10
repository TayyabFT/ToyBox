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
  { id: "diary", label: "Diary", href: `${MEMBER_BASE}/diary` },
  { id: "garage", label: "Garage", href: `${MEMBER_BASE}/garage` },
  { id: "events", label: "Events", href: `${MEMBER_BASE}/events`, badge: { count: 3, tone: "gold" } },
];

// Services section
export const memberServicesNav: MemberNavItem[] = [
  { id: "concierge", label: "Concierge", href: `${MEMBER_BASE}/concierge` },
  { id: "ask-steve", label: "Ask Steve", href: `${MEMBER_BASE}/ask-steve` },
];

// Account section
export const memberAccountNav: MemberNavItem[] = [
  { id: "profile", label: "Profile", href: `${MEMBER_BASE}/profile` },
  { id: "help", label: "Help & Support", href: `${MEMBER_BASE}/help` },
  { id: "terms-privacy", label: "Terms & Privacy", href: `${MEMBER_BASE}/terms-privacy` },
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
