// ConciergeStatusBadge (staff) — delegates to the central Chip component.

import { Chip } from "@/components/ui/Chip";
import type { ChipTone } from "@/components/ui/Chip";
import type { ConciergeRequestStatus } from "./types";

const TONE_MAP: Record<ConciergeRequestStatus, ChipTone> = {
  urgent:  "pink",
  review:  "gold",
  active:  "teal",
  pending: "neutral",
  done:    "teal",
};

const LABEL_MAP: Record<ConciergeRequestStatus, string> = {
  urgent:  "Urgent",
  review:  "Review",
  active:  "Active",
  pending: "Pending",
  done:    "Done",
};

type ConciergeStatusBadgeProps = {
  status: ConciergeRequestStatus;
};

export function ConciergeStatusBadge({ status }: ConciergeStatusBadgeProps) {
  return (
    <Chip
      label={LABEL_MAP[status]}
      context="inline"
      tone={TONE_MAP[status]}
      shape="pill"
      showDot={status === "active" || status === "urgent"}
    />
  );
}
