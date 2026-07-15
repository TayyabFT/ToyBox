import type {
  StaffAssignedVehicleDetailRaw,
  StaffAssignedVehicleRaw,
  StaffAssignedVehiclesData,
  StaffVehicleHealthEntryRaw,
  StaffVehicleSummaryData,
} from "@/types/api";
import type {
  HealthMetric,
  VehicleDetail,
  VehicleListItem,
  VehicleStatsDisplay,
} from "@/components/staff/vehicles/types";
import { vehicleStats } from "@/components/staff/vehicles/mockData";
import { createEmptyVehicleStats, mapVehicleStatus } from "@/lib/vehicles";

function healthTone(value: number): HealthMetric["tone"] {
  if (value < 50) return "pink";
  if (value < 75) return "gold";
  return "teal";
}

function resolveVehicleName(
  vehicle: Pick<StaffAssignedVehicleRaw, "displayName" | "make" | "model">,
): string {
  const displayName = vehicle.displayName?.trim();
  if (displayName) return displayName;

  const makeModel = [vehicle.make?.trim(), vehicle.model?.trim()]
    .filter(Boolean)
    .join(" ")
    .trim();

  return makeModel || "Unknown Vehicle";
}

function formatMileage(raw: string | undefined, unit: "KM" | "km"): string {
  const value = raw?.trim();
  if (!value) return "—";

  return `${value.replace(/\s*km$/i, "").trim()} ${unit}`;
}

export function mapStaffVehicleSummary(
  data: StaffVehicleSummaryData | null | undefined,
): VehicleStatsDisplay {
  if (!data) {
    return createEmptyVehicleStats();
  }

  const readyPercent = data.ready?.percentOfFleet;

  return {
    total: {
      label: data.total?.label?.trim() || vehicleStats.total.label,
      value: String(data.total?.value ?? 0),
      subtext: data.total?.subLabel?.trim() || vehicleStats.total.subtext,
    },
    ready: {
      label: data.ready?.label?.trim() || vehicleStats.ready.label,
      value: String(data.ready?.value ?? 0),
      subtext:
        typeof readyPercent === "number"
          ? `${readyPercent}% OF FLEET`
          : vehicleStats.ready.subtext,
    },
    inService: {
      label: data.inService?.label?.trim() || vehicleStats.inService.label,
      value: String(data.inService?.value ?? 0),
      subtext:
        data.inService?.subLabel?.trim() || vehicleStats.inService.subtext,
    },
    overdue: {
      label: data.overdue?.label?.trim() || vehicleStats.overdue.label,
      value: String(data.overdue?.value ?? 0),
      subtext: data.overdue?.subLabel?.trim() || vehicleStats.overdue.subtext,
    },
  };
}

export function mapStaffAssignedVehicle(
  item: StaffAssignedVehicleRaw,
): VehicleListItem | null {
  if (!item.id) {
    return null;
  }

  return {
    id: item.id,
    name: resolveVehicleName(item).toUpperCase(),
    bay: item.bay?.trim() || "—",
    member: item.ownerName?.trim().toUpperCase() || "—",
    mileage: formatMileage(item.mileage, "KM"),
    status: mapVehicleStatus(item.statusKey || item.statusLabel),
  };
}

export function mapStaffAssignedVehicles(
  data: StaffAssignedVehiclesData | null | undefined,
): VehicleListItem[] {
  return (data?.items ?? [])
    .map(mapStaffAssignedVehicle)
    .filter((item): item is VehicleListItem => item !== null);
}

function mapHealthEntries(
  entries: StaffVehicleHealthEntryRaw[] | undefined,
): HealthMetric[] {
  return (entries ?? []).map((entry) => {
    const value = entry.percentage ?? 0;

    return {
      label:
        entry.label?.trim() ||
        entry.key?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ||
        "Health",
      value,
      tone: healthTone(value),
    };
  });
}

export function mapStaffAssignedVehicleDetail(
  data: StaffAssignedVehicleDetailRaw | null | undefined,
): VehicleDetail | null {
  if (!data?.id) {
    return null;
  }

  const memberName = data.member?.name?.trim() || data.ownerName?.trim() || "—";
  const tier = data.member?.tier?.trim();
  const isOverdue =
    Boolean(data.isOverdue) ||
    (data.statusKey?.toLowerCase().includes("overdue") ?? false);

  return {
    id: data.id,
    name: resolveVehicleName(data).toUpperCase(),
    bay: data.bay?.trim() || "—",
    mileage: formatMileage(data.mileage, "km"),
    member: memberName,
    memberBadge: tier ? tier.toUpperCase() : undefined,
    imageUrl: data.imageUrl?.trim() || undefined,
    notes: [],
    isOverdue,
    health: mapHealthEntries(data.health?.systemHealth),
    condition: mapHealthEntries(data.health?.condition),
    serviceHistory: [],
  };
}
