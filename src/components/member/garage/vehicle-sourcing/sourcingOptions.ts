import type {
  SourcingBudgetKey,
  SourcingCategoryKey,
  SourcingConditionKey,
  SourcingSpecKey,
  SourcingTimelineKey,
} from "./types";

export const SOURCING_CATEGORIES: {
  key: SourcingCategoryKey;
  label: string;
}[] = [
  { key: "sports-car", label: "Sports Car" },
  { key: "suv-crossover", label: "SUV / Crossover" },
  { key: "hypercar", label: "Hypercar" },
  { key: "classic", label: "Classic" },
];

export const SOURCING_BUDGET_OPTIONS: {
  key: SourcingBudgetKey;
  label: string;
}[] = [
  { key: "under-1m", label: "Under 1M" },
  { key: "1m-2m", label: "1M – 2M" },
  { key: "2m-3m", label: "2M – 3M" },
  { key: "3m-plus", label: "3M+" },
];

export const SOURCING_SPEC_OPTIONS: {
  key: SourcingSpecKey;
  label: string;
  reviewLabel: string;
}[] = [
  { key: "weissach-package", label: "Weissach Package", reviewLabel: "Weissach Pkg" },
  {
    key: "full-service-history",
    label: "Full Service History",
    reviewLabel: "Full Service History",
  },
  { key: "low-mileage", label: "Low Mileage", reviewLabel: "Low Mileage" },
  { key: "carbon-wheels", label: "Carbon Wheels", reviewLabel: "Carbon Wheels" },
  { key: "clubsport-kit", label: "Clubsport Kit", reviewLabel: "Clubsport Kit" },
  { key: "single-owner", label: "Single Owner", reviewLabel: "Single Owner" },
];

export const SOURCING_CONDITION_OPTIONS: {
  key: SourcingConditionKey;
  title: string;
  subtitle: string;
}[] = [
  {
    key: "new-nearly-new",
    title: "New or nearly new",
    subtitle: "0 – 5,000 km",
  },
  {
    key: "lightly-used",
    title: "Lightly used",
    subtitle: "5,000 – 20,000 km",
  },
  {
    key: "open-any",
    title: "Open to any condition",
    subtitle: "Full history required",
  },
];

export const SOURCING_TIMELINE_OPTIONS: {
  key: SourcingTimelineKey;
  label: string;
}[] = [
  { key: "asap", label: "ASAP" },
  { key: "1-3-months", label: "1 – 3 months" },
  { key: "3-6-months", label: "3 – 6 months" },
  { key: "flexible", label: "Flexible" },
];

export function getSourcingCategory(key: SourcingCategoryKey) {
  return (
    SOURCING_CATEGORIES.find((category) => category.key === key) ??
    SOURCING_CATEGORIES[0]
  );
}

export function getSourcingBudget(key: SourcingBudgetKey) {
  return (
    SOURCING_BUDGET_OPTIONS.find((budget) => budget.key === key) ??
    SOURCING_BUDGET_OPTIONS[1]
  );
}

export function getSourcingCondition(key: SourcingConditionKey) {
  return (
    SOURCING_CONDITION_OPTIONS.find((condition) => condition.key === key) ??
    SOURCING_CONDITION_OPTIONS[0]
  );
}

export function getSourcingTimeline(key: SourcingTimelineKey) {
  return (
    SOURCING_TIMELINE_OPTIONS.find((timeline) => timeline.key === key) ??
    SOURCING_TIMELINE_OPTIONS[1]
  );
}

export function getSourcingSpec(key: SourcingSpecKey) {
  return (
    SOURCING_SPEC_OPTIONS.find((spec) => spec.key === key) ?? SOURCING_SPEC_OPTIONS[0]
  );
}

export function formatSourcingMakeModel(make: string, model: string): string {
  return `${make} ${model}`.trim();
}

export function formatSourcingYearRange(yearFrom: string, yearTo: string): string {
  return `${yearFrom} – ${yearTo}`;
}

export function formatSourcingBudgetReview(key: SourcingBudgetKey): string {
  const budget = getSourcingBudget(key);
  return `AED ${budget.label}`;
}

export function formatSourcingBudgetConfirmed(key: SourcingBudgetKey): string {
  return formatSourcingBudgetReview(key).replace(/\s–\s/g, "-");
}

export function formatSourcingColourReview(colour: string): string {
  return colour.replace(/\s+or\s+/i, " / ");
}

export function formatSourcingTimelineConfirmed(key: SourcingTimelineKey): string {
  return getSourcingTimeline(key).label.replace(/\s–\s/g, "-");
}

export function formatSourcingKeySpecs(keys: SourcingSpecKey[]): string {
  if (keys.length === 0) {
    return "None specified";
  }

  return keys.map((key) => getSourcingSpec(key).reviewLabel).join(" · ");
}

export function formatSourcingTrackingTitle(make: string, model: string): string {
  return `${make} ${model}`.trim().toUpperCase();
}

export function formatSourcingTrackingBudget(key: SourcingBudgetKey): string {
  const labels: Record<SourcingBudgetKey, string> = {
    "under-1m": "AED <1M",
    "1m-2m": "AED 1–2M",
    "2m-3m": "AED 2–3M",
    "3m-plus": "AED 3M+",
  };

  return labels[key];
}
