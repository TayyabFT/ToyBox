import type { AdminMaintenanceRequestRaw } from "@/types/api";
import { compareResourceIdsDesc } from "@/lib/resourceId";

export type MaintenanceRequestJobStatus =
  | "urgent"
  | "assigned"
  | "overdue"
  | "in-progress"
  | "pending"
  | "active";

export type MaintenanceRequestJob = {
  id: string;
  title: string;
  jobId: string;
  member: string;
  vehicle: string;
  status: MaintenanceRequestJobStatus;
  statusLabel: string;
  serviceType: string;
  centre: string;
  estimatedCost: string;
  scheduledAt?: string;
  notes?: string;
  requiresApproval?: boolean;
  isPaid?: boolean;
  startedAt?: string;
  estimatedDone?: string;
  progress?: number;
  workshop?: string;
  progressNote?: string;
  isOverdue?: boolean;
  category: "maintenance";
};

export type MaintenanceSectionMeta = {
  title: string;
  requestCount: number;
  highlightLabel: string;
};

function mapRequestStatus(status?: string): MaintenanceRequestJobStatus {
  const normalized = status?.trim().toLowerCase() ?? "";

  if (normalized.includes("overdue")) return "overdue";
  if (normalized.includes("progress")) return "in-progress";
  if (normalized.includes("urgent")) return "urgent";
  if (normalized.includes("assign")) return "assigned";
  if (normalized.includes("complete")) return "active";

  return "pending";
}

function buildServiceLabel(request: AdminMaintenanceRequestRaw): string {
  const serviceNames =
    request.services
      ?.map((service) => service.name?.trim())
      .filter((name): name is string => Boolean(name)) ?? [];

  if (serviceNames.length > 0) {
    return serviceNames.join(", ");
  }

  return "Maintenance Request";
}

function buildMaintenanceTitle(request: AdminMaintenanceRequestRaw): string {
  const services = buildServiceLabel(request);
  const vehicle = request.vehicle?.trim();

  if (vehicle) {
    return `${services} — ${vehicle}`;
  }

  return services;
}

function formatScheduledAt(iso?: string): string | undefined {
  if (!iso?.trim()) {
    return undefined;
  }

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return iso.trim();
  }

  return date.toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatEstimatedCost(request: AdminMaintenanceRequestRaw): string {
  const amount = request.totalAmount;

  if (amount === undefined || amount === null || amount === "") {
    return "—";
  }

  const currency = request.currency?.trim() || "AED";
  const numericAmount =
    typeof amount === "number" ? amount : Number(String(amount).replace(/,/g, ""));

  if (!Number.isNaN(numericAmount) && String(amount).trim() !== "") {
    return `${currency} ${numericAmount.toLocaleString("en-US")}`;
  }

  return String(amount).trim();
}

function formatMemberLabel(memberId?: number | string): string {
  if (memberId === undefined || memberId === null || String(memberId).trim() === "") {
    return "—";
  }

  return `Member No. ${memberId}`;
}

export function mapMaintenanceRequest(
  request: AdminMaintenanceRequestRaw,
): MaintenanceRequestJob | null {
  if (request.id === undefined || request.id === null) {
    return null;
  }

  const statusLabel = request.status?.trim() || "Pending";

  return {
    id: String(request.id),
    title: buildMaintenanceTitle(request),
    jobId: request.referenceNumber?.trim() || `MNT-${request.id}`,
    member: formatMemberLabel(request.memberId),
    vehicle: request.vehicle?.trim() || "—",
    status: mapRequestStatus(request.status),
    statusLabel,
    serviceType: buildServiceLabel(request),
    centre: request.location?.trim() || "—",
    estimatedCost: formatEstimatedCost(request),
    scheduledAt: formatScheduledAt(request.scheduledAt),
    notes: request.notes?.trim() || undefined,
    requiresApproval: Boolean(request.requiresApproval),
    isPaid: Boolean(request.isPaid),
    category: "maintenance",
  };
}

export function mapMaintenanceRequests(data: unknown): MaintenanceRequestJob[] {
  const record =
    data && typeof data === "object"
      ? (data as { count?: number; requests?: AdminMaintenanceRequestRaw[] })
      : {};

  return (record.requests ?? [])
    .map(mapMaintenanceRequest)
    .filter((job): job is MaintenanceRequestJob => job !== null)
    .sort((a, b) => compareResourceIdsDesc(b.id, a.id));
}

export function buildMaintenanceSectionMeta(
  jobs: MaintenanceRequestJob[],
  totalCount?: number,
): MaintenanceSectionMeta {
  const count = totalCount ?? jobs.length;
  const inProgress = jobs.filter((job) => job.status === "in-progress").length;
  const overdue = jobs.filter((job) => job.isOverdue).length;
  const pending = jobs.filter((job) => job.status === "pending").length;

  const highlightLabel =
    overdue > 0
      ? `${overdue} overdue`
      : inProgress > 0
        ? `${inProgress} in progress`
        : pending > 0
          ? `${pending} pending`
          : "Up to date";

  return {
    title: "Maintenance & Service",
    requestCount: count,
    highlightLabel,
  };
}
