import {
  ACCEPTED_VEHICLE_IMAGE_TYPES,
  DOC_FIELDS,
  HEALTH_CATEGORIES,
  MAX_VEHICLE_IMAGES,
  MAX_VEHICLE_IMAGE_BYTES,
  type AddVehicleFormState,
  type DocsForm,
  type HealthForm,
  type OwnershipInfoForm,
  type VehicleInfoForm,
} from "@/components/staff/vehicles/add-vehicle/types";

export type VehicleInfoErrors = Partial<Record<keyof VehicleInfoForm, string>>;
export type OwnershipInfoErrors = Partial<
  Record<keyof OwnershipInfoForm, string>
>;
export type DocsErrors = Partial<Record<keyof DocsForm, string>>;
export type HealthErrors = Partial<
  Record<(typeof HEALTH_CATEGORIES)[number]["key"], string>
>;

export type AddVehicleStepErrors = {
  vehicleInfo?: VehicleInfoErrors;
  ownershipInfo?: OwnershipInfoErrors;
  docs?: DocsErrors;
  health?: HealthErrors;
};

function hasFieldErrors<T extends Record<string, string | undefined>>(
  errors: T,
): boolean {
  return Object.values(errors).some(Boolean);
}

function requireText(value: string, label: string): string | undefined {
  if (!value.trim()) {
    return `${label} is required`;
  }

  return undefined;
}

function validateYear(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Year is required";
  }

  if (!/^\d{4}$/.test(trimmed)) {
    return "Enter a valid 4-digit year";
  }

  const year = Number.parseInt(trimmed, 10);
  const currentYear = new Date().getFullYear();

  if (year < 1900 || year > currentYear + 1) {
    return `Enter a year between 1900 and ${currentYear + 1}`;
  }

  return undefined;
}

function validateMileage(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Mileage is required";
  }

  if (!/\d/.test(trimmed)) {
    return "Enter a valid mileage";
  }

  return undefined;
}

function validatePurchasedDate(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Purchased date is required";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return undefined;
  }

  if (/^[A-Za-z]+\s+\d{4}$/.test(trimmed)) {
    const date = new Date(`${trimmed.replace(/\s+/, " 1, ")}`);

    if (!Number.isNaN(date.getTime())) {
      return undefined;
    }
  }

  const parsed = Date.parse(trimmed);

  if (!Number.isNaN(parsed)) {
    return undefined;
  }

  return "Enter a valid date (e.g. Jan 2022)";
}

function validateChassisNo(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Chassis number is required";
  }

  if (trimmed.length < 5) {
    return "Chassis number must be at least 5 characters";
  }

  if (!/^[A-Za-z0-9-]+$/.test(trimmed)) {
    return "Chassis number can only contain letters, numbers, and hyphens";
  }

  return undefined;
}

function validateVehicleImages(files: File[]): string | undefined {
  if (files.length > MAX_VEHICLE_IMAGES) {
    return `You can upload up to ${MAX_VEHICLE_IMAGES} images`;
  }

  if (files.some((file) => file.size > MAX_VEHICLE_IMAGE_BYTES)) {
    return "Each image must be 1MB or smaller";
  }

  if (
    files.some(
      (file) => !ACCEPTED_VEHICLE_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_VEHICLE_IMAGE_TYPES)[number]),
    )
  ) {
    return "Only JPEG, PNG, WEBP, and GIF images are allowed";
  }

  return undefined;
}

export function validateVehicleInfoStep(
  form: VehicleInfoForm,
): VehicleInfoErrors {
  return {
    name: requireText(form.name, "Name"),
    model: requireText(form.model, "Model"),
    year: validateYear(form.year),
    engine: requireText(form.engine, "Engine"),
    power: requireText(form.power, "Power"),
    transmission: requireText(form.transmission, "Transmission"),
    drive: requireText(form.drive, "Drive"),
    zeroToHundred: requireText(form.zeroToHundred, "0-100 km/h"),
    topSpeed: requireText(form.topSpeed, "Top speed"),
    vehicleImages: validateVehicleImages(form.vehicleImages),
  };
}

