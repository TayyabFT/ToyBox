import type { AdminTransportRequestRaw } from "@/types/api";
import { compareResourceIdsDesc } from "@/lib/resourceId";

export type TransportRequestJobStatus =
  | "urgent"
  | "assigned"
  | "overdue"
  | "in-progress"
  | "pending"
  | "active";

export type TransportRequestJob = {
  id: string;
  title: string;
  jobId: string;
  member: string;
  vehicle: string;
  status: TransportRequestJobStatus;
  statusLabel: string;
  from: string;
  to: string;
  scheduled: string;
  notes?: string;
  assignee?: string;
  tier?: string;
  isUrgent?: boolean;
  category: "transport";
};

export type TransportSectionMeta = {
  title: string;
  requestCount: number;
  highlightLabel: string;
};

function mapRequestStatus(status?: string): TransportRequestJobStatus {
  const normalized = status?.trim().toLowerCase() ?? "";

  if (normalized.includes("urgent")) return "urgent";
  if (normalized.includes("overdue")) return "overdue";
  if (normalized.includes("progress") || normalized.includes("transit")) {
    return "in-progress";
  }
  if (normalized.includes("assign") || normalized.includes("confirm")) {
    return "assigned";
  }
  if (normalized.includes("complete") || normalized.includes("delivered")) {
    return "active";
  }

  return "pending";
}

function formatMemberLabel(memberNumber?: string, memberId?: number | string): string {
  if (memberNumber?.trim()) {
    return `No. ${memberNumber.trim()}`;
  }

  if (memberId !== undefined && memberId !== null && String(memberId).trim() !== "") {
    return `Member No. ${memberId}`;
  }

  return "—";
}

function formatScheduledLabel(request: AdminTransportRequestRaw): string {
  const detail = request.detail;
  const date =
    detail?.preferredDateLabel?.trim() ||
    detail?.preferredDate?.trim() ||
    request.scheduledAt?.trim();
  const time = detail?.timeWindow?.trim();

  if (date && time) {
    return `${date} · ${time}`;
  }

  if (date) {
    const parsed = new Date(date);

    if (!Number.isNaN(parsed.getTime()) && date.includes("T")) {
      return parsed.toLocaleString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return date;
  }

  return "—";
}

function buildTransportTitle(request: AdminTransportRequestRaw): string {
  const label =
    request.requestTypeLabel?.trim() ||
    request.detail?.serviceTypeLabel?.trim() ||
    "Transport Request";
  const vehicle =
    request.vehicle?.trim() || request.detail?.vehicle?.trim() || "";

  if (vehicle) {
    return `${label} — ${vehicle}`;
  }

  return request.title?.trim() || label;
}

export function mapTransportRequest(
  request: AdminTransportRequestRaw,
): TransportRequestJob | null {
  if (request.id === undefined || request.id === null) {
    return null;
  }

  if (request.source !== "transport") {
    return null;
  }

  const detail = request.detail;
  const statusLabel =
    request.status?.trim() || detail?.status?.trim() || "Pending";
  const status = mapRequestStatus(statusLabel);

  return {
    id: String(request.id),
    title: buildTransportTitle(request),
    jobId:
      request.referenceNumber?.trim() ||
      detail?.referenceNumber?.trim() ||
      `TRN-${request.id}`,
    member: formatMemberLabel(request.memberNumber, request.memberId),
    vehicle:
      request.vehicle?.trim() || detail?.vehicle?.trim() || "—",
    status,
    statusLabel,
    from:
      detail?.pickupLocation?.trim() ||
      detail?.deliveryAddress?.trim() ||
      "—",
    to:
      detail?.dropoffLocation?.trim() ||
      detail?.destination?.trim() ||
      detail?.deliveryAddress?.trim() ||
      "—",
    scheduled: formatScheduledLabel(request),
    notes: detail?.notes?.trim() || undefined,
    isUrgent: status === "urgent",
    category: "transport",
  };
}

export function mapTransportRequests(data: unknown): TransportRequestJob[] {
  const record =
    data && typeof data === "object"
      ? (data as { requests?: AdminTransportRequestRaw[] })
      : {};

  return (record.requests ?? [])
    .map(mapTransportRequest)
    .filter((job): job is TransportRequestJob => job !== null)
    .sort((a, b) => compareResourceIdsDesc(b.id, a.id));
}

export function buildTransportSectionMeta(
  jobs: TransportRequestJob[],
  totalCount?: number,
): TransportSectionMeta {
  const count = totalCount ?? jobs.length;
  const urgent = jobs.filter((job) => job.isUrgent || job.status === "urgent").length;
  const inProgress = jobs.filter((job) => job.status === "in-progress").length;
  const pending = jobs.filter((job) => job.status === "pending").length;

  const highlightLabel =
    urgent > 0
      ? `${urgent} urgent`
      : inProgress > 0
        ? `${inProgress} in progress`
        : pending > 0
          ? `${pending} pending`
          : "Up to date";

  return {
    title: "Transport & Delivery",
    requestCount: count,
    highlightLabel,
  };
}
