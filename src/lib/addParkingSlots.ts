import type { AddSlotsFormState } from "@/components/staff/vehicles/add-slots/types";
import {
  BAY_PREFIX_OPTIONS,
  MAX_SLOTS,
} from "@/components/staff/vehicles/add-slots/types";
import type { StaffParkingSlotCreateRequest } from "@/types/api";

export type AddSlotsFieldErrors = Partial<
  Record<keyof AddSlotsFormState | "slots" | "openTime" | "closeTime", string>
>;

export type ParkingSlotPreview = {
  slotCode: string;
  label: string;
};

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export function parseBayNumber(value: string): number | null {
  const trimmed = value.trim();

  if (!/^\d+$/.test(trimmed)) {
    return null;
  }

  const number = Number.parseInt(trimmed, 10);

  if (!Number.isFinite(number) || number < 1 || number > 99) {
    return null;
  }

  return number;
}

export function formatPaddedNumber(value: number): string {
  return String(value).padStart(2, "0");
}

export function buildSlotLabel(slotCode: string): string {
  return `Bay ${slotCode}`;
}

function buildSlotEntries(form: AddSlotsFormState) {
  const bayPrefix = form.bayPrefix.trim().toUpperCase();

  if (!form.createMultiple) {
    const bayNumber = parseBayNumber(form.baySuffix) ?? 1;
    const level = formatPaddedNumber(bayNumber);
    const slotCode = `${bayPrefix}${level}`;

    return [
      {
        slotCode,
        level,
        zone: bayPrefix,
        label: buildSlotLabel(slotCode),
      },
    ];
  }

  return Array.from({ length: form.slotCount }, (_, index) => {
    const level = formatPaddedNumber(index + 1);
    const slotCode = `${bayPrefix}${level}`;

    return {
      slotCode,
      level,
      zone: bayPrefix,
      label: buildSlotLabel(slotCode),
    };
  });
}

export function getPreviewSlots(form: AddSlotsFormState): ParkingSlotPreview[] {
  return buildSlotEntries(form).map((slot) => ({
    slotCode: slot.slotCode,
    label: slot.label,
  }));
}

export function buildParkingSlotPayloads(
  form: AddSlotsFormState,
): StaffParkingSlotCreateRequest[] {
  const notes = form.notes.trim();

  return buildSlotEntries(form).map((slot) => ({
    slotCode: slot.slotCode,
    level: slot.level,
    zone: slot.zone,
    label: slot.label,
    slotType: form.slotType,
    openTime: form.openTime,
    closeTime: form.closeTime,
    status: "available",
    ...(notes ? { notes } : {}),
  }));
}

function parseMinutes(value: string): number | null {
  const match = value.match(TIME_PATTERN);

  if (!match) {
    return null;
  }

  const [hours, minutes] = value.split(":").map(Number);

  return hours * 60 + minutes;
}

export function validateAddSlotsForm(
  form: AddSlotsFormState,
): AddSlotsFieldErrors {
  const errors: AddSlotsFieldErrors = {};
  const bayPrefix = form.bayPrefix.trim().toUpperCase();

  if (
    !BAY_PREFIX_OPTIONS.includes(
      bayPrefix as (typeof BAY_PREFIX_OPTIONS)[number],
    )
  ) {
    errors.bayPrefix = "Select A, B, or C";
  }

  if (!form.createMultiple) {
    if (!form.baySuffix.trim()) {
      errors.baySuffix = "Please enter a bay number";
    } else if (parseBayNumber(form.baySuffix) === null) {
      errors.baySuffix = "Use a number between 01 and 99";
    }
  } else if (!Number.isFinite(form.slotCount) || form.slotCount < 1) {
    errors.slotCount = "Add at least one slot";
  } else if (form.slotCount > MAX_SLOTS) {
    errors.slotCount = `Maximum ${MAX_SLOTS} slots per batch`;
  }

  if (!TIME_PATTERN.test(form.openTime)) {
    errors.openTime = "Enter a valid open time";
  }

  if (!TIME_PATTERN.test(form.closeTime)) {
    errors.closeTime = "Enter a valid close time";
  }

  const openMinutes = parseMinutes(form.openTime);
  const closeMinutes = parseMinutes(form.closeTime);

  if (
    openMinutes !== null &&
    closeMinutes !== null &&
    closeMinutes <= openMinutes
  ) {
    errors.closeTime = "Close time must be after open time";
  }

  return errors;
}

export function hasAddSlotsErrors(errors: AddSlotsFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function getSubmitSlotCount(form: AddSlotsFormState): number {
  return form.createMultiple ? form.slotCount : 1;
}
