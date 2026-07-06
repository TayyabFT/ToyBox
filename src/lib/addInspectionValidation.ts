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
    bay: form.bay.trim(),
    assignedStaffId: form.assignedStaffId.trim(),
    odometerReading: form.odometerReading.trim() || undefined,
    fuelLevel: form.fuelLevel.trim() || undefined,
  };
}

export type CreateInspectionResult =
  | { ok: true }
  | { ok: false; message?: string; fieldErrors?: AddInspectionFieldErrors };

export function mapApiValidationErrors(
  errors?: ApiFieldError[],
): AddInspectionFieldErrors {
  const mapped: AddInspectionFieldErrors = {};
  const formFields: Array<keyof AddInspectionFormState> = [
    "vehicleId",
    "memberId",
    "inspectionType",
    "scheduledAt",
    "bay",
    "assignedStaffId",
    "odometerReading",
    "fuelLevel",
  ];

  for (const item of errors ?? []) {
    const field = item.field?.trim();

    if (!field) {
      continue;
    }

    if (formFields.includes(field as keyof AddInspectionFormState)) {
      mapped[field as keyof AddInspectionFormState] =
        item.message?.trim() || "Invalid value";
    }
  }

  return mapped;
}
