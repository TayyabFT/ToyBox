// VehicleStatusBadge — delegates to the central Chip component.

import { Chip } from "@/components/ui/Chip";
import type { ChipTone } from "@/components/ui/Chip";
import type { VehicleStatus } from "./types";

const STATUS_TONE: Record<VehicleStatus, ChipTone> = {
  "in-service":  "gold",
  ready:         "teal",
  overdue:       "pink",
  dispatched:    "info",
  away:          "neutral",
  "in-progress": "gold",
  pending:       "neutral",
  done:          "teal",
  critical:      "pink",
  "due-service": "gold",
  good:          "teal",
  excellent:     "teal",
  reserved:      "info",
};

const STATUS_LABEL: Record<VehicleStatus, string> = {
  "in-service":  "IN SERVICE",
  ready:         "READY",
  overdue:       "OVERDUE",
  dispatched:    "DISPATCHED",
  away:          "AWAY",
  "in-progress": "In Progress",
  pending:       "Pending",
  done:          "Done",
  critical:      "Critical",
  "due-service": "Due Service",
  good:          "Good",
  excellent:     "Excellent",
  reserved:      "RESERVED",
};

type VehicleStatusBadgeProps = {
  status: VehicleStatus;
};

export function VehicleStatusBadge({ status }: VehicleStatusBadgeProps) {
  return (
    <Chip
      label={STATUS_LABEL[status] ?? status}
      context="inline"
      tone={STATUS_TONE[status] ?? "neutral"}
      shape="pill"
      showDot
    />
  );
}
