import type { VehicleListItem } from "@/components/staff/vehicles/types";
import type { InspectionQueueItem } from "./types";

export function mapInspectionQueueItem(
  item: InspectionQueueItem,
): VehicleListItem {
  const memberLine = item.reference
    ? `${item.reference} · ${item.serviceType}`
    : item.serviceType;

  return {
    id: item.id,
    name: item.vehicle,
    bay: item.bay,
    member: memberLine,
    mileage: `Assigned: ${item.assignee}`,
    status: item.status,
  };
}
