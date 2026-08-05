// ClubhouseVenueStatusBadge — delegates to the central Chip component.

import { Chip } from "@/components/ui/Chip";
import type { ChipTone } from "@/components/ui/Chip";
import type { ClubhouseVenueStatusTone } from "./types";

const TONE_MAP: Record<ClubhouseVenueStatusTone, ChipTone> = {
  active: "teal",
  quiet:  "purple",
  prep:   "gold",
};

type ClubhouseVenueStatusBadgeProps = {
  label: string;
  tone: ClubhouseVenueStatusTone;
};

export function ClubhouseVenueStatusBadge({
  label,
  tone,
}: ClubhouseVenueStatusBadgeProps) {
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
