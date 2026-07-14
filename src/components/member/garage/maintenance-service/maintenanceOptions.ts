import { SHORT_MONTHS } from "../shared/dateUtils";
import type {
  MaintenanceDateKey,
  MaintenanceServiceCentreKey,
  MaintenanceServiceTypeKey,
  MaintenanceTimeWindowKey,
  MaintenanceVehicleKey,
} from "./types";

export const MAINTENANCE_VEHICLES: {
  key: MaintenanceVehicleKey;
  label: string;
  reviewLabel: string;
}[] = [
  { key: "huracan-sto", label: "Huracán STO", reviewLabel: "Lamborghini Huracán STO" },
  { key: "911-gt3",     label: "911 GT3",     reviewLabel: "Porsche 911 GT3" },
  { key: "sf90",        label: "SF90",        reviewLabel: "Ferrari SF90" },
];

export const MAINTENANCE_SERVICE_TYPES: {
  key: MaintenanceServiceTypeKey;
  title: string;
  subtitle: string;
  confirmedLabel: string;
  trackingLabel: string;
}[] = [
  {
    key: "scheduled-annual",
    title: "Scheduled / Annual",
    subtitle: "Manufacturer-recommended service",
    confirmedLabel: "Scheduled/ Annual",
    trackingLabel: "ANNUAL SERVICE",
  },
  {
    key: "repair-fault",
    title: "Repair / Fault",
    subtitle: "Issue or warning light",
    confirmedLabel: "Repair/ Fault",
    trackingLabel: "REPAIR SERVICE",
  },
  {
    key: "tyres-brakes",
    title: "Tyres & Brakes",
    subtitle: "Replacement or inspection",
    confirmedLabel: "Tyres & Brakes",
    trackingLabel: "TYRES & BRAKES",
  },
  {
    key: "bodywork-paint",
    title: "Bodywork & Paint",
    subtitle: "Dents, scratches, repairs",
    confirmedLabel: "Bodywork & Paint",
    trackingLabel: "BODYWORK SERVICE",
  },
];

export const MAINTENANCE_SERVICE_CENTRES: {
  key: MaintenanceServiceCentreKey;
  title: string;
  subtitle: string;
  icon: "star" | "workshop";
  trackingLocation: string;
  trackingDetail: string;
}[] = [
  {
    key: "official-porsche",
    title: "Official Porsche Centre",
    subtitle: "Al Quoz, Dubai · Authorised",
    icon: "star",
    trackingLocation: "Official Porsche Centre · Al Quoz",
    trackingDetail: "Authorised dealer · Bay 7",
  },
  {
    key: "toybox-partner",
    title: "Toybox Partner Workshop",
    subtitle: "On-site · Toybox facility",
    icon: "workshop",
    trackingLocation: "Toybox Partner Workshop",
    trackingDetail: "On-site · Toybox facility",
  },
];

export const MAINTENANCE_TIME_OPTIONS: {
  key: MaintenanceTimeWindowKey;
  label: string;
  reviewLabel: string;
}[] = [
  { key: "morning",   label: "Morning · 8–12",   reviewLabel: "Morning · 8:00–12:00" },
  { key: "afternoon", label: "Afternoon · 12–5", reviewLabel: "Afternoon · 12:00–17:00" },
  { key: "evening",   label: "Evening · 5–8",    reviewLabel: "Evening · 17:00–20:00" },
  { key: "flexible",  label: "Flexible",          reviewLabel: "Flexible" },
];

// ── Lookup helpers ────────────────────────────────────────────────────────────

export function getMaintenanceVehicle(key: MaintenanceVehicleKey) {
  return MAINTENANCE_VEHICLES.find((v) => v.key === key) ?? MAINTENANCE_VEHICLES[1];
}

export function getMaintenanceServiceType(key: MaintenanceServiceTypeKey) {
  return MAINTENANCE_SERVICE_TYPES.find((t) => t.key === key) ?? MAINTENANCE_SERVICE_TYPES[0];
}

export function getMaintenanceServiceCentre(key: MaintenanceServiceCentreKey) {
  return MAINTENANCE_SERVICE_CENTRES.find((c) => c.key === key) ?? MAINTENANCE_SERVICE_CENTRES[0];
}

export function getMaintenanceTimeOption(key: MaintenanceTimeWindowKey) {
  return MAINTENANCE_TIME_OPTIONS.find((o) => o.key === key) ?? MAINTENANCE_TIME_OPTIONS[1];
}

// ── Date helpers ──────────────────────────────────────────────────────────────

function parseDateKey(key: MaintenanceDateKey): Date {
  const parsed = new Date(key);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

/** "Thursday, 1 May 2026" */
export function formatMaintenanceFullDate(key: MaintenanceDateKey): string {
  const d = parseDateKey(key);
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day:     "numeric",
    month:   "long",
    year:    "numeric",
  });
}

/** "1 May 2026" */
export function formatMaintenanceShortDate(key: MaintenanceDateKey): string {
  const d = parseDateKey(key);
  return `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

// ── Misc formatters ───────────────────────────────────────────────────────────

export function formatMaintenanceIssueNote(description: string): string {
  const normalized = description.trim();
  if (!normalized) return "No issue noted";
  return normalized.length > 42 ? `${normalized.slice(0, 39)}...` : normalized;
}

export function formatMaintenanceTrackingTitle(
  vehicleKey: MaintenanceVehicleKey,
  serviceTypeKey: MaintenanceServiceTypeKey,
): string {
  const vehicle     = getMaintenanceVehicle(vehicleKey);
  const serviceType = getMaintenanceServiceType(serviceTypeKey);
  return `${vehicle.label} — ${serviceType.trackingLabel}`;
}

export function formatMaintenanceTrackingTime(timeKey: MaintenanceTimeWindowKey): string {
  const option = getMaintenanceTimeOption(timeKey);
  const match  = option.reviewLabel.match(/·\s*(.+)$/);
  return match?.[1] ?? option.reviewLabel;
}

export function resolveDefaultMaintenanceVehicle(
  _vehicleId: string,
): MaintenanceVehicleKey {
  return "911-gt3";
}
