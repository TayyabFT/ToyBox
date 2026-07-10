import type { WashAddOnKey, WashDetailsFormState, WashPackageKey } from "./types";

export type WashPackageOption = {
  key: WashPackageKey;
  label: string;
  reviewLabel: string;
  price: number;
  priceLabel: string;
  includes?: string;
};

export type WashAddOnOption = {
  key: WashAddOnKey;
  label: string;
  reviewLabel: string;
  price: number;
};

export const WASH_PACKAGES: WashPackageOption[] = [
  {
    key: "full-detail",
    label: "Full detail",
    reviewLabel: "Full Detail",
    price: 850,
    priceLabel: "AED 850",
    includes: "Interior · Exterior · Engine bay",
  },
  {
    key: "exterior-wash",
    label: "Exterior wash",
    reviewLabel: "Exterior Wash",
    price: 250,
    priceLabel: "AED 250",
    includes: "Exterior wash & dry",
  },
  {
    key: "interior-only",
    label: "Interior only",
    reviewLabel: "Interior Only",
    price: 400,
    priceLabel: "AED 400",
    includes: "Interior vacuum & wipe-down",
  },
];

export const WASH_ADD_ONS: WashAddOnOption[] = [
  { key: "ceramic-coat", label: "Ceramic Coat", reviewLabel: "Ceramic coat", price: 1200 },
  { key: "engine-bay-clean", label: "Engine Bay Clean", reviewLabel: "Engine bay clean", price: 180 },
  { key: "leather-treatment", label: "Leather Treatment", reviewLabel: "Leather treatment", price: 220 },
];

export function getWashPackage(key: WashPackageKey): WashPackageOption {
  return WASH_PACKAGES.find((item) => item.key === key) ?? WASH_PACKAGES[0];
}

export function getWashAddOn(key: WashAddOnKey): WashAddOnOption {
  return WASH_ADD_ONS.find((item) => item.key === key) ?? WASH_ADD_ONS[0];
}

export function calculateWashTotal(form: WashDetailsFormState): number {
  const packagePrice = getWashPackage(form.package).price;
  const addOnTotal = form.addOns.reduce(
    (sum, addOnKey) => sum + getWashAddOn(addOnKey).price,
    0,
  );

  return packagePrice + addOnTotal;
}

export function formatWashTotal(total: number): string {
  return `AED ${total.toLocaleString("en-US")}`;
}

export function formatWashEstimateSummary(form: WashDetailsFormState): string {
  const packageLabel = getWashPackage(form.package).reviewLabel;
  const addOnLabels = form.addOns.map((key) => getWashAddOn(key).reviewLabel);

  if (addOnLabels.length === 0) {
    return packageLabel;
  }

  return `${packageLabel} + ${addOnLabels.join(" + ")}`;
}

export function formatWashNotes(notes: string): string {
  const text = notes.trim() || "Wrap on rear bumper";
  return text.startsWith("*") ? text : `*${text}*`;
}
