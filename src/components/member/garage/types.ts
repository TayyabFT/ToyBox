export type GarageVehicleStatTone = "default";

export type GarageVehicleStat = {
  value: string;
  label: string;
};

export type GarageVehicleStatusTone = "ready" | "in_service" | "away";

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

export type GarageFilterKey =
  | "all"
  | "ready"
  | "in_service"
  | "away"
  | "modern"
  | "classic";

export type GarageFilter = {
  key: GarageFilterKey;
  label: string;
  count?: number;
};
