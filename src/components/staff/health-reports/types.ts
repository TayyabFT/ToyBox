import type {
  HealthMetric,
  ServiceHistoryEntry,
  VehicleStatus,
} from "@/components/staff/vehicles/types";

export type HealthFilter = "all" | "critical" | "due-service" | "healthy";

export type HealthReportTab = {
  id: HealthFilter;
  label: string;
};

export type FleetHealthItem = {
  id: string;
  vehicle: string;
  bay: string;
  member: string;
  mileage: string;
  healthPercent: number;
  healthStatus: VehicleStatus;
};

export type FlaggedIssue = {
  id: string;
  title: string;
  description: string;
  actionLabel: "BOOK NOW" | "SCHEDULE";
};

export type HealthReport = {
  id: string;
  reference: string;
  vehicle: string;
  yearColorBay: string;
  healthPercent: number;
  healthStatus: VehicleStatus;
  isOverdue: boolean;
  overdueDays?: number;
  overdueSummary?: string;
  mileage: string;
  lastService: string;
  member: string;
  serviceDue: string;
  overallCondition: string;
  systemMetrics: HealthMetric[];
  flaggedIssues: FlaggedIssue[];
  serviceHistory: ServiceHistoryEntry[];
};
