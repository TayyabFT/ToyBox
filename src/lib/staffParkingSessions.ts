import type { StaffParkingSessionRaw } from "@/types/api";
import type {
  ParkingSessionAction,
  ParkingSessionDetail,
  ParkingSessionListItem,
  ParkingSessionsSummaryDisplay,
} from "@/components/staff/parking/parking-sessions/types";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function extractArray<T>(
  value: unknown,
  keys: string[] = ["sessions", "items", "records", "data", "queue"],
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

function formatStatus(value?: string): string {
  const normalized = value?.trim().toLowerCase() ?? "pending";

  return normalized
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDateTime(value?: string): string {
  if (!value?.trim()) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.trim();
  }

  return date.toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(value?: string): string {
  if (!value?.trim()) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.trim();
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function resolveMemberName(raw: StaffParkingSessionRaw): string {
  return (
    raw.memberName?.trim() ||
    raw.member?.fullName?.trim() ||
    raw.member?.name?.trim() ||
    "Member"
  );
}

function resolveVehicleName(raw: StaffParkingSessionRaw): string {
  if (raw.vehicleName?.trim()) {
    return raw.vehicleName.trim();
  }

  const vehicle = raw.vehicle;

  if (!vehicle) {
    return "Vehicle";
  }

  const composed = [vehicle.make, vehicle.model]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");

  if (composed) {
    return composed;
  }

  return vehicle.name?.trim() || vehicle.registration?.trim() || "Vehicle";
}

function resolveVehiclePlate(raw: StaffParkingSessionRaw): string {
  return (
    raw.vehicle?.registration?.trim() ||
    raw.vehicle?.plate?.trim() ||
    ""
  );
}

function resolveSlotCode(raw: StaffParkingSessionRaw): string {
  return (
    raw.slotCode?.trim() ||
    raw.slot?.slotCode?.trim() ||
    raw.slot?.label?.trim() ||
    "—"
  );
}

function resolveSlotZone(raw: StaffParkingSessionRaw): string {
  return raw.slot?.zone?.trim().toUpperCase() || "—";
}

function resolveReference(raw: StaffParkingSessionRaw): string {
  return raw.referenceNumber?.trim() || raw.reference?.trim() || "";
}

function resolveNotes(raw: StaffParkingSessionRaw): string {
  return raw.staffNotes?.trim() || raw.memberNotes?.trim() || raw.notes?.trim() || "";
}

export function getParkingSessionAction(
  status: string,
): ParkingSessionAction | null {
  const normalized = status.trim().toLowerCase();

  if (
    ["pending", "requested", "queue", "awaiting_accept", "awaiting", "open"].includes(
      normalized,
    )
  ) {
    return "accept";
  }

  if (["accepted", "confirmed"].includes(normalized)) {
    return "start";
  }

  if (
    ["active", "in_progress", "started", "parking", "in-progress"].includes(
      normalized,
    )
  ) {
    return "complete";
  }

  return null;
}

function mapSessionListItem(
  raw: StaffParkingSessionRaw,
): ParkingSessionListItem | null {
  if (raw.id === undefined || raw.id === null) {
    return null;
  }

  const status = raw.status?.trim().toLowerCase() || "pending";
  const requestedAt = raw.requestedAt?.trim() || raw.createdAt?.trim() || "";

  return {
    id: String(raw.id),
    reference: resolveReference(raw) || `REQ-${String(raw.id)}`,
    memberName: resolveMemberName(raw),
    vehicleName: resolveVehicleName(raw),
    vehiclePlate: resolveVehiclePlate(raw),
    slotCode: resolveSlotCode(raw),
    slotZone: resolveSlotZone(raw),
    status,
    statusLabel: formatStatus(raw.status),
    requestedAt,
    requestedTime: formatTime(requestedAt),
    nextAction: getParkingSessionAction(status),
  };
}

export function mapParkingSessionsList(data: unknown): ParkingSessionListItem[] {
  return extractArray<StaffParkingSessionRaw>(data)
    .map(mapSessionListItem)
    .filter((item): item is ParkingSessionListItem => item !== null);
}

export function mapParkingSessionDetail(
  raw: StaffParkingSessionRaw | undefined | null,
): ParkingSessionDetail | null {
  if (!raw || raw.id === undefined || raw.id === null) {
    return null;
  }

  const status = raw.status?.trim().toLowerCase() || "pending";
  const requestedAt = raw.requestedAt?.trim() || raw.createdAt?.trim() || "";

  return {
    id: String(raw.id),
    reference: resolveReference(raw) || `REQ-${String(raw.id)}`,
    memberName: resolveMemberName(raw),
    vehicleName: resolveVehicleName(raw),
    vehiclePlate: resolveVehiclePlate(raw),
    slotCode: resolveSlotCode(raw),
    slotZone: resolveSlotZone(raw),
    slotLevel: raw.slot?.level?.trim() || "—",
    status,
    statusLabel: formatStatus(raw.status),
    requestedAt,
    requestedAtLabel: formatDateTime(requestedAt),
    acceptedAtLabel: formatDateTime(raw.acceptedAt),
    startedAtLabel: formatDateTime(raw.startedAt),
    completedAtLabel: formatDateTime(raw.completedAt),
    staffNotes: raw.staffNotes?.trim() || "",
    memberNotes: raw.memberNotes?.trim() || raw.notes?.trim() || "",
    nextAction: getParkingSessionAction(status),
  };
}

export function mapParkingSessionsSummary(
  sessions: ParkingSessionListItem[],
): ParkingSessionsSummaryDisplay {
  let queue = 0;
  let accepted = 0;
  let active = 0;
  let completed = 0;

  for (const session of sessions) {
    const normalized = session.status.trim().toLowerCase();

    if (["completed", "done", "closed"].includes(normalized)) {
      completed += 1;
      continue;
    }

    if (session.nextAction === "accept") {
      queue += 1;
      continue;
    }

    if (session.nextAction === "start") {
      accepted += 1;
      continue;
    }

    if (session.nextAction === "complete") {
      active += 1;
    }
  }

  return {
    queue: {
      label: "Queue",
      value: String(queue),
      subtext: "AWAITING ACCEPT",
    },
    accepted: {
      label: "Accepted",
      value: String(accepted),
      subtext: "READY TO START",
    },
    active: {
      label: "Active",
      value: String(active),
      subtext: "VEHICLES PARKED",
    },
    completed: {
      label: "Completed",
      value: String(completed),
      subtext: "SESSIONS CLOSED",
    },
  };
}

export function createEmptyParkingSessionsSummary(): ParkingSessionsSummaryDisplay {
  return {
    queue: { label: "Queue", value: "0", subtext: "" },
    accepted: { label: "Accepted", value: "0", subtext: "" },
    active: { label: "Active", value: "0", subtext: "" },
    completed: { label: "Completed", value: "0", subtext: "" },
  };
}
