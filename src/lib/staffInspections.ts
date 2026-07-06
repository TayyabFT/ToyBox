import type { VehicleStatus } from "@/components/staff/vehicles/types";
import type {
  ActiveInspection,
  InspectionChecklistItem,
  InspectionQueueItem,
  InspectionStats,
  InspectionStep,
  InspectionStepId,
} from "@/components/staff/inspections/types";
import type {
  StaffInspectionChecklistItemRaw,
  StaffInspectionDashboardSummaryRaw,
  StaffInspectionDetailRaw,
  StaffInspectionDraftRequest,
  StaffInspectionQueueItemRaw,
  StaffInspectionStatRaw,
  StaffInspectionStepRaw,
} from "@/types/api";

const STEP_ORDER: InspectionStepId[] = [
  "exterior",
  "interior",
  "mechanical",
  "tyres",
];

const STEP_LABELS: Record<InspectionStepId, string> = {
  exterior: "Exterior",
  interior: "Interior",
  mechanical: "Mechanical",
  tyres: "Tyres",
};

function readText(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" && !Number.isNaN(value)) {
    return String(value);
  }

  return "";
}

function mapStatCard(
  stat?: StaffInspectionStatRaw,
  fallbackValue = "0",
  fallbackSubtext = "—",
): { value: string; subtext: string } {
  const value =
    stat?.value !== undefined && stat?.value !== null
      ? String(stat.value)
      : fallbackValue;

  return {
    value,
    subtext:
      stat?.subtitle?.trim() ||
      stat?.subtext?.trim() ||
      stat?.label?.trim() ||
      fallbackSubtext,
  };
}

export function mapInspectionStats(
  summary?: StaffInspectionDashboardSummaryRaw | null,
): InspectionStats {
  return {
    dueToday: mapStatCard(summary?.dueToday, "0", "Inspections Pending"),
    inProgress: mapStatCard(summary?.inProgress, "0", "Active Now"),
    completed: mapStatCard(
      summary?.completedThisShift ?? summary?.completed,
      "0",
      "This Shift",
    ),
    flagged: mapStatCard(
      summary?.flaggedIssues ?? summary?.flagged,
      "0",
      "Needs Review",
    ),
  };
}

function mapQueueStatus(statusKey?: string): VehicleStatus {
  const normalized = statusKey?.trim().toLowerCase().replace(/_/g, "-") ?? "";

  if (normalized.includes("progress")) return "in-progress";
  if (normalized.includes("overdue")) return "overdue";
  if (normalized.includes("complete") || normalized.includes("done")) {
    return "done";
  }

  if (normalized.includes("critical")) return "critical";
  if (normalized.includes("pending")) return "pending";

  return "pending";
}

function resolveVehicleLabel(vehicle?: StaffInspectionQueueItemRaw["vehicle"]): string {
  if (typeof vehicle === "string") {
    return vehicle.trim() || "Vehicle";
  }

  return (
    vehicle?.displayName?.trim() ||
    vehicle?.name?.trim() ||
    [vehicle?.make?.trim(), vehicle?.model?.trim()].filter(Boolean).join(" ") ||
    vehicle?.label?.trim() ||
    "Vehicle"
  );
}

function resolveStaffLabel(
  staff?: StaffInspectionQueueItemRaw["assignedStaff"],
  fallback?: string,
): string {
  if (typeof staff === "string") {
    return staff.trim() || fallback || "Unassigned";
  }

  return staff?.name?.trim() || staff?.label?.trim() || fallback || "Unassigned";
}

