// ConfirmationStatusBadge (staff) — delegates to the central Chip component.

import { Chip } from "@/components/ui/Chip";
import type { ChipTone } from "@/components/ui/Chip";
import type { ConfirmationBadgeTone } from "./types";

const TONE_MAP: Record<ConfirmationBadgeTone, ChipTone> = {
  confirmed:   "teal",
  pending:     "gold",
  "in-review": "info",
  awaiting:    "gold",
  "sign-off":  "gold",
  done:        "teal",
};

const LABEL_MAP: Record<ConfirmationBadgeTone, string> = {
  confirmed:   "Confirmed",
  pending:     "Pending",
  "in-review": "In Review",
  awaiting:    "Awaiting Confirm",
  "sign-off":  "Sign-Off Needed",
  done:        "Done",
};

type ConfirmationStatusBadgeProps = {
  label: string;
  tone: ConfirmationBadgeTone;
  showDot?: boolean;
};

export function ConfirmationStatusBadge({
  label,
  tone,
  showDot = false,
}: ConfirmationStatusBadgeProps) {
  return (
    <Chip
      label={label || LABEL_MAP[tone]}
      context="inline"
      tone={TONE_MAP[tone]}
      shape="pill"
      showDot={showDot}
    />
  );
}
