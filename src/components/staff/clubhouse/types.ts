export type ClubhouseZoneFilter = "all" | "restaurant" | "lounge" | "suite";

export type ClubhouseReservationStatus = "confirmed" | "prep";

export type ClubhouseReservation = {
  id: string;
  time: string;
  memberName: string;
  memberInitial: string;
  memberNumber: string;
  avatarClass: string;
  zone: string;
  zoneFilter: Exclude<ClubhouseZoneFilter, "all">;
  pax: number;
  status: ClubhouseReservationStatus;
  statusDetail: string;
};

export type ClubhouseReservationsSummary = {
  confirmedCount: number;
  walkInCount: number;
  reservations: ClubhouseReservation[];
};
