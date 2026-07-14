export type MaintenanceVehicleKey = "huracan-sto" | "911-gt3" | "sf90";

export type MaintenanceServiceTypeKey =
  | "scheduled-annual"
  | "repair-fault"
  | "tyres-brakes"
  | "bodywork-paint";

export type MaintenanceServiceCentreKey = "official-porsche" | "toybox-partner";

/** ISO date string YYYY-MM-DD — generated dynamically from today */
export type MaintenanceDateKey = string;

export type MaintenanceTimeWindowKey =
  | "morning"
  | "afternoon"
  | "evening"
  | "flexible";

export type MaintenanceDetailsFormState = {
  vehicle: MaintenanceVehicleKey;
  serviceType: MaintenanceServiceTypeKey;
  serviceCentre: MaintenanceServiceCentreKey;
  issueDescription: string;
  preferredDate: MaintenanceDateKey;
  preferredTime: MaintenanceTimeWindowKey;
};
