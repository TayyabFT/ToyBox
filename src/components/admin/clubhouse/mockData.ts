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
    title: { highlight: "Restaurant" },
    statusLabel: "0% Occupied",
    statusTone: "quiet",
    subtitle: "2 Categories · 104 Total",
    occupied: 0,
    capacity: 0,
    details: [
      { label: "Restaurant reservations", value: "0/0" },
      { label: "Private dining", value: "0/0" },
    ],
  },
  {
    id: "private_lounge",
    title: { highlight: "Private Lounge" },
    statusLabel: "0% Occupied",
    statusTone: "quiet",
    subtitle: "3 Categories · 42 Total",
    occupied: 0,
    capacity: 0,
    details: [
      { label: "Faraday Room", value: "0/0" },
      { label: "General lounge areas", value: "0/0" },
      { label: "Cigar rooms", value: "0/0" },
    ],
  },
  {
    id: "suite_lounge",
    title: { highlight: "Suite Lounge" },
    statusLabel: "0% Occupied",
    statusTone: "quiet",
    subtitle: "3 Categories · 66 Total",
    occupied: 0,
    capacity: 0,
    details: [
      { label: "Private offices", value: "0/0" },
      { label: "Conference rooms", value: "0/0" },
      { label: "Executive suites", value: "0/0" },
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
