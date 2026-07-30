import type {
  MarketplaceOfferStatusTone,
  MarketplaceVehicleStatusTone,
} from "./types";

const VEHICLE_TONE: Record<MarketplaceVehicleStatusTone, string> = {
  available: "border-teal/40 bg-teal/[0.08] text-teal",
  reserved: "border-accent/40 bg-accent/[0.08] text-accent",
  sold: "border-pink/40 bg-pink/[0.08] text-pink",
  other: "border-secondary/30 bg-secondary/8 text-secondary",
};

const VEHICLE_DOT: Record<MarketplaceVehicleStatusTone, string> = {
  available: "bg-teal",
  reserved: "bg-accent",
  sold: "bg-pink",
  other: "bg-secondary",
};

const OFFER_TONE: Record<MarketplaceOfferStatusTone, string> = {
  pending: "border-accent/40 bg-accent/[0.08] text-accent",
  payment: "border-info/40 bg-info/[0.08] text-info",
  rejected: "border-pink/40 bg-pink/[0.08] text-pink",
  purchased: "border-teal/40 bg-teal/[0.08] text-teal",
  countered: "border-primary/40 bg-primary/[0.08] text-primary",
  other: "border-secondary/30 bg-secondary/8 text-secondary",
};

const OFFER_DOT: Record<MarketplaceOfferStatusTone, string> = {
  pending: "bg-accent",
  payment: "bg-info",
  rejected: "bg-pink",
  purchased: "bg-teal",
  countered: "bg-primary",
  other: "bg-secondary",
};

export function MarketplaceVehicleStatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: MarketplaceVehicleStatusTone;
}) {
  return (
    <span
      className={`font-roboto inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[9px] font-semibold tracking-[0.1em] uppercase ${VEHICLE_TONE[tone]}`}
    >
      <span className={`size-1.5 rounded-full ${VEHICLE_DOT[tone]}`} />
      {label}
    </span>
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
    <span
      className={`font-roboto inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[9px] font-semibold tracking-[0.1em] uppercase ${OFFER_TONE[tone]}`}
    >
      <span className={`size-1.5 rounded-full ${OFFER_DOT[tone]}`} />
      {label}
    </span>
  );
}
