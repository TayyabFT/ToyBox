// JobStatusBadge — delegates to the central Chip component.

import { Chip } from "@/components/ui/Chip";
import type { ChipTone } from "@/components/ui/Chip";
import type { JobStatusTone } from "./types";

const TONE_MAP: Record<JobStatusTone, ChipTone> = {
  urgent:       "pink",
  overdue:      "pink",
  "in-progress": "teal",
  active:       "teal",
  assigned:     "gold",
  pending:      "neutral",
};

type JobStatusBadgeProps = {
  label: string;
  tone: JobStatusTone;
};

export function JobStatusBadge({ label, tone }: JobStatusBadgeProps) {
  return (
    <Chip
      label={label}
      context="inline"
      tone={TONE_MAP[tone]}
      shape="pill"
    />
  );
}
