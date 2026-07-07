import type { AddInspectionFormState } from "@/components/staff/inspections/add-inspection/types";
import type {
  ApiFieldError,
  StaffInspectionCreateRequest,
  StaffInspectionType,
} from "@/types/api";

export const STAFF_INSPECTION_TYPES = [
  "pre_service",
  "storage_check_in",
  "general",
] as const satisfies readonly StaffInspectionType[];

export type AddInspectionFieldErrors = Partial<
  Record<keyof AddInspectionFormState, string>
>;

export function isStaffInspectionType(
  value: string,
): value is StaffInspectionType {
  return (STAFF_INSPECTION_TYPES as readonly string[]).includes(value);
}

export function resolveInspectionType(
  value: string,
): StaffInspectionType | null {
  const trimmed = value.trim();

  if (isStaffInspectionType(trimmed)) {
    return trimmed;
  }

  const normalized = trimmed
    .toLowerCase()
    .replace(/[\s-]+/g, "_")
    .replace(/_+/g, "_");

  if (isStaffInspectionType(normalized)) {
    return normalized;
  }

  if (normalized === "preservice") {
    return "pre_service";
  }

  if (normalized === "storage_checkin" || normalized === "storage_check_in") {
    return "storage_check_in";
  }

  return null;
}

export function validateAddInspectionForm(
  form: AddInspectionFormState,
): AddInspectionFieldErrors {
  const errors: AddInspectionFieldErrors = {};

  if (!form.vehicleId.trim()) {
    errors.vehicleId = "Please select a vehicle";
  }

  if (!form.memberId.trim()) {
    errors.memberId = "Please select a member";
  }

  const inspectionType = resolveInspectionType(form.inspectionType);

  if (!inspectionType) {
    errors.inspectionType =
      "Select a valid inspection type (Pre-Service, Storage Check-In, or General)";
  }

  if (!form.scheduledAt.trim()) {
    errors.scheduledAt = "Please choose a schedule date and time";
  } else if (Number.isNaN(new Date(form.scheduledAt).getTime())) {
    errors.scheduledAt = "Invalid schedule date and time";
  }

  if (!form.bay.trim()) {
    errors.bay = "Please enter a bay";
  }

  if (!form.assignedStaffId.trim()) {
    errors.assignedStaffId = "Please assign staff";
  }

  if (form.odometerReading.trim() && !/^\d+$/.test(form.odometerReading.trim())) {
    errors.odometerReading = "Odometer must be a whole number";
  }

  return errors;
}

export function hasAddInspectionErrors(
  errors: AddInspectionFieldErrors,
): boolean {
  return Object.values(errors).some(Boolean);
}

export function normalizeBayForApi(bay: string): string {
  return bay.trim().replace(/^bay\s+/i, "").trim();
}

export function normalizeFuelLevelForApi(fuelLevel: string): string | undefined {
  const trimmed = fuelLevel.trim();

  if (!trimmed || trimmed === "—") {
    return undefined;
  }

  const normalized = trimmed.toLowerCase();

  if (normalized === "empty") return "0";
  if (normalized === "full") return "1";

  return trimmed.replace(/\s+Tank$/i, "").trim() || undefined;
}

export function normalizeOdometerForApi(value?: string): string | undefined {
  const trimmed = value?.trim();

  if (!trimmed || trimmed === "—") {
    return undefined;
  }

  const digits = trimmed.replace(/,/g, "").replace(/[^\d]/g, "");

  return digits || undefined;
}

export function resolveApiFieldName(
  field?: string,
): keyof AddInspectionFormState | null {
  if (!field?.trim()) {
    return null;
  }

  const tail = field.trim().split(".").pop() ?? field.trim();
  const camel = tail.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());
  const formFields: Array<keyof AddInspectionFormState> = [
    "vehicleId",
    "memberId",
    "inspectionType",
    "scheduledAt",
    "assignedStaffId",
    "odometerReading",
    "fuelLevel",
    "bay",
  ];

  if (formFields.includes(camel as keyof AddInspectionFormState)) {
    return camel as keyof AddInspectionFormState;
  }

  const lowered = tail.toLowerCase();

  for (const formField of formFields) {
    if (lowered === formField.toLowerCase()) {
      return formField;
    }
  }

  return null;
}

export function buildCreateInspectionBody(
  form: AddInspectionFormState,
): StaffInspectionCreateRequest | null {
  const errors = validateAddInspectionForm(form);

  if (hasAddInspectionErrors(errors)) {
    return null;
  }

  const inspectionType = resolveInspectionType(form.inspectionType);

  if (!inspectionType) {
    return null;
  }

  const scheduledDate = new Date(form.scheduledAt);

  if (Number.isNaN(scheduledDate.getTime())) {
    return null;
  }

  return {
    vehicleId: form.vehicleId.trim(),
    memberId: form.memberId.trim(),
    inspectionType,
    scheduledAt: scheduledDate.toISOString(),
    bay: normalizeBayForApi(form.bay),
    assignedStaffId: form.assignedStaffId.trim(),
    odometerReading: form.odometerReading.trim() || undefined,
    fuelLevel: normalizeFuelLevelForApi(form.fuelLevel),
  };
}

export type CreateInspectionResult =
  | { ok: true; createdId?: string }
  | { ok: false; message?: string; fieldErrors?: AddInspectionFieldErrors };

export function mapApiValidationErrors(
  errors?: ApiFieldError[],
): AddInspectionFieldErrors {
  const mapped: AddInspectionFieldErrors = {};

  for (const item of errors ?? []) {
    const field = resolveApiFieldName(item.field);

    if (!field) {
      continue;
    }

    mapped[field] = item.message?.trim() || "Invalid value";
  }

  return mapped;
}
