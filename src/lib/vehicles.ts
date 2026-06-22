import type { InventoryVehicleRaw, VehicleInventorySummaryStat } from "@/types/api";
import type {
  HealthMetric,
  VehicleDetail,
  VehicleListItem,
  VehicleStatItem,
  VehicleStatsDisplay,
  VehicleStatus,
} from "@/components/staff/vehicles/types";
import { vehicleDetails, vehicleStats } from "@/components/staff/vehicles/mockData";

const healthCategoryLabels: Record<string, string> = {
  engine_drivetrain: "Engine & Drive",
  tyres: "Tyres",
  brakes: "Brakes",
  fluids: "Fluids",
  battery: "Battery",
  exterior_body: "Exterior & Body",
};

function extractInventoryVehicles(data: unknown): InventoryVehicleRaw[] {
  if (Array.isArray(data)) {
    return data as InventoryVehicleRaw[];
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  const record = data as Record<string, unknown>;

  for (const key of ["vehicles", "items", "records", "data"]) {
    const value = record[key];

    if (Array.isArray(value)) {
      return value as InventoryVehicleRaw[];
    }
  }

  return [];
}

function healthTone(value: number): HealthMetric["tone"] {
  if (value < 50) return "pink";
  if (value < 75) return "gold";
  return "teal";
}

export function mapVehicleStatus(status?: string): VehicleStatus {
  const normalized = status?.trim().toLowerCase() ?? "";

  if (normalized.includes("overdue")) return "overdue";
  if (normalized.includes("dispatch")) return "dispatched";
  if (normalized.includes("away")) return "away";
  if (normalized.includes("service")) return "in-service";
  if (
    normalized.includes("ready") ||
    normalized.includes("available") ||
    normalized.includes("stored")
  ) {
    return "ready";
  }

  return "ready";
}

function resolveInventoryVehicleName(item: InventoryVehicleRaw): string {
  const info = item.vehicleInfo;
  const ownership = item.ownershipInfo;

  const displayName = item.displayName?.trim();
  if (displayName) return displayName;

  const infoName = info?.name?.trim();
  const infoModel = info?.model?.trim();
  const fromVehicleInfo = [infoName, infoModel].filter(Boolean).join(" ").trim();
  if (fromVehicleInfo) return fromVehicleInfo;

  const topName = item.name?.trim();
  const make = (item.make ?? info?.make)?.trim() ?? "";
  const model = (item.model ?? info?.model)?.trim() ?? "";
  const fromMakeModel = [make || topName, model]
    .filter(Boolean)
    .join(" ")
    .trim();
  if (fromMakeModel) return fromMakeModel;

  const plate = (item.plate ?? ownership?.plate)?.trim();
  if (plate) return plate;

  const id = String(item.id);
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(id)) {
    return "Unknown Vehicle";
  }

  return `Vehicle #${id}`;
}

function resolveInventoryStorageBay(item: InventoryVehicleRaw): string {
  return (
    item.storageBay?.trim() ||
    item.ownershipInfo?.storageBay?.trim() ||
    "—"
  );
}

function resolveInventoryMileage(item: InventoryVehicleRaw): string {
  const raw = item.mileage?.trim() || item.ownershipInfo?.mileage?.trim();
  if (!raw) return "—";

  return `${raw.replace(/\s*km$/i, "")} KM`;
}

function resolveInventoryMember(item: InventoryVehicleRaw): string {
  const memberName = item.member?.name?.trim();
  if (memberName) return memberName.toUpperCase();

  if (item.memberId === undefined || item.memberId === null || item.memberId === "") {
    return "AVAILABLE";
  }

  return "ASSIGNED";
}

export function mapInventoryVehicle(
  item: InventoryVehicleRaw,
): VehicleListItem | null {
  if (item.id === undefined || item.id === null) {
    return null;
  }

  return {
    id: String(item.id),
    name: resolveInventoryVehicleName(item).toUpperCase(),
    bay: resolveInventoryStorageBay(item),
    member: resolveInventoryMember(item),
    mileage: resolveInventoryMileage(item),
    status: mapVehicleStatus(item.status),
  };
}

