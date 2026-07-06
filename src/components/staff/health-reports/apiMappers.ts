import type { HealthMetric, VehicleStatus } from "@/components/staff/vehicles/types";
import type {
  StaffHealthReportDetailRaw,
  StaffHealthReportTabRaw,
  StaffHealthReportVehicleRaw,
  StaffHealthReportVehiclesData,
} from "@/types/api";
import type {
  FlaggedIssue,
  FleetHealthItem,
  HealthFilter,
  HealthReport,
  HealthReportTab,
} from "./types";

function normalizeFilterKey(value?: string): HealthFilter {
  if (value === "critical") return "critical";
  if (value === "due_service" || value === "due-service") return "due-service";
  if (value === "healthy") return "healthy";
  return "all";
}

function normalizeHealthStatus(value?: string): VehicleStatus {
  if (value === "critical") return "critical";
  if (value === "due_service" || value === "due-service") return "due-service";
  if (value === "healthy") return "good";
  return "good";
}

function healthTone(value: number): HealthMetric["tone"] {
  if (value < 40) return "pink";
  if (value < 70) return "gold";
  return "teal";
}

function issueActionLabel(value?: string): FlaggedIssue["actionLabel"] {
  const label = value?.trim().toUpperCase();
  return label === "SCHEDULE" ? "SCHEDULE" : "BOOK NOW";
}

function parseOverdueDays(value?: string | number): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (!value) return undefined;

  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function fallbackVehicleName(vehicle: StaffHealthReportVehicleRaw): string {
  const parts = [vehicle.make, vehicle.model].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : "Unknown Vehicle";
}

export function mapHealthReportTabs(
  tabs: StaffHealthReportTabRaw[] | undefined,
): HealthReportTab[] {
  if (!tabs?.length) {
    return [
      { id: "all", label: "All Vehicles" },
      { id: "critical", label: "Critical" },
      { id: "due-service", label: "Due Service" },
      { id: "healthy", label: "Healthy" },
    ];
  }

  return tabs.map((tab) => ({
    id: normalizeFilterKey(tab.key),
    label: tab.label?.trim() || "Vehicles",
  }));
}

export function mapFleetHealthVehicles(
  vehicles: StaffHealthReportVehicleRaw[] | undefined,
): FleetHealthItem[] {
  return (vehicles ?? [])
    .filter((vehicle): vehicle is StaffHealthReportVehicleRaw & { id: string } =>
      Boolean(vehicle.id),
    )
    .map((vehicle) => ({
      id: vehicle.id,
      vehicle: vehicle.displayName?.trim() || fallbackVehicleName(vehicle),
      bay: vehicle.bay?.trim() || vehicle.storageLocation?.trim() || "—",
      member: vehicle.memberName?.trim() || "Unassigned",
      mileage: vehicle.mileage?.trim() || "—",
      healthPercent: vehicle.healthPercent ?? 0,
      healthStatus: normalizeHealthStatus(vehicle.filterKey),
    }));
}

export function getFleetSummaryLabel(data?: StaffHealthReportVehiclesData): string {
  return (
    data?.fleetHealthSummary?.label?.trim() ||
    "Fleet Health Summary"
  );
}

export function getFleetOverviewLabel(data?: StaffHealthReportVehiclesData): string {
  return (
    data?.fleetHealthSummary?.overviewLabel?.trim() ||
    (typeof data?.total === "number" ? `${data.total} vehicles` : "Vehicles")
  );
}

export function mapHealthReportDetail(
  detail: StaffHealthReportDetailRaw,
): HealthReport {
  const healthPercent =
    detail.overallCondition?.healthPercent ?? detail.healthPercent ?? 0;
  const status = normalizeHealthStatus(detail.filterKey);
  const isOverdue =
    detail.overallCondition?.isServiceOverdue ?? detail.isOverdueService ?? false;
  const overdueDays = parseOverdueDays(
    detail.serviceDue?.overdueDays ?? detail.overdueDays,
  );
  const vehicle = detail.displayName?.trim() || fallbackVehicleName(detail);
  const serviceDue = detail.serviceDue?.serviceDueDisplay?.trim() || "—";
  const member = detail.serviceDue?.memberName?.trim() || detail.memberName?.trim() || "—";

  return {
    id: detail.id ?? "",
    reference: detail.healthReportRef?.trim() || "—",
    vehicle,
    yearColorBay: detail.subtitle?.trim() || "—",
    healthPercent,
    healthStatus: status,
    isOverdue,
    overdueDays,
    overdueSummary:
      isOverdue
        ? `${vehicle} · ${detail.overdueLabel?.trim() || "Service overdue"} · Immediate action required`
        : undefined,
    mileage: detail.mileage?.trim() || "—",
    lastService: detail.lastServiceDisplay?.trim() || "—",
    member,
    serviceDue,
    overallCondition:
      detail.overallCondition?.statusLabel?.trim() ||
      detail.statusLabel?.trim() ||
      "Health Report",
    systemMetrics: (detail.systemBreakdown?.items ?? []).map((item) => {
      const value = item.percentage ?? 0;
      return {
        label: item.label?.trim() || "System",
        value,
        tone: healthTone(value),
      };
    }),
    flaggedIssues: (detail.flaggedIssues?.items ?? []).map((issue, index) => ({
      id: issue.id ?? `issue-${index}`,
      title: issue.title?.trim() || "Flagged Issue",
      description: issue.detail?.trim() || issue.category?.trim() || "Review required",
      actionLabel: issueActionLabel(issue.actionLabel),
    })),
    serviceHistory: (detail.serviceHistory?.items ?? []).map((entry, index) => ({
      id: entry.id ?? `service-${index}`,
      date: entry.date?.trim() || "—",
      title: entry.title?.trim() || "Service Entry",
      location: entry.location?.trim() || "—",
      detail: entry.detail?.trim() || "—",
    })),
  };
}
