import type { StaffInspectionType } from "@/types/api";

export const INSPECTION_TYPE_OPTIONS = [
  { value: "pre_service", label: "Pre-Service" },
  { value: "storage_check_in", label: "Storage Check-In" },
  { value: "general", label: "General" },
] as const satisfies ReadonlyArray<{
  value: StaffInspectionType;
  label: string;
}>;

export type AddInspectionFormState = {
  vehicleId: string;
  memberId: string;
  inspectionType: StaffInspectionType;
  scheduledAt: string;
  bay: string;
  assignedStaffId: string;
  odometerReading: string;
  fuelLevel: string;
};

export const FUEL_LEVEL_OPTIONS = [
  { value: "", label: "Not set" },
  { value: "0", label: "Empty" },
  { value: "1/4", label: "1/4" },
  { value: "1/2", label: "1/2" },
  { value: "3/4", label: "3/4" },
  { value: "1", label: "Full" },
] as const;

export function createInitialAddInspectionForm(): AddInspectionFormState {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  now.setHours(now.getHours() + 1);

  const pad = (value: number) => String(value).padStart(2, "0");
  const scheduledAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:00`;

  return {
    vehicleId: "",
    memberId: "",
    inspectionType: "pre_service",
    scheduledAt,
    bay: "",
    assignedStaffId: "",
    odometerReading: "",
    fuelLevel: "3/4",
  };
}
