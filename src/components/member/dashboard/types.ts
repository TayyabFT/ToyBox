export type MemberVehicleItem = {
  id: string;
  name: string;
  plate: string;
  status: "ready" | "in_service" | "scheduled" | string;
  statusLabel: string;
  imageUrl?: string;
  lastService?: string;
  mileage?: string;
  // New fields for Figma design
  year?: string;
  engine?: string;
  bay?: string;
  odometer?: string;
  inspected?: string;
  returns?: string;
  engineer?: string;
};

export type MemberDiaryEvent = {
  id: string;
  title: string;
  location: string;
  dateLabel: string;
  monthLabel: string;
  dayLabel: string;
  dayName?: string;       // e.g. "SUN", "TUE", "MAY"
  dateShort?: string;     // e.g. "SAT 26 APR"
  time?: string;          // e.g. "19:00"
  membersCount?: number;  // e.g. 12
  attendingCount?: number;// e.g. 18
  attendingMembers?: { name: string; initial: string }[];
  userStatus?: "going" | "rsvp" | null;
  tag: string;
  tagTone: "gold" | "teal" | "pink";
  imageUrl?: string;
  isFeatured?: boolean;
  status: string;
};

export type MemberClubVenue = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  tag?: string;
  tagTone?: "gold" | "teal" | "pink";
  iconKey?: "clubhouse" | "lounge" | "suites";
  footerLeft?: string;
  actionLabel?: string;
  href?: string;
};

export type MemberNewsItem = {
  id: string;
  title: string;
  titlePrefix?: string;
  titleHighlight?: string;
  subtitle: string;
  timeLabel: string;
  category?: string;
  isUnread?: boolean;
  imageUrl?: string;
};

export type MemberActivityItem = {
  id: string;
  title: string;
  titlePrefix?: string;
  titleHighlight?: string;
  detail: string;
  timeLabel: string;
  tone?: "gold" | "teal" | "pink" | "default";
};

export type MemberKpi = {
  label: string;
  value: string;
  subtext: string;
  iconKey: "vehicles" | "requests" | "events" | "days";
  tone?: "gold" | "default";
};

export type MemberDashboardData = {
  memberName: string;
  memberNumber: string;
  membershipTier: string;
  memberSince: string;
  kpis: MemberKpi[];
  vehicles: MemberVehicleItem[];
  diary: MemberDiaryEvent[];
  clubStatusLine?: string;
  clubVenues: MemberClubVenue[];
  news: MemberNewsItem[];
  recentActivity: MemberActivityItem[];
};
