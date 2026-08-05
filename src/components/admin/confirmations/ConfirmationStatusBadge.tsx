// ConfirmationStatusBadge — delegates to the central Chip component.
// DoneStatusBadge kept as a named export for backwards compatibility.

import { Chip } from "@/components/ui/Chip";
import type { ChipTone } from "@/components/ui/Chip";
import type { ConfirmationBadgeTone } from "./types";

const TONE_MAP: Record<ConfirmationBadgeTone, ChipTone> = {
  confirmed:  "teal",
  pending:    "gold",
  "in-review": "info",
  awaiting:   "gold",
  "sign-off": "gold",
  done:       "teal",
};

const LABEL_MAP: Record<ConfirmationBadgeTone, string> = {
  confirmed:  "Confirmed",
  pending:    "Pending",
  "in-review": "In Review",
  awaiting:   "No Vehicle Offer",
  "sign-off": "No Vehicle Offer",
  done:       "Done",
};

const SHOW_DOT: Partial<Record<ConfirmationBadgeTone, boolean>> = {
  done: true,
};

type ConfirmationStatusBadgeProps = {
  tone: ConfirmationBadgeTone;
  label?: string;
};

export function ConfirmationStatusBadge({ tone, label }: ConfirmationStatusBadgeProps) {
  return (
    <Chip
      label={label ?? LABEL_MAP[tone]}
      context="inline"
      tone={TONE_MAP[tone]}
      shape="pill"
      showDot={SHOW_DOT[tone] ?? false}
    />
  );
}

// Kept for call-sites that use <DoneStatusBadge /> directly.
export function DoneStatusBadge() {
  return (
    <Chip
      label="Done"
      context="inline"
      tone="teal"
      shape="pill"
      showDot
    />
  );
}
