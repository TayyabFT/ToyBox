// ClubhouseReservationStatusBadge — delegates to the central Chip component.

import { Chip } from "@/components/ui/Chip";
import type { ChipTone } from "@/components/ui/Chip";
import type { ClubhouseReservationStatus } from "./types";

const TONE_MAP: Record<ClubhouseReservationStatus, ChipTone> = {
  confirmed: "teal",
  prep:      "gold",
  pending:   "gold",
};

const LABEL_MAP: Record<ClubhouseReservationStatus, string> = {
  confirmed: "Confirmed",
  prep:      "Prep",
  pending:   "Pending",
};

type ClubhouseReservationStatusBadgeProps = {
  status: ClubhouseReservationStatus;
  label?: string;
};

export function ClubhouseReservationStatusBadge({
  status,
  label,
}: ClubhouseReservationStatusBadgeProps) {
  return (
    <Chip
      label={label ?? LABEL_MAP[status]}
      context="inline"
      tone={TONE_MAP[status]}
      shape="pill"
      showDot
    />
  );
}
