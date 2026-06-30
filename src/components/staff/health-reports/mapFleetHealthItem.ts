import type { VehicleListItem } from "@/components/staff/vehicles/types";
import type { FleetHealthItem } from "./types";

export function mapFleetHealthItem(item: FleetHealthItem): VehicleListItem {
  return {
    id: item.id,
    name: item.vehicle,
    bay: item.bay,
    member: item.member,
    mileage: item.mileage,
    status: item.healthStatus,
    healthPercent: item.healthPercent,
  };
}
