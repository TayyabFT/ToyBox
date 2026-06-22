import type { VehiclesStatsDisplay } from "./types";

export const vehicleStats: VehiclesStatsDisplay = {
  totalVehicles: {
    label: "TOTAL VEHICLES",
    value: "0",
    subtext: "ACTIVE",
  },
  inStorage: {
    label: "IN STORAGE",
    value: "0",
    subtext: "WORKSHOP",
    summaryKey: "in_storage",
  },
  inService: {
    label: "IN SERVICE",
    value: "0",
    subtext: "SERVICE WINDOW",
    summaryKey: "in_service",
  },
  bayUtilization: {
    label: "BAY UTILIZATION",
    value: "0%",
    subtext: "0 / 0",
  },
};