export function mapInventoryResponse(data: unknown): VehicleListItem[] {
  return extractInventoryVehicles(data)
    .map(mapInventoryVehicle)
    .filter((item): item is VehicleListItem => item !== null);
}

export type OfferVehicleOption = {
  id: string;
  name: string;
};

export function mapOfferVehicleOptions(data: unknown): OfferVehicleOption[] {
  return extractInventoryVehicles(data)
    .map((item) => {
      if (item.id === undefined || item.id === null) {
        return null;
      }

      return {
        id: String(item.id),
        name: resolveInventoryVehicleName(item),
      };
    })
    .filter((item): item is OfferVehicleOption => item !== null);
}

function mapSummaryStat(
  stat: VehicleInventorySummaryStat | undefined,
  fallback: VehicleStatItem,
): VehicleStatItem {
  if (!stat) {
    return {
      label: fallback.label,
      value: "0",
      subtext:
        fallback.label === "Ready" ? "0% OF FLEET" : fallback.subtext,
    };
  }

  return {
    label: stat.label?.trim() || fallback.label,
    value: String(stat.value ?? 0),
    subtext: stat.subLabel?.trim() || fallback.subtext,
  };
}

export function mapInventorySummary(data: unknown): VehicleStatsDisplay | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const summary = (data as Record<string, unknown>).summary;

  if (!summary || typeof summary !== "object") {
    return null;
  }

  const record = summary as Record<string, VehicleInventorySummaryStat | undefined>;

  return {
    total: mapSummaryStat(record.total, vehicleStats.total),
    ready: mapSummaryStat(record.ready, vehicleStats.ready),
    inService: mapSummaryStat(record.inService, vehicleStats.inService),
    overdue: mapSummaryStat(record.overdueService, vehicleStats.overdue),
  };
}

export function createEmptyVehicleStats(): VehicleStatsDisplay {
  return {
    total: { ...vehicleStats.total, value: "0" },
    ready: { ...vehicleStats.ready, value: "0", subtext: "0% OF FLEET" },
    inService: { ...vehicleStats.inService, value: "0" },
    overdue: { ...vehicleStats.overdue, value: "0" },
  };
}

function mapHealthMetrics(
  health: InventoryVehicleRaw["health"] = [],
): HealthMetric[] {
  if (!health.length) return [];

  return health.map((item) => {
    const value = item.percentage ?? 0;
    const label =
      healthCategoryLabels[item.category ?? ""] ??
      item.category?.replace(/_/g, " ") ??
      "Health";

    return {
      label: label.replace(/\b\w/g, (char) => char.toUpperCase()),
      value,
      tone: healthTone(value),
    };
  });
}

export function mapVehicleDetail(
  raw: InventoryVehicleRaw | undefined,
  listItem?: VehicleListItem,
): VehicleDetail {
  const fallback = vehicleDetails["ferrari-296"];
  const mappedListItem = raw ? mapInventoryVehicle(raw) : listItem;

  if (!mappedListItem) {
    return fallback;
  }

  const health = mapHealthMetrics(raw?.health);
  const systemHealth = health.filter((item) =>
    ["Engine & Drive", "Tyres", "Brakes", "Battery"].includes(item.label),
  );
  const condition = health.filter((item) =>
    ["Fluids", "Exterior & Body"].includes(item.label),
  );

  return {
    id: mappedListItem.id,
    name: mappedListItem.name,
    bay: mappedListItem.bay,
    mileage: mappedListItem.mileage.replace(" KM", " km"),
    member: mappedListItem.member,
    isOverdue: mappedListItem.status === "overdue",
    health: systemHealth.length ? systemHealth : fallback.health,
    condition: condition.length ? condition : fallback.condition,
    serviceHistory: fallback.serviceHistory,
  };
}

export function indexInventoryVehicles(
  data: unknown,
): Record<string, InventoryVehicleRaw> {
  return extractInventoryVehicles(data).reduce<Record<string, InventoryVehicleRaw>>(
    (acc, item) => {
      if (item.id !== undefined && item.id !== null) {
        acc[String(item.id)] = item;
      }

      return acc;
    },
    {},
  );
}
