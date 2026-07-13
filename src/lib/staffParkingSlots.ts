import type {
  StaffParkingSlotRaw,
  StaffParkingSlotsSummaryRaw,
  StaffParkingSummaryStatRaw,
} from "@/types/api";
import type {
  ParkingSlotDetail,
  ParkingSlotListItem,
  ParkingSlotsSummaryDisplay,
} from "@/components/staff/vehicles/parking-slots/types";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function extractArray<T>(
  value: unknown,
  keys: string[] = ["slots", "items", "records", "data"],
): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  const record = asRecord(value);

  if (!record) {
    return [];
  }

  for (const key of keys) {
    const candidate = record[key];

    if (Array.isArray(candidate)) {
      return candidate as T[];
    }
  }

  return [];
}

function formatSlotType(value?: string): string {
  const normalized = value?.trim().toLowerCase() ?? "";

  switch (normalized) {
    case "ev":
      return "EV";
    case "ev_charging":
      return "EV";
    default:
      return normalized
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()) || "—";
  }
}

function formatStatus(value?: string): string {
  const normalized = value?.trim().toLowerCase() ?? "available";

  return normalized
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function mapSummaryStat(
  stat: StaffParkingSummaryStatRaw | undefined,
  fallbackLabel: string,
): { label: string; value: string; subtext: string } {
  return {
    label: stat?.label?.trim() || fallbackLabel,
    value: String(stat?.value ?? 0),
    subtext:
      stat?.subLabel?.trim() ||
      stat?.subtext?.trim() ||
      stat?.subtitle?.trim() ||
      "",
  };
}

export function mapParkingSlotsList(data: unknown): ParkingSlotListItem[] {
  return extractArray<StaffParkingSlotRaw>(data)
    .map((slot) => {
      if (slot.id === undefined || slot.id === null) {
        return null;
      }

      const slotCode = slot.slotCode?.trim() || slot.label?.trim() || "—";

      return {
        id: String(slot.id),
        slotCode,
        zone: slot.zone?.trim().toUpperCase() || "—",
        level: slot.level?.trim() || "—",
        slotType: formatSlotType(slot.slotType),
        status: slot.status?.trim().toLowerCase() || "available",
        statusLabel: formatStatus(slot.status),
        isActive: slot.isActive !== false,
      };
    })
    .filter((item): item is ParkingSlotListItem => item !== null);
}

export function mapParkingSlotDetail(
  raw: StaffParkingSlotRaw | undefined | null,
): ParkingSlotDetail | null {
  if (!raw || raw.id === undefined || raw.id === null) {
    return null;
  }

  const slotCode = raw.slotCode?.trim() || "—";
  const status = raw.status?.trim().toLowerCase() || "available";

  return {
    id: String(raw.id),
    slotCode,
    level: raw.level?.trim() || "—",
    zone: raw.zone?.trim().toUpperCase() || "—",
    label: raw.label?.trim() || `Bay ${slotCode}`,
    slotType: raw.slotType?.trim().toLowerCase() || "standard",
    slotTypeLabel: formatSlotType(raw.slotType),
    openTime: raw.openTime?.trim() || "—",
    closeTime: raw.closeTime?.trim() || "—",
    status,
    statusLabel: formatStatus(raw.status),
    isActive: raw.isActive !== false,
    notes: raw.notes?.trim() || "",
  };
}

export function mapParkingSlotsSummary(
  data: unknown,
): ParkingSlotsSummaryDisplay {
  const record =
    asRecord(data) ??
    (asRecord(asRecord(data)?.summary) as StaffParkingSlotsSummaryRaw | null);

  const summary = (record ?? {}) as StaffParkingSlotsSummaryRaw;

  return {
    total: mapSummaryStat(summary.total ?? summary.totalSlots, "Total Slots"),
    available: mapSummaryStat(summary.available, "Available"),
    occupied: mapSummaryStat(summary.occupied, "Occupied"),
    maintenance: mapSummaryStat(summary.maintenance, "Maintenance"),
  };
}

export function createEmptyParkingSlotsSummary(): ParkingSlotsSummaryDisplay {
  return {
    total: { label: "Total Slots", value: "0", subtext: "" },
    available: { label: "Available", value: "0", subtext: "" },
    occupied: { label: "Occupied", value: "0", subtext: "" },
    maintenance: { label: "Maintenance", value: "0", subtext: "" },
  };
}