export type MemberVehicleItem = {
  id: string;
  name: string;
  plate: string;
  status: "ready" | "in_service" | "scheduled" | string;
  statusLabel: string;
  imageUrl?: string;
  lastService?: string;
  mileage?: string;
};

export type MemberDiaryEvent = {
  id: string;
  title: string;
  location: string;
  dateLabel: string;
  monthLabel: string;
  dayLabel: string;
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
};

export type MemberNewsItem = {
  id: string;
  title: string;
  subtitle: string;
  timeLabel: string;
  imageUrl?: string;
};

export type MemberActivityItem = {
  id: string;
  title: string;
  detail: string;
  timeLabel: string;
  tone: "gold" | "teal" | "pink" | "default";
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
  clubVenues: MemberClubVenue[];
  news: MemberNewsItem[];
  recentActivity: MemberActivityItem[];
};
