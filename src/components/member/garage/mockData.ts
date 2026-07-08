import type { GarageFilter, GarageVehicle } from "./types";

export const garageVehicles: GarageVehicle[] = [
  {
    id: "1",
    make: "Bentley",
    model: "Continental GT Speed",
    detail: "2023 · W12 Mulliner Edition",
    imageUrl:
      "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800&q=80",
    era: "modern",
    statusTone: "ready",
    statusLabel: "Ready",
    stats: [
      { value: "8,412", label: "Miles" },
      { value: "12mo", label: "Service" },
      { value: "47/47", label: "Inspected" },
    ],
    lastInspectedLabel: "Last inspected",
    lastInspectedValue: "06:14 today",
  },
  {
    id: "2",
    make: "Rolls-Royce",
    model: "Ghost Black Badge",
    detail: "2024 · V12 Extended Wheelbase",
    imageUrl:
      "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800&q=80",
    era: "modern",
    statusTone: "ready",
    bayLabel: "Bay 02 · B",
    stats: [
      { value: "12,847", label: "Miles" },
      { value: "9mo", label: "Service" },
      { value: "47/47", label: "Inspected" },
    ],
    lastInspectedLabel: "Last inspected",
    lastInspectedValue: "05:48 today",
  },
];

export const garageFilters: GarageFilter[] = [
  { key: "all", label: "All", count: garageVehicles.length },
  {
    key: "ready",
    label: "Ready",
    count: garageVehicles.filter((v) => v.statusTone === "ready").length,
  },
  {
    key: "in_service",
    label: "In Service",
    count: garageVehicles.filter((v) => v.statusTone === "in_service").length,
  },
  { key: "away", label: "Away" },
  { key: "modern", label: "Modern" },
  { key: "classic", label: "Classic" },
];
