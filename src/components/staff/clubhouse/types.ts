export type ClubhouseZoneFilter = "all" | "restaurant" | "lounge" | "suite";

export type ClubhouseReservationStatus =
  | "confirmed"
  | "pending"
  | "prep"
  | "cancelled";

export type ClubhouseZoneTab = {
  id: ClubhouseZoneFilter;
  label: string;
};

export type ClubhouseSummaryDisplay = {
  dateLabel: string;
  shiftLabel: string;
  confirmedCount: number;
  walkInCount: number;
  pendingCount: number;
  prepCount: number;
  zoneTabs: ClubhouseZoneTab[];
};

export type ClubhouseReservation = {
  id: string;
  time: string;
  memberName: string;
  memberInitial: string;
  memberNumber: string;
  memberTier: string;
  avatarClass: string;
  zone: string;
  zoneFilter: Exclude<ClubhouseZoneFilter, "all">;
  venueTitle: string;
  pax: number;
  date: string;
  dateTime: string;
  occasion: string;
  specialRequests: string;
  arrivalNote: string;
  status: ClubhouseReservationStatus;
  statusDetail: string;
  confirmedBy?: string;
  confirmedAt?: string;
};

export function isPendingReservation(status: ClubhouseReservationStatus) {
  return status === "pending";
}

export function isActionableReservation(status: ClubhouseReservationStatus) {
  return status !== "cancelled";
}
