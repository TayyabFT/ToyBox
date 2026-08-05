// ParkingSessionStatusBadge — delegates to the central Chip component.

import { Chip } from "@/components/ui/Chip";
import type { ChipTone } from "@/components/ui/Chip";

const STATUS_TONE: Record<string, ChipTone> = {
  pending:   "gold",
  requested: "gold",
  queue:     "gold",
  accepted:  "info",
  confirmed: "info",
  active:    "pink",
  started:   "pink",
  parking:   "pink",
  completed: "teal",
  cancelled: "neutral",
};

type ParkingSessionStatusBadgeProps = {
  status: string;
  label?: string;
};

export function ParkingSessionStatusBadge({ status, label }: ParkingSessionStatusBadgeProps) {
  const normalized = status.trim().toLowerCase();
  const tone: ChipTone = STATUS_TONE[normalized] ?? "neutral";
  const displayLabel = label ?? normalized.toUpperCase();

  return (
    <Chip
      label={displayLabel}
      context="inline"
      tone={tone}
      shape="pill"
      showDot
    />
  );
}
