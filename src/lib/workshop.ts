import type {
  ActiveBayItem,
  ServiceQueueItem,
  WorkshopBayStatus,
  WorkshopStatItem,
} from "@/components/admin/workshop/types";
import type {
  WorkshopBayRaw,
  WorkshopDashboardStatsData,
  WorkshopQueueItemRaw,
} from "@/types/api";

function hasValue(value: string | number | null | undefined): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}

function formatCount(value: number): string {
  return String(value);
}

function formatTurnaroundDays(value: string | number): string {
  if (!hasValue(value)) return "—";

  const parsed = typeof value === "number" ? value : Number.parseFloat(value);
  if (Number.isNaN(parsed)) return "—";

  return `${parsed} Days`;
}

function formatAvgDelta(value: string | number): string | undefined {
  if (!hasValue(value)) return undefined;

  const raw = String(value).trim();
  if (!raw) return undefined;

  if (/[dD]$/.test(raw)) {
    return raw.startsWith("-") || raw.startsWith("+") ? raw : `-${raw}`;
  }

  if (raw.startsWith("-") || raw.startsWith("+")) {
    return `${raw}D`;
  }

  return `-${raw}D`;
}

function formatEngineersFootnote(engineers: string[]): string {
  if (engineers.length === 0) return "—";

  const [first] = engineers;
  if (!first) return "—";

  if (engineers.length === 1) {
    return first;
  }

  const leadName = first.split(" ")[0] ?? first;
  return `${leadName} + ${engineers.length - 1}`;
}

export function mapWorkshopDashboardStats(
  data: WorkshopDashboardStatsData,
): WorkshopStatItem[] {
  return [
    {
      label: "Active Jobs",
      value: formatCount(data.activeJobs),
      footnote: "In Progress",
    },
    {
      label: "Overdue",
      value: formatCount(data.overdue),
      footnote: "Critical",
      valueTone: "pink",
      iconTone: "pink",
    },
    {
      label: "Awaiting Parts",
      value: formatCount(data.awaitingParts),
      footnote: "OEM Order",
      valueTone: "gold",
    },
    {
      label: "Avg Turnaround",
      value: formatTurnaroundDays(data.avgTurnaroundDays),
      footnote: "30D Avg",
      valueTone: "white",
      trend: formatAvgDelta(data.avgDelta),
    },
    {
      label: "Engineers On",
      value: formatCount(data.engineersOn),
      footnote: formatEngineersFootnote(data.engineers),
      valueTone: "white",
    },
  ];
}

export function createEmptyWorkshopStats(): WorkshopStatItem[] {
  return mapWorkshopDashboardStats({
    activeJobs: 0,
    overdue: 0,
    awaitingParts: 0,
    avgTurnaroundDays: "",
    avg300: "",
    avgDelta: "",
    engineersOn: 0,
    engineers: [],
  });
}

function splitVehicleName(vehicleName: string): {
  vehicleMake: string;
  vehicleModel: string;
} {
  const parts = vehicleName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return { vehicleMake: "—", vehicleModel: "" };
  }

  if (parts.length === 1) {
    return { vehicleMake: parts[0]!, vehicleModel: "" };
  }

  return {
    vehicleMake: parts[0]!,
    vehicleModel: parts.slice(1).join(" "),
  };
}

function mapBayStatus(statusBadge: string): WorkshopBayStatus {
  const normalized = statusBadge.trim().toLowerCase();

  if (normalized.includes("overdue")) return "overdue";
  if (normalized.includes("final") || normalized.includes("quality")) {
    return "final-check";
  }
  if (normalized.includes("transit")) return "in-transit";
  if (normalized.includes("track")) return "track-repairs";

  return "active";
}

function formatBayStatusLabel(statusBadge: string, dueAt: string): string {
  const normalized = statusBadge.trim().toLowerCase();

  if (normalized.includes("overdue") && dueAt) {
    const due = new Date(dueAt);
    if (!Number.isNaN(due.getTime())) {
      const diffDays = Math.floor((Date.now() - due.getTime()) / 86_400_000);
      if (diffDays > 0) {
        return `Overdue ${diffDays}D`;
      }
    }
  }

  return statusBadge;
}