export function validateOwnershipInfoStep(
  form: OwnershipInfoForm,
): OwnershipInfoErrors {
  return {
    colour: requireText(form.colour, "Colour"),
    chassisNo: validateChassisNo(form.chassisNo),
    plate: requireText(form.plate, "Plate"),
    purchased: validatePurchasedDate(form.purchased),
    storageBay: requireText(form.storageBay, "Storage bay"),
    mileage: validateMileage(form.mileage),
  };
}

export function validateDocsStep(form: DocsForm): DocsErrors {
  return DOC_FIELDS.reduce((errors, field) => {
    if (!form[field.key]) {
      errors[field.key] = `${field.label} is required`;
    }

    return errors;
  }, {} as DocsErrors);
}

export function validateHealthStep(form: HealthForm): HealthErrors {
  return HEALTH_CATEGORIES.reduce((errors, category) => {
    const item = form[category.key];

    if (item.noteOpen && !item.note.trim()) {
      errors[category.key] = "Note is required when added";
    }

    return errors;
  }, {} as HealthErrors);
}

export function validateVehicleInfoStepIsValid(form: VehicleInfoForm): boolean {
  return !hasFieldErrors(validateVehicleInfoStep(form));
}

export function validateOwnershipInfoStepIsValid(
  form: OwnershipInfoForm,
): boolean {
  return !hasFieldErrors(validateOwnershipInfoStep(form));
}

export function validateDocsStepIsValid(form: DocsForm): boolean {
  return !hasFieldErrors(validateDocsStep(form));
}

export function validateHealthStepIsValid(form: HealthForm): boolean {
  return !hasFieldErrors(validateHealthStep(form));
}

export function validateAddVehicleFormSteps(
  form: AddVehicleFormState,
): AddVehicleStepErrors {
  return {
    vehicleInfo: validateVehicleInfoStep(form.vehicleInfo),
    ownershipInfo: validateOwnershipInfoStep(form.ownershipInfo),
    docs: validateDocsStep(form.docs),
    health: validateHealthStep(form.health),
  };
}

export function validateAddVehicleForm(form: AddVehicleFormState): string | null {
  const errors = validateAddVehicleFormSteps(form);

  const firstVehicleError = Object.values(errors.vehicleInfo ?? {}).find(
    Boolean,
  );
  if (firstVehicleError) return firstVehicleError;

  const firstOwnershipError = Object.values(errors.ownershipInfo ?? {}).find(
    Boolean,
  );
  if (firstOwnershipError) return firstOwnershipError;

  const firstDocsError = Object.values(errors.docs ?? {}).find(Boolean);
  if (firstDocsError) return firstDocsError;

  const firstHealthError = Object.values(errors.health ?? {}).find(Boolean);
  if (firstHealthError) return firstHealthError;

  return null;
}

export function stepHasErrors(
  step: number,
  errors: AddVehicleStepErrors,
): boolean {
  switch (step) {
    case 1:
      return hasFieldErrors(errors.vehicleInfo ?? {});
    case 2:
      return hasFieldErrors(errors.ownershipInfo ?? {});
    case 3:
      return hasFieldErrors(errors.docs ?? {});
    case 4:
      return hasFieldErrors(errors.health ?? {});
    default:
      return false;
  }
}

export function validateAddVehicleStep(
  step: number,
  form: AddVehicleFormState,
): AddVehicleStepErrors {
  switch (step) {
    case 1:
      return { vehicleInfo: validateVehicleInfoStep(form.vehicleInfo) };
    case 2:
      return { ownershipInfo: validateOwnershipInfoStep(form.ownershipInfo) };
    case 3:
      return { docs: validateDocsStep(form.docs) };
    case 4:
      return { health: validateHealthStep(form.health) };
    default:
      return {};
  }
}
