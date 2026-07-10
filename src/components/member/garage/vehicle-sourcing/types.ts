export type SourcingCategoryKey =
  | "sports-car"
  | "suv-crossover"
  | "hypercar"
  | "classic";

export type SourcingBudgetKey =
  | "under-1m"
  | "1m-2m"
  | "2m-3m"
  | "3m-plus";

export type SourcingSpecKey =
  | "weissach-package"
  | "full-service-history"
  | "low-mileage"
  | "carbon-wheels"
  | "clubsport-kit"
  | "single-owner";

export type SourcingConditionKey =
  | "new-nearly-new"
  | "lightly-used"
  | "open-any";

export type SourcingTimelineKey =
  | "asap"
  | "1-3-months"
  | "3-6-months"
  | "flexible";

export type VehicleSourcingDetailsFormState = {
  make: string;
  model: string;
  category: SourcingCategoryKey;
  yearFrom: string;
  yearTo: string;
  budget: SourcingBudgetKey;
  preferredColour: string;
  keySpecifications: SourcingSpecKey[];
  condition: SourcingConditionKey;
  timeline: SourcingTimelineKey;
  additionalNotes: string;
};
