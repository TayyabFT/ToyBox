export type ClubhouseStatItem = {
  label: string;
  value: string;
  subtext: string;
  trend?: string;
};

export type ClubhouseStatsDisplay = {
  onPremises: ClubhouseStatItem;
  reservations: ClubhouseStatItem;
  fnbRevenue: ClubhouseStatItem;
  suiteOccupancy: ClubhouseStatItem;
};

export type ClubhouseVenueStatusTone = "active" | "quiet" | "prep";

export type ClubhouseVenueDetail = {
  label: string;
  value: string;
  labelTone?: "gold" | "muted";
};

export type ClubhouseVenueTitle = {
  before?: string;
  highlight: string;
  after?: string;
};

export type ClubhouseVenueCard = {
  id: string;
  title: ClubhouseVenueTitle;
  statusLabel: string;
  statusTone: ClubhouseVenueStatusTone;
  subtitle: string;
  occupied: number;
  capacity: number;
  details: ClubhouseVenueDetail[];
  href?: string;
};

export type ClubhouseVenuesDisplay = ClubhouseVenueCard[];

export type ClubhouseReservationStatus = "confirmed" | "prep" | "pending";

export type ClubhouseReservationRow = {
  id: string;
  time: string;
  memberName: string;
  memberInitial: string;
  memberNumber: string;
  zone: string;
  party: number;
  status: ClubhouseReservationStatus;
  statusLabel?: string;
  notes: string;
};

export type ClubhouseReservationsDisplay = {
  confirmedCount: number;
  walkInCount: number;
  summaryLabel?: string;
  rows: ClubhouseReservationRow[];
};
