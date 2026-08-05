// MarketplaceStatusBadge — delegates to the central Chip component.

import { Chip } from "@/components/ui/Chip";
import type { ChipTone } from "@/components/ui/Chip";
import type {
  MarketplaceOfferStatusTone,
  MarketplaceVehicleStatusTone,
} from "./types";

const VEHICLE_TONE: Record<MarketplaceVehicleStatusTone, ChipTone> = {
  available: "teal",
  reserved:  "gold",
  sold:      "pink",
  other:     "neutral",
};

const OFFER_TONE: Record<MarketplaceOfferStatusTone, ChipTone> = {
  pending:   "gold",
  payment:   "info",
  rejected:  "pink",
  purchased: "teal",
  countered: "gold",
  other:     "neutral",
};

export function MarketplaceVehicleStatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: MarketplaceVehicleStatusTone;
}) {
  return (
    <Chip
      label={label}
      context="inline"
      tone={VEHICLE_TONE[tone]}
      shape="pill"
      showDot
    />
  );
}

export function MarketplaceOfferStatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: MarketplaceOfferStatusTone;
}) {
  return (
    <Chip
      label={label}
      context="inline"
      tone={OFFER_TONE[tone]}
      shape="pill"
      showDot
    />
  );
}
