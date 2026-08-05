// StatusPill — dot + label pill used in section headers and overview panels.
// Delegates to the central Chip component.

import { Chip } from "./Chip";
import type { ChipTone } from "./Chip";

export type StatusPillTone = "red" | "green" | "gold";

const TONE_MAP: Record<StatusPillTone, ChipTone> = {
  red:   "pink",
  green: "teal",
  gold:  "gold",
};

type StatusPillProps = {
  label: string;
  tone: StatusPillTone;
};

export function StatusPill({ label, tone }: StatusPillProps) {
  return (
    <Chip
      label={label}
      context="inline"
      tone={TONE_MAP[tone]}
      shape="pill"
      showDot
    />
  );
}
