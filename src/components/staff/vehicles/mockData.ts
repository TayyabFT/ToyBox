import type { VehicleDetail } from "./types";

export const vehicleStats = {
  total: { label: "Total", value: "287", subtext: "ALL STORED VEHICLES" },
  ready: { label: "Ready", value: "251", subtext: "87.5% OF FLEET" },
  inService: { label: "In Service", value: "28", subtext: "WORKSHOP + DETAILING" },
  overdue: { label: "Overdue Service", value: "8", subtext: "NEEDS ACTION" },
};

export const vehicleDetails: Record<string, VehicleDetail> = {
  "ferrari-296": {
    id: "ferrari-296",
    name: "FERRARI 296 GTS",
    bay: "A-05",
    mileage: "41,200 km",
    member: "Khalid Al Mansoori",
    memberBadge: "FOUNDING",
    isOverdue: true,
    health: [
      { label: "Engine & Drive", value: 38, tone: "pink" },
      { label: "Tyres", value: 55, tone: "gold" },
      { label: "Brakes", value: 44, tone: "pink" },
      { label: "Battery", value: 82, tone: "teal" },
    ],
    condition: [
      { label: "Exterior & Body", value: 90, tone: "teal" },
      { label: "Interior", value: 88, tone: "teal" },
      { label: "Fluids", value: 60, tone: "gold" },
      { label: "Electronics", value: 75, tone: "teal" },
    ],
    serviceHistory: [
      {
        id: "1",
        date: "12 JAN 2026",
        title: "ANNUAL SERVICE",
        location: "FERRARI CENTRE",
        detail: "AED 8,200 • 38,800 km",
      },
      {
        id: "2",
        date: "03 NOV 2025",
        title: "FULL DETAIL",
        location: "TOYBOX DETAILING",
        detail: "AED 2,400 • 36,100 km",
      },
      {
        id: "3",
        date: "18 AUG 2025",
        title: "TYRE REPLACEMENT",
        location: "PIRELLI FITMENT",
        detail: "AED 6,800 • 32,400 km",
      },
    ],
  },
};
