// ConciergeStatusBadge — delegates to the central Chip component.
// getConciergeTimeClass kept for callers that style timestamp text.

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

// Dot only on statuses that need a live-pulse indicator
const SHOW_DOT: Partial<Record<ConciergeRequestStatus, boolean>> = {
  active: true,
};

const TIME_CLASS: Record<ConciergeRequestStatus, string> = {
  urgent:  "text-pink",
  review:  "text-section-label",
  active:  "text-section-label",
  pending: "text-section-label",
  done:    "text-section-label",
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
      showDot={SHOW_DOT[status] ?? false}
    />
  );
}

export function getConciergeTimeClass(status: ConciergeRequestStatus): string {
  return TIME_CLASS[status];
}
