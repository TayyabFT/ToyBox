export type WorkshopBayStatus =
  | "overdue"
  | "active"
  | "final-check"
  | "in-transit"
  | "track-repairs";

export type WorkshopStatItem = {
  label: string;
  value: string;
  footnote: string;
  valueTone?: "default" | "pink" | "white" | "gold";
  iconTone?: "default" | "pink";
  trend?: string;
};

export type ActiveBayItem = {
  id: string;
  bay: string;
  status: WorkshopBayStatus;
  statusLabel: string;
  vehicleMake: string;
  vehicleModel: string;
  memberName: string;
  memberNumber: string;
  description: string;
  engineer: string;
  engineerRole?: string;
  timeLabel: string;
  timeTone?: "pink" | "gold" | "teal";
};

export type ServiceQueueItem = {
  id: string;
  date: string;
  memberInitial: string;
  memberName: string;
  memberNumber: string;
  vehicleMake: string;
  vehicleModel: string;
  service: string;
  engineer: string;
  estimate: string;
};
