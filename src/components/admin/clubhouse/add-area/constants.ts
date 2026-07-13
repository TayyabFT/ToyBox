import type { ClubhouseAreaType } from "./types";

export const CLUBHOUSE_AREA_TYPE_OPTIONS: {
  value: ClubhouseAreaType;
  label: string;
}[] = [
  { value: "clubhouse_restaurant", label: "Clubhouse Restaurant" },
  { value: "private_lounge", label: "Private Lounge" },
  { value: "suite_lounge", label: "Suite Lounge" },
];

export const CLUBHOUSE_RESTAURANT_NAME_OPTIONS = [
  { label: "The Clubhouse Restaurant", value: "the-clubhouse-restaurant" },
];

export const CLUBHOUSE_LOUNGE_TITLE_OPTIONS = [
  { label: "Members Lounge", value: "members-lounge" },
];

export const CLUBHOUSE_SUITE_TITLE_OPTIONS = [
  { label: "PC Hotel", value: "pc-hotel" },
];

export const CLUBHOUSE_CUISINE_TYPE_OPTIONS = [
  { label: "Asian", value: "asian" },
  { label: "European", value: "european" },
  { label: "Mediterranean", value: "mediterranean" },
  { label: "International", value: "international" },
];

export const MAX_CLUBHOUSE_AMBIENCE_IMAGES = 3;

export const ACCEPTED_CLUBHOUSE_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
