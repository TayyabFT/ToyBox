// ParkingSlotStatusBadge — delegates to the central Chip component.

import { Chip } from "@/components/ui/Chip";
import type { ChipTone } from "@/components/ui/Chip";

const STATUS_TONE: Record<string, ChipTone> = {
  available:   "teal",
  occupied:    "pink",
  maintenance: "gold",
  reserved:    "info",
};

type ParkingSlotStatusBadgeProps = {
  status: string;
  label?: string;
};

export function ParkingSlotStatusBadge({ status, label }: ParkingSlotStatusBadgeProps) {
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
