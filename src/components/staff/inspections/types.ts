import type { VehicleStatus } from "@/components/staff/vehicles/types";

export type InspectionQueueItem = {
  id: string;
  vehicle: string;
  serviceType: string;
  bay: string;
  assignee: string;
  time: string;
  status: VehicleStatus;
};

export type InspectionStepId = "exterior" | "interior" | "mechanical" | "tyres";

export type InspectionStep = {
  id: InspectionStepId;
  label: string;
  state: "complete" | "active" | "upcoming";
};

export type ChecklistItemState = "ok" | "issue" | "pending";

export type InspectionChecklistItem = {
  id: string;
  label: string;
  state: ChecklistItemState;
};

export type ActiveInspection = {
  reference: string;
  vehicle: string;
  bay: string;
  mileage: string;
  inspectionType: string;
  steps: InspectionStep[];
  activeStepId: InspectionStepId;
  checklist: InspectionChecklistItem[];
  flaggedIssue?: {
    tag: string;
    notes: string;
  };
  odometer: string;
  fuelLevel: string;
};

export type InspectionStats = {
  dueToday: { value: string; subtext: string };
  inProgress: { value: string; subtext: string };
  completed: { value: string; subtext: string };
  flagged: { value: string; subtext: string };
};
