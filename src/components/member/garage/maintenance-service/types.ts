export type MaintenanceVehicleKey = "huracan-sto" | "911-gt3" | "sf90";

export type MaintenanceServiceTypeKey =
  | "scheduled-annual"
  | "repair-fault"
  | "tyres-brakes"
  | "bodywork-paint";

export type MaintenanceServiceCentreKey = "official-porsche" | "toybox-partner";

export type MaintenanceDateKey = "apr-30" | "may-1" | "may-2" | "may-3";

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
