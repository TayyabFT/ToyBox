import { vehicleStats } from "@/components/admin/vehicles/mockData";
import type {
  AdminVehiclesPageData,
  BayMapDisplay,
  BaySlot,
  BayStatus,
  OperationStatus,
  VehicleDocumentLink,
  VehicleHealthItem,
  VehicleOperationRow,
  VehicleProfileDetail,
  VehicleStatItem,
  VehiclesStatsDisplay,
} from "@/components/admin/vehicles/types";
import type {
  AdminVehicleBayRaw,
  AdminVehicleDashboardStat,
  AdminVehicleDashboardSummary,
  AdminVehicleDetailRaw,
  AdminVehicleDocuments,
  AdminVehicleDocumentValue,
  AdminVehicleHealthItem,
  AdminVehicleOperationRaw,
  AdminVehiclesData,
} from "@/types/api";

function formatStatValue(stat: AdminVehicleDashboardStat): string {
  if (stat.displayValue?.trim()) {
    return stat.displayValue.trim();
  }

  if (stat.value === undefined || stat.value === null) {
    return "0";
  }

  return String(stat.value);
}

function formatTrend(stat: AdminVehicleDashboardStat): string | undefined {
  const trend = stat.trend?.displayValue?.trim();

  if (trend) {
    return trend.replace(/^\^/, "");
  }

  if (stat.trend?.value !== undefined) {
    return `+${stat.trend.value}`;
  }

  return undefined;
}

function mapDashboardStat(
  stat: AdminVehicleDashboardStat | undefined,
  fallback: VehicleStatItem,
): VehicleStatItem {
  if (!stat) {
    return fallback;
  }

  const subtext =
    stat.ratio?.displayValue?.trim() ||
    stat.subLabel?.trim() ||
    fallback.subtext;

  return {
    label: stat.label?.trim() || fallback.label,
    value: formatStatValue(stat),
    subtext,
    trend: formatTrend(stat),
    summaryKey: stat.key?.trim() || fallback.summaryKey,
  };
}

export function mapVehiclesDashboard(
  data: unknown,
): VehiclesStatsDisplay | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;
  const summary = (record.dashboardSummary ?? data) as AdminVehicleDashboardSummary;

  if (
    !summary.totalVehicles &&
    !summary.inStorage &&
    !summary.inService &&
    !summary.bayUtilization
  ) {
    return null;
  }

  return {
    totalVehicles: mapDashboardStat(
      summary.totalVehicles,
      vehicleStats.totalVehicles,
    ),
    inStorage: mapDashboardStat(summary.inStorage, vehicleStats.inStorage),
    inService: mapDashboardStat(summary.inService, vehicleStats.inService),
    bayUtilization: mapDashboardStat(
      summary.bayUtilization,
      vehicleStats.bayUtilization,
    ),
  };
}

export function createEmptyVehicleStats(): VehiclesStatsDisplay {
  return {
    totalVehicles: {
      label: "TOTAL VEHICLES",
      value: "0",
      subtext: "ACTIVE",
    },
    inStorage: {
      label: "IN STORAGE",
      value: "0",
      subtext: "WORKSHOP",
      summaryKey: "in_storage",
    },
    inService: {
      label: "IN SERVICE",
      value: "0",
      subtext: "SERVICE WINDOW",
      summaryKey: "in_service",
    },
    bayUtilization: {
      label: "BAY UTILIZATION",
      value: "0%",
      subtext: "0 / 0",
    },
  };
}

function mapBayStatus(bay: AdminVehicleBayRaw): BayStatus {
  if (!bay.occupied) {
    return "empty";
  }

  const key = bay.statusKey?.trim().toLowerCase().replace(/-/g, "_") ?? "";

  if (key.includes("overdue")) return "overdue";
  if (key.includes("service")) return "service";
  if (key.includes("away")) return "away";

  return "occupied";
}

function mapBaySlot(bay: AdminVehicleBayRaw): BaySlot {
  const label = bay.label?.trim() || bay.id?.trim() || "—";
  const name =
    bay.vehicleName?.trim() ||
    bay.displayName?.trim() ||
    (bay.occupied ? "" : "");

  return {
    bay: label,
    name,
    status: mapBayStatus(bay),
  };
}