function formatQueueTime(scheduledAt?: string, time?: string): string {
  if (time?.trim()) {
    return time.trim();
  }

  if (!scheduledAt?.trim()) {
    return "—";
  }

  const date = new Date(scheduledAt);

  if (Number.isNaN(date.getTime())) {
    return scheduledAt;
  }

  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function mapInspectionQueueItem(
  item: StaffInspectionQueueItemRaw,
): InspectionQueueItem | null {
  if (item.id === undefined || item.id === null) {
    return null;
  }

  const bay = item.bay?.trim() || "—";
  const normalizedBay = bay.toLowerCase().startsWith("bay") ? bay : `Bay ${bay}`;

  return {
    id: String(item.id),
    vehicle: resolveVehicleLabel(item.vehicle),
    serviceType:
      item.serviceType?.trim() ||
      item.inspectionType?.trim() ||
      "Inspection",
    bay: normalizedBay,
    assignee:
      resolveStaffLabel(item.assignedStaff, item.assigneeName?.trim()) ||
      item.assignee?.trim() ||
      "Unassigned",
    time: formatQueueTime(item.scheduledAt, item.time),
    status: mapQueueStatus(item.statusKey ?? item.status),
  };
}

export function mapInspectionQueue(
  items?: StaffInspectionQueueItemRaw[],
): InspectionQueueItem[] {
  return (items ?? [])
    .map((item) => mapInspectionQueueItem(item))
    .filter((item): item is InspectionQueueItem => Boolean(item));
}

function normalizeStepId(value?: string): InspectionStepId | null {
  const normalized = value?.trim().toLowerCase() ?? "";

  if (STEP_ORDER.includes(normalized as InspectionStepId)) {
    return normalized as InspectionStepId;
  }

  if (normalized.includes("exterior")) return "exterior";
  if (normalized.includes("interior")) return "interior";
  if (normalized.includes("mechanic")) return "mechanical";
  if (normalized.includes("tyre") || normalized.includes("tire")) return "tyres";

  return null;
}

function mapChecklistState(status?: string): InspectionChecklistItem["state"] {
  const normalized = status?.trim().toLowerCase() ?? "";

  if (
    normalized.includes("issue") ||
    normalized.includes("flag") ||
    normalized.includes("fail")
  ) {
    return "issue";
  }

  if (
    normalized.includes("ok") ||
    normalized.includes("pass") ||
    normalized.includes("checked") ||
    normalized.includes("complete")
  ) {
    return "ok";
  }

  return "pending";
}

export function mapChecklistStateToApi(
  state: InspectionChecklistItem["state"],
): string {
  switch (state) {
    case "ok":
      return "ok";
    case "issue":
      return "issue";
    default:
      return "unchecked";
  }
}

function mapChecklistItem(
  item: StaffInspectionChecklistItemRaw,
  index: number,
): InspectionChecklistItem {
  const key = item.key?.trim() || String(item.id ?? `item-${index + 1}`);

  return {
    id: key,
    label: item.label?.trim() || `Checklist item ${index + 1}`,
    state: mapChecklistState(item.status),
  };
}

function buildSteps(
  rawSteps: StaffInspectionStepRaw[] | undefined,
  currentStep?: string,
): { steps: InspectionStep[]; activeStepId: InspectionStepId } {
  const activeStepId = normalizeStepId(currentStep) ?? "exterior";
  const rawById = new Map<InspectionStepId, StaffInspectionStepRaw>();

  (rawSteps ?? []).forEach((step) => {
    const id = normalizeStepId(step.key ?? step.id);

    if (id) {
      rawById.set(id, step);
    }
  });

  const activeIndex = STEP_ORDER.indexOf(activeStepId);
  const steps = STEP_ORDER.map((id, index) => {
    const raw = rawById.get(id);
    const rawState = raw?.state?.trim().toLowerCase() ?? raw?.status?.trim().toLowerCase();

    let state: InspectionStep["state"] = "upcoming";

    if (rawState?.includes("complete") || rawState?.includes("done")) {
      state = "complete";
    } else if (index < activeIndex) {
      state = "complete";
    } else if (id === activeStepId) {
      state = "active";
    }

    return {
      id,
      label:
        raw?.label?.trim() ||
        STEP_LABELS[id],
      state,
    };
  });

  return { steps, activeStepId };
}

function formatMileage(value?: string | number): string {
  const text = readText(value);

  if (!text) {
    return "—";
  }

  if (text.toLowerCase().includes("km")) {
    return text;
  }

  const numeric = Number(text.replace(/,/g, ""));

  if (!Number.isNaN(numeric)) {
    return `${numeric.toLocaleString("en-GB")} km`;
  }

  return text;
}

export function mapActiveInspection(
  data?: StaffInspectionDetailRaw | null,
): ActiveInspection | null {
  if (!data || (data.id === undefined && !data.referenceNumber)) {
    return null;
  }

  const { steps, activeStepId } = buildSteps(
    data.steps,
    data.currentStep ?? data.activeStep,
  );

  const checklist = (data.checklist ?? []).map(mapChecklistItem);
  const flagged = data.flaggedIssue ?? data.flaggedIssues?.[0];
  const fuelLevel = data.fuelLevel?.trim() || "—";
  const normalizedFuel = fuelLevel.toLowerCase().includes("tank")
    ? fuelLevel
    : fuelLevel === "—"
      ? fuelLevel
      : `${fuelLevel} Tank`;

  return {
    id: data.id !== undefined ? String(data.id) : undefined,
    reference: data.referenceNumber?.trim() || data.reference?.trim() || "—",
    vehicle: resolveVehicleLabel(data.vehicle),
    bay: data.bay?.trim() || "—",
    mileage: formatMileage(data.mileage ?? data.odometerReading),
    inspectionType:
      data.inspectionType?.trim() || data.type?.trim() || "Inspection",
    steps,
    activeStepId,
    checklist,
    flaggedIssue: flagged
      ? {
          tag:
            flagged.tag?.trim() ||
            flagged.label?.trim() ||
            "Flagged issue",
          notes: flagged.notes?.trim() || flagged.note?.trim() || "",
        }
      : undefined,
    odometer: readText(data.odometerReading ?? data.mileage) || "—",
    fuelLevel: normalizedFuel,
    notes: data.notes?.trim() || flagged?.notes?.trim() || flagged?.note?.trim(),
  };
}

export function buildInspectionDraftPayload(
  inspection: ActiveInspection,
): StaffInspectionDraftRequest {
  return {
    currentStep: inspection.activeStepId,
    checklist: inspection.checklist.map((item) => ({
      key: item.id,
      status: mapChecklistStateToApi(item.state),
    })),
    odometerReading: inspection.odometer,
    fuelLevel: inspection.fuelLevel.replace(/\s+Tank$/i, "").trim(),
    notes: inspection.notes,
  };
}

export function getAdjacentStepId(
  current: InspectionStepId,
  direction: "back" | "next",
): InspectionStepId | null {
  const index = STEP_ORDER.indexOf(current);

  if (index === -1) {
    return null;
  }

  const nextIndex = direction === "back" ? index - 1 : index + 1;

  if (nextIndex < 0 || nextIndex >= STEP_ORDER.length) {
    return null;
  }

  return STEP_ORDER[nextIndex];
}

export function setActiveStep(
  inspection: ActiveInspection,
  stepId: InspectionStepId,
): ActiveInspection {
  const stepIndex = STEP_ORDER.indexOf(stepId);

  return {
    ...inspection,
    activeStepId: stepId,
    steps: inspection.steps.map((step, index) => {
      if (index < stepIndex) {
        return { ...step, state: "complete" };
      }

      if (step.id === stepId) {
        return { ...step, state: "active" };
      }

      return { ...step, state: "upcoming" };
    }),
  };
}

export function cycleChecklistItemState(
  state: InspectionChecklistItem["state"],
): InspectionChecklistItem["state"] {
  if (state === "pending") return "ok";
  if (state === "ok") return "issue";
  return "pending";
}
