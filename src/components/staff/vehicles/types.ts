export type VehicleStatus =
  | "in-service"
  | "ready"
  | "overdue"
  | "dispatched"
  | "away"
  | "in-progress"
  | "pending"
  | "done"
  | "critical"
  | "due-service"
  | "good"
  | "excellent";

export type VehicleListItem = {
  id: string;
  name: string;
  bay: string;
  member: string;
  mileage: string;
  status: VehicleStatus;
  healthPercent?: number;
};

export type HealthMetric = {
  label: string;
  value: number;
  tone: "pink" | "gold" | "teal";
};

export type ServiceHistoryEntry = {
  id: string;
  date: string;
  title: string;
  location: string;
  detail: string;
};

export type VehicleDetail = {
  id: string;
  name: string;
  bay: string;
  mileage: string;
  member: string;
  memberBadge?: string;
  isOverdue: boolean;
  health: HealthMetric[];
  condition: HealthMetric[];
  serviceHistory: ServiceHistoryEntry[];
};

export type VehicleStatItem = {
  label: string;
  value: string;
  subtext: string;
};

export type VehicleStatsDisplay = {
  total: VehicleStatItem;
  ready: VehicleStatItem;
  inService: VehicleStatItem;
  overdue: VehicleStatItem;
};
