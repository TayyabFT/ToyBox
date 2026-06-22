export type ServiceRequestFilter =
  | "all"
  | "urgent"
  | "transport"
  | "detailing"
  | "maintenance";

export type ServiceCategory = "transport" | "maintenance" | "detailing";

export type JobStatusTone =
  | "urgent"
  | "assigned"
  | "overdue"
  | "in-progress"
  | "pending"
  | "active";

export type ServiceRequestStat = {
  label: string;
  value: string;
  subtext: string;
  icon: "urgent" | "transport" | "in-progress" | "completed";
};

export type TransportJob = {
  id: string;
  title: string;
  jobId: string;
  member: string;
  vehicle: string;
  tier?: string;
  status: JobStatusTone;
  statusLabel: string;
  from: string;
  to: string;
  scheduled: string;
  notes?: string;
  assignee?: string;
  isUrgent?: boolean;
  category: "transport";
};

export type MaintenanceJob = {
  id: string;
  title: string;
  jobId: string;
  member: string;
  vehicle: string;
  status: JobStatusTone;
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

export type DetailingJob = {
  id: string;
  title: string;
  jobId: string;
  member: string;
  vehicle: string;
  status: JobStatusTone;
  statusLabel: string;
  type: string;
  addOn?: string;
  estimate: string;
  scheduled?: string;
  bay?: string;
  location?: string;
  notes?: string;
  progress?: number;
  progressNote?: string;
  category: "detailing";
};

export type ActiveJobStep = {
  id: string;
  label: string;
  completed: boolean;
  time?: string;
};

export type ActiveJobDetail = {
  jobId: string;
  categoryLabel: string;
  statusLabel: string;
  statusTone: JobStatusTone;
  vehicle: string;
  subtitle: string;
  assignee: string;
  pickup: { label: string; detail: string };
  dropoff: { label: string; detail: string };
  steps: ActiveJobStep[];
  specialInstructions: string;
};

export type SectionMeta = {
  title: string;
  requestCount: number;
  highlightLabel: string;
};
