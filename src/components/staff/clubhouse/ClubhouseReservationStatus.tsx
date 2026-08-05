// ClubhouseReservationStatusBadge (staff) — delegates to the central Chip component.

import { Chip } from "@/components/ui/Chip";
import type { ChipTone } from "@/components/ui/Chip";
import type { ClubhouseReservationStatus } from "./types";

const TONE_MAP: Record<ClubhouseReservationStatus, ChipTone> = {
  confirmed: "teal",
  pending:   "gold",
  prep:      "gold",
  cancelled: "neutral",
};

const LABEL_MAP: Record<ClubhouseReservationStatus, string> = {
  confirmed: "Confirmed",
  pending:   "Pending",
  prep:      "Prep",
  cancelled: "Cancelled",
};

type ClubhouseReservationStatusProps = {
  status: ClubhouseReservationStatus;
  detail: string;
};

export function ClubhouseReservationStatusBadge({
  status,
  detail,
}: ClubhouseReservationStatusProps) {
  return (
    <div className="space-y-1.5">
      <Chip
        label={LABEL_MAP[status]}
        context="inline"
        tone={TONE_MAP[status]}
        shape="pill"
        showDot
      />
      <p className="font-roboto text-[10px] tracking-[0.04em] text-secondary">
        {detail}
      </p>
    </div>
  );
}
