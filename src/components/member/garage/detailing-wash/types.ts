export type WashPackageKey = "full-detail" | "exterior-wash" | "interior-only";

export type WashAddOnKey = "ceramic-coat" | "engine-bay-clean" | "leather-treatment";

export type WashDetailsFormState = {
  package: WashPackageKey;
  addOns: WashAddOnKey[];
  date: string;
  notes: string;
};
