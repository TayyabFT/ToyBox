export const MEMBER_BASE = "/member";

export type MemberNavBadgeTone = "gold" | "pink" | "teal";

export type MemberNavItem = {
  id: string;
  label: string;
  href: string;
  badge?: { count: number; tone: MemberNavBadgeTone };
};

export const memberNav: MemberNavItem[] = [
  { id: "overview", label: "Overview", href: MEMBER_BASE },
  { id: "vehicles", label: "My Vehicles", href: `${MEMBER_BASE}/vehicles` },
  { id: "events", label: "Events", href: `${MEMBER_BASE}/events` },
  { id: "concierge", label: "Concierge", href: `${MEMBER_BASE}/concierge` },
];

export function isMemberNavActive(pathname: string, href: string): boolean {
  if (href === MEMBER_BASE) {
    return pathname === MEMBER_BASE;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getMemberPageTitle(pathname: string): string {
  return (
    memberNav.find((item) => isMemberNavActive(pathname, item.href))?.label ??
    "Overview"
  );
}
