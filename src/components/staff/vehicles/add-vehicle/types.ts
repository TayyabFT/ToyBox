export const ADD_VEHICLE_STEPS = [
  { id: 1, label: "Vehicle Info" },
  { id: 2, label: "Ownership Info" },
  { id: 3, label: "Docs" },
  { id: 4, label: "Health" },
] as const;

export const HEALTH_CATEGORIES = [
  { key: "engine_drivetrain", label: "Engine & Drivetrain" },
  { key: "tyres", label: "Tyres" },
  { key: "brakes", label: "Brakes" },
  { key: "fluids", label: "Fluids" },
  { key: "battery", label: "Battery" },
  { key: "exterior_body", label: "Exterior & Body" },
] as const;

export const MAX_VEHICLE_IMAGES = 5;
export const MAX_VEHICLE_IMAGE_BYTES = 1024 * 1024; // 1MB
export const ACCEPTED_VEHICLE_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const DOC_FIELDS = [
  { key: "vehicleRegistration", label: "Vehicle Registration" },
  { key: "insuranceCertificate", label: "Insurance Certificate" },
  { key: "specsAndInfo", label: "Specs and info" },
  { key: "serviceRecord", label: "Service Record" },
  { key: "purchasedInvoice", label: "Purchased Invoice" },
  { key: "warrantyCertificate", label: "Warranty Certificate" },
] as const;

export type VehicleInfoForm = {
  name: string;
  model: string;
  year: string;
  engine: string;
  power: string;
  transmission: string;
  drive: string;
  zeroToHundred: string;
  topSpeed: string;
  vehicleImages: File[];
};

export type OwnershipInfoForm = {
  colour: string;
  chassisNo: string;
  plate: string;
  purchased: string;
  storageBay: string;
  mileage: string;
};

export type DocsForm = Record<
  (typeof DOC_FIELDS)[number]["key"],
  File | null
>;

export type HealthItemForm = {
  percentage: number;
  note: string;
  noteOpen: boolean;
};

export type HealthForm = Record<
  (typeof HEALTH_CATEGORIES)[number]["key"],
  HealthItemForm
>;

export type AddVehicleFormState = {
  vehicleInfo: VehicleInfoForm;
  ownershipInfo: OwnershipInfoForm;
  docs: DocsForm;
  health: HealthForm;
};

export const initialVehicleInfo: VehicleInfoForm = {
  name: "",
  model: "",
  year: "",
  engine: "",
  power: "",
  transmission: "",
  drive: "",
  zeroToHundred: "",
  topSpeed: "",
  vehicleImages: [],
};

export const initialOwnershipInfo: OwnershipInfoForm = {
  colour: "",
  chassisNo: "",
  plate: "",
  purchased: "",
  storageBay: "",
  mileage: "",
};

export function createInitialDocsForm(): DocsForm {
  return {
    vehicleRegistration: null,
    insuranceCertificate: null,
    specsAndInfo: null,
    serviceRecord: null,
    purchasedInvoice: null,
    warrantyCertificate: null,
  };
}

export function createInitialHealthForm(): HealthForm {
  return HEALTH_CATEGORIES.reduce((acc, category) => {
    acc[category.key] = {
      percentage: 45,
      note: "",
      noteOpen: false,
    };
    return acc;
  }, {} as HealthForm);
}

export function createInitialAddVehicleForm(): AddVehicleFormState {
  return {
    vehicleInfo: { ...initialVehicleInfo },
    ownershipInfo: { ...initialOwnershipInfo },
    docs: createInitialDocsForm(),
    health: createInitialHealthForm(),
  };
}
