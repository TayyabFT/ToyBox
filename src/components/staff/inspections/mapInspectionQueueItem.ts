import type { VehicleListItem } from "@/components/staff/vehicles/types";
import type { InspectionQueueItem } from "./types";

export function mapInspectionQueueItem(
  item: InspectionQueueItem,
): VehicleListItem {
  return {
    id: item.id,
    name: item.vehicle,
    bay: item.bay,
    member: item.serviceType,
    mileage: `Assigned: ${item.assignee}`,
    status: item.status,
  };
}
