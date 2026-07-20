export type GarageVehicleStatTone = "default";

export type GarageVehicleStat = {
  value: string;
  label: string;
};

export type GarageVehicleStatusTone =
  | "ready"
  | "in_service"
  | "away"
  | "stored"
  | "in_review";

export type GarageVehicle = {
  id: string;
  make: string;
  model: string;
  detail: string;
  imageUrl: string;
  era: "modern" | "classic";
  statusTone: GarageVehicleStatusTone;
  statusLabel?: string;
  bayLabel?: string;
  stats: GarageVehicleStat[];
  lastInspectedLabel: string;
  lastInspectedValue: string;
};

// ── Vehicle detail page ─────────────────────────────────────────────────────

export type MemberVehicleSpecs = {
  make: string;
  model: string;
  year: string;
  engine: string;
  power: string;
  transmission: string;
  drive: string;
  zeroToHundred: string;
  topSpeed: string;
};

export type MemberVehicleOwnership = {
  colour: string;
  chassisNo: string;
  plate: string;
  purchased: string;
  storageBay: string;
  mileage: string;
};

export type MemberVehicleHealthTone = "good" | "warning" | "critical";

export type MemberVehicleHealthMetric = {
  label: string;
  percentage: number;
  note: string;
};

export type MemberVehicleDocumentBadgeTone = "valid" | "expiring" | "expired";

export type MemberVehicleDocumentIconTone =
  | "red"
  | "blue"
  | "orange"
  | "green"
  | "greenCheck";

export type MemberVehicleDocument = {
  key: string;
  title: string;
  subtitle: string;
  url: string;
  iconTone: MemberVehicleDocumentIconTone;
  badge?: {
    label: string;
    tone: MemberVehicleDocumentBadgeTone;
  };
};

export type MemberVehicleRequestItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: "transport" | "detailing" | "maintenance" | "sourcing";
};

export type MemberVehicleDetail = {
  id: string;
  make: string;
  model: string;
  detail: string;
  imageUrl: string;
  statusTone: GarageVehicleStatusTone;
  statusLabel?: string;
  bayLabel?: string;
  stats: GarageVehicleStat[];
  lastInspectedLabel: string;
  lastInspectedValue: string;
  requests: MemberVehicleRequestItem[];
  specs: MemberVehicleSpecs;
  ownership: MemberVehicleOwnership;
  health: MemberVehicleHealthMetric[];
  healthCtaLabel: string;
  documents: MemberVehicleDocument[];
  /** Sourcing request ID — present when statusTone is "in_review" */
  sourcingRequestId?: string;
};

export type GarageFilterKey =
  | "all"
  | "ready"
  | "in_service"
  | "away"
  | "modern"
  | "classic"
  | "stored"
  | "in_review";

export type GarageFilter = {
  key: GarageFilterKey;
  label: string;
  count?: number;
};
