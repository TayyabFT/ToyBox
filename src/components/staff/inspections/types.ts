import type { VehicleStatus } from "@/components/staff/vehicles/types";

export type InspectionQueueItem = {
  id: string;
  reference: string;
  vehicle: string;
  serviceType: string;
  bay: string;
  assignee: string;
  time: string;
  status: VehicleStatus;
};

export type InspectionSummaryKey =
  | "dueToday"
  | "inProgress"
  | "completedThisShift"
  | "flaggedIssues";

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
  stepId?: InspectionStepId;
};

export type InspectionPhoto = {
  id: string;
  url: string;
  itemKey?: string;
  caption?: string;
  createdAt?: string;
};

export type ActiveInspection = {
  id?: string;
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
    itemKey?: string;
  };
  odometer: string;
  fuelLevel: string;
  notes?: string;
  photos: InspectionPhoto[];
  statusKey?: string;
};

export type InspectionStats = {
  dueToday: { value: string; subtext: string; summaryKey: InspectionSummaryKey };
  inProgress: { value: string; subtext: string; summaryKey: InspectionSummaryKey };
  completed: { value: string; subtext: string; summaryKey: InspectionSummaryKey };
  flagged: { value: string; subtext: string; summaryKey: InspectionSummaryKey };
};