export function mapBayMap(data: unknown): BayMapDisplay {
  const record =
    data && typeof data === "object" ? (data as AdminVehiclesData) : {};
  const bayMap = record.bayMap;
  const level = bayMap?.level?.trim() || "01";
  const levelLabel = bayMap?.label?.trim() || `Level ${level}`;

  return {
    level,
    levelLabel,
    bays: (bayMap?.bays ?? []).map(mapBaySlot),
  };
}

function getInitial(name: string): string {
  const trimmed = name.trim();

  if (!trimmed || trimmed === "—") {
    return "?";
  }

  return trimmed.charAt(0).toUpperCase();
}

function asDisplayString(value?: string | number | null): string {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
}

function mapOperationStatus(
  statusLabel?: string,
  statusKey?: string,
): OperationStatus {
  const normalized = `${statusKey ?? ""} ${statusLabel ?? ""}`
    .trim()
    .toLowerCase()
    .replace(/_/g, " ");

  if (normalized.includes("overdue")) return "overdue";
  if (normalized.includes("service")) return "in-service";
  return "ready";
}

function splitVehicleName(displayName: string): { make: string; model: string } {
  const trimmed = displayName.trim();

  if (!trimmed) {
    return { make: "—", model: "" };
  }

  const parts = trimmed.split(/\s+/);

  if (parts.length === 1) {
    return { make: parts[0], model: "" };
  }

  return {
    make: parts[0],
    model: parts.slice(1).join(" "),
  };
}

function mapLastActivity(
  lastActivity: AdminVehicleOperationRaw["lastActivity"],
): string {
  if (!lastActivity) return "—";

  if (typeof lastActivity === "string") {
    return lastActivity.trim() || "—";
  }

  return lastActivity.label?.trim() || "—";
}

export function mapVehicleOperation(
  op: AdminVehicleOperationRaw,
): VehicleOperationRow | null {
  if (op.id === undefined || op.id === null) {
    return null;
  }

  const memberName = op.member?.name?.trim() || "—";
  const vehicle = op.vehicle;
  const displayName =
    vehicle?.displayName?.trim() ||
    [vehicle?.make, vehicle?.model].filter(Boolean).join(" ").trim() ||
    "—";
  const { make, model } =
    vehicle?.make || vehicle?.model
      ? {
          make: vehicle.make?.trim() || "—",
          model: vehicle.model?.trim() || "",
        }
      : splitVehicleName(displayName);

  const memberNo = op.member?.memberNumber?.trim() || String(op.member?.id ?? "—");

  return {
    id: String(op.id),
    vehicleId:
      vehicle?.id !== undefined && vehicle?.id !== null
        ? String(vehicle.id)
        : "",
    bay: op.bay?.trim() || "—",
    initial: getInitial(memberName),
    member: memberName,
    memberNo,
    profileImageUrl: op.member?.profileImageUrl?.trim() ?? "",
    make,
    model,
    status: mapOperationStatus(op.statusLabel, op.statusKey),
    statusLabel: op.statusLabel?.trim() || "—",
    lastActivity: mapLastActivity(op.lastActivity),
  };
}

export function mapAdminVehiclesPage(data: unknown): AdminVehiclesPageData {
  const record =
    data && typeof data === "object" ? (data as AdminVehiclesData) : {};

  const operations = (record.operations ?? [])
    .map(mapVehicleOperation)
    .filter((row): row is VehicleOperationRow => row !== null);

  return {
    stats: mapVehiclesDashboard(record) ?? createEmptyVehicleStats(),
    bayMap: mapBayMap(record),
    operations,
    total: typeof record.total === "number" ? record.total : operations.length,
    limit: typeof record.limit === "number" ? record.limit : 50,
    offset: typeof record.offset === "number" ? record.offset : 0,
  };
}

export const OPERATION_FILTER_TO_SUMMARY_KEY: Record<
  "all" | OperationStatus,
  string | undefined
> = {
  all: undefined,
  overdue: "overdue_service",
  "in-service": "in_service",
  ready: "ready",
};

const healthCategoryLabels: Record<string, string> = {
  engine_drivetrain: "Engine & Drive",
  tyres: "Tyres",
  brakes: "Brakes",
  fluids: "Fluids",
  battery: "Battery",
  exterior_body: "Exterior & Body",
};