function formatBayDueLabel(
  dueAt: string,
  statusBadge: string,
): { timeLabel: string; timeTone: ActiveBayItem["timeTone"] } {
  if (!dueAt) {
    return { timeLabel: "—", timeTone: "gold" };
  }

  const due = new Date(dueAt);
  if (Number.isNaN(due.getTime())) {
    return { timeLabel: "—", timeTone: "gold" };
  }

  const diffMs = Date.now() - due.getTime();
  const isOverdue =
    statusBadge.toLowerCase().includes("overdue") || diffMs > 0;

  if (isOverdue) {
    const diffDays = Math.max(1, Math.floor(diffMs / 86_400_000));
    return { timeLabel: `+${diffDays}d`, timeTone: "pink" };
  }

  const today = new Date();
  const isToday =
    due.getFullYear() === today.getFullYear() &&
    due.getMonth() === today.getMonth() &&
    due.getDate() === today.getDate();

  if (isToday) {
    const time = due.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return { timeLabel: `Today ${time}`, timeTone: "gold" };
  }

  return {
    timeLabel: due.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }),
    timeTone: "gold",
  };
}

function formatReferenceNumber(referenceNumber: string): string {
  const trimmed = referenceNumber.trim();
  if (!trimmed) return "—";

  return trimmed.replace(/\s+/g, " ");
}

export function mapWorkshopBay(bay: WorkshopBayRaw): ActiveBayItem {
  const { vehicleMake, vehicleModel } = splitVehicleName(bay.vehicleName);
  const { timeLabel, timeTone } = formatBayDueLabel(bay.dueAt, bay.statusBadge);
  const technician = bay.technicianName.trim();

  return {
    id: bay.id,
    bay: bay.bayNumber.trim() || "—",
    status: mapBayStatus(bay.statusBadge),
    statusLabel: formatBayStatusLabel(bay.statusBadge, bay.dueAt),
    vehicleMake,
    vehicleModel,
    memberName: bay.memberName.trim() || "—",
    memberNumber: formatReferenceNumber(bay.referenceNumber),
    description: bay.serviceDescription.trim() || "—",
    engineer: technician || "Unassigned",
    timeLabel,
    timeTone,
  };
}

export function mapWorkshopBays(bays: WorkshopBayRaw[] = []): ActiveBayItem[] {
  return bays.map(mapWorkshopBay);
}

function formatQueueDate(scheduledAt: string): string {
  const date = new Date(scheduledAt);
  if (Number.isNaN(date.getTime())) return "—";

  const weekday = date.toLocaleDateString("en-GB", { weekday: "short" });
  return `${weekday} ${date.getDate()}`;
}

function formatMemberInitial(memberName: string): string {
  const trimmed = memberName.trim();
  if (!trimmed) return "?";

  return trimmed.charAt(0).toUpperCase();
}

function formatEstimateDays(est: number): string {
  if (!Number.isFinite(est) || est <= 0) return "—";
  return `${est}d`;
}

function formatQueueMemberReference(
  referenceNumber: string,
  memberNumber: string,
): string {
  const reference = referenceNumber.trim();
  if (reference) {
    return reference.replace(/\s+/g, " ");
  }

  const number = memberNumber.trim();
  return number || "—";
}

export function mapWorkshopQueueItem(item: WorkshopQueueItemRaw): ServiceQueueItem {
  const { vehicleMake, vehicleModel } = splitVehicleName(item.vehicleName);
  const memberName = item.memberName.trim() || "—";
  const engineer = item.engineer.trim();

  return {
    id: item.id,
    date: formatQueueDate(item.scheduledAt),
    memberInitial: formatMemberInitial(memberName),
    memberName,
    memberNumber: formatQueueMemberReference(
      item.referenceNumber,
      item.memberNumber,
    ),
    vehicleMake,
    vehicleModel,
    service: item.serviceType.trim() || "—",
    engineer: engineer || "—",
    estimate: formatEstimateDays(item.est),
  };
}

export function mapWorkshopQueueItems(
  items: WorkshopQueueItemRaw[] = [],
): ServiceQueueItem[] {
  return items.map(mapWorkshopQueueItem);
}
