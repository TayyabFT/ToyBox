import type {
  ClubhouseStatsDisplay,
  ClubhouseReservationsDisplay,
  ClubhouseVenuesDisplay,
} from "./types";

export const clubhouseStats: ClubhouseStatsDisplay = {
  onPremises: {
    label: "On premises",
    value: "14",
    subtext: "Members",
  },
  reservations: {
    label: "Reservations",
    value: "12",
    subtext: "Today",
  },
  fnbRevenue: {
    label: "F&B revenue",
    value: "AED 18.4K",
    subtext: "Today",
    trend: "+22%",
  },
  suiteOccupancy: {
    label: "Suite occupancy",
    value: "2/4",
    subtext: "Available . 2",
  },
};

export const clubhouseVenues: ClubhouseVenuesDisplay = [
  {
    id: "restaurant",
    href: "/admin/clubhouse/restaurant",
    title: {
      before: "The ",
      highlight: "Clubhouse",
      after: " Restaurant",
    },
    statusLabel: "Active",
    statusTone: "active",
    subtitle: "Lunch Service · 12:00 – 15:30",
    progressLabel: "Occupied",
    occupied: 24,
    capacity: 40,
    capacitySuffix: "Seats",
    details: [
      { label: "Reservations", value: "12" },
      { label: "WALK-INS", value: "3" },
      { label: "Private", value: "3", labelTone: "muted" },
    ],
  },
  {
    id: "lounge",
    title: {
      before: "Members' ",
      highlight: "Lounge",
    },
    statusLabel: "Quiet",
    statusTone: "quiet",
    subtitle: "Open All Day",
    progressLabel: "Present",
    occupied: 4,
    capacity: 16,
    details: [
      { label: "Cigar", value: "Davidoff curation" },
      { label: "Library", value: "3 in use" },
    ],
  },
  {
    id: "suites",
    title: {
      before: "Private ",
      highlight: "Suites",
    },
    statusLabel: "2 Prep",
    statusTone: "prep",
    subtitle: "4 Suites",
    progressLabel: "Occupied",
    occupied: 2,
    capacity: 4,
    details: [
      { label: "Suite 01", value: "Mr. Bashir" },
      { label: "Suite 02", value: "Al Mansoori (14:30 prep)" },
      { label: "Suite 03", value: "Available", labelTone: "muted" },
      { label: "Suite 04", value: "Available", labelTone: "muted" },
    ],
  },
];

export const clubhouseReservations: ClubhouseReservationsDisplay = {
  confirmedCount: 12,
  walkInCount: 3,
  rows: [
    {
      id: "res-1",
      time: "12:30",
      memberName: "Mr. Bashir",
      memberInitial: "B",
      memberNumber: "No. 0002847",
      zone: "Restaurant",
      party: 2,
      status: "confirmed",
      notes: "Window table - usual",
    },
    {
      id: "res-2",
      time: "13:00",
      memberName: "Mrs. Al Rashid",
      memberInitial: "A",
      memberNumber: "No. 0001024",
      zone: "Lounge",
      party: 4,
      status: "confirmed",
      notes: "Business lunch",
    },
    {
      id: "res-3",
      time: "14:30",
      memberName: "Mr. Al Mansoori",
      memberInitial: "A",
      memberNumber: "No. 0003156",
      zone: "Suite 02",
      party: 6,
      status: "prep",
      notes: "VIP - 1 guest",
    },
  ],
};