const documentLabels: Record<keyof AdminVehicleDocuments, string> = {
  specsAndInfo: "Specs & Info",
  serviceRecord: "Service Record",
  purchasedInvoice: "Purchase Invoice",
  vehicleRegistration: "Vehicle Registration",
  warrantyCertificate: "Warranty Certificate",
  insuranceCertificate: "Insurance Certificate",
};

function healthTone(value: number): VehicleHealthItem["tone"] {
  if (value < 50) return "pink";
  if (value < 75) return "gold";
  return "teal";
}

function mapHealthItem(item: AdminVehicleHealthItem): VehicleHealthItem {
  const value = item.percentage ?? 0;
  const label =
    healthCategoryLabels[item.category ?? ""] ??
    item.category?.replace(/_/g, " ") ??
    "Health";

  return {
    label: label.replace(/\b\w/g, (char) => char.toUpperCase()),
    value,
    note: item.note?.trim() || "—",
    tone: healthTone(value),
  };
}

function resolveDocumentUrl(
  value?: AdminVehicleDocumentValue,
): string {
  if (!value) return "";

  if (typeof value === "string") {
    return value.trim();
  }

  return value.url?.trim() ?? "";
}

function mapDocuments(documents?: AdminVehicleDocuments): VehicleDocumentLink[] {
  if (!documents) return [];

  return (Object.keys(documentLabels) as (keyof AdminVehicleDocuments)[])
    .map((key) => {
      const url = resolveDocumentUrl(documents[key]);

      if (!url) return null;

      return {
        label: documentLabels[key],
        url,
      };
    })
    .filter((item): item is VehicleDocumentLink => item !== null);
}

function mapDetailLastActivity(
  lastActivity: AdminVehicleDetailRaw["lastActivity"],
): string {
  if (!lastActivity) return "—";

  if (typeof lastActivity === "string") {
    return lastActivity.trim() || "—";
  }

  return lastActivity.label?.trim() || "—";
}

export function mapAdminVehicleProfile(
  data: AdminVehicleDetailRaw | undefined,
): VehicleProfileDetail | null {
  if (!data || data.id === undefined || data.id === null) {
    return null;
  }

  const memberName =
    asDisplayString(data.member?.name) ||
    asDisplayString(data.ownerName) ||
    (data.ownershipType?.trim().toLowerCase() === "inventory"
      ? "Unassigned"
      : "—");
  const displayName =
    data.displayName?.trim() ||
    [data.make, data.model].filter(Boolean).join(" ").trim() ||
    "—";
  const memberId =
    asDisplayString(data.memberId) || asDisplayString(data.member?.id);

  return {
    id: String(data.id),
    displayName,
    make: data.make?.trim() || "—",
    model: data.model?.trim() || "",
    year: data.year !== undefined && data.year !== null ? String(data.year) : "—",
    imageUrl: data.imageUrl?.trim() ?? "",
    storageBay: data.storageBay?.trim() || "—",
    ownerName: asDisplayString(data.ownerName) || memberName,
    memberId: memberId || "—",
    memberName,
    memberInitial: getInitial(memberName),
    memberProfileImageUrl: data.member?.profileImageUrl?.trim() ?? "",
    mileage: data.mileage?.trim() || "—",
    status: data.status?.trim() || "—",
    statusLabel: data.statusLabel?.trim() || data.status?.trim() || "—",
    statusKey: data.statusKey?.trim() || "",
    isOverdueService: Boolean(data.isOverdueService),
    ownershipType: data.ownershipType?.trim() || "—",
    isPriority: Boolean(data.isPriority),
    bay: data.bay?.trim() || "—",
    plate: data.plate?.trim() || "—",
    colour: data.colour?.trim() || "—",
    chassisNo: data.chassisNo?.trim() || "—",
    lastActivity: mapDetailLastActivity(data.lastActivity),
    lastServicedAt: data.lastServicedAt?.trim() || "—",
    fuelLevel: data.fuelLevel?.trim() || "—",
    health: (data.health ?? []).map(mapHealthItem),
    documents: mapDocuments(data.documents),
  };
}
