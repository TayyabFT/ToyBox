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

export const CLUBHOUSE_PRIVATE_LOUNGE_TYPE_OPTIONS = [
  { label: "Workspace / co-working desks", value: "workspace-co-working-desks" },
  { label: "Cigar rooms", value: "cigar-rooms" },
  { label: "Faraday Room", value: "faraday-room" },
  { label: "General lounge areas", value: "general-lounge-areas" },
  { label: "Private meeting pods", value: "private-meeting-pods" },
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

export const CLUBHOUSE_RESTAURANT_TYPE_OPTIONS = [
  { label: "Clubhouse Restaurant", value: "clubhouse-restaurant" },
  { label: "Restaurant reservations", value: "restaurant-reservations" },
  { label: "Private dining", value: "private-dining" },
  { label: "Dining events", value: "dining-events" },
];

export const CLUBHOUSE_SUITE_ROOM_TYPE_OPTIONS = [
  { label: "Meeting rooms", value: "meeting-rooms" },
  { label: "Conference rooms", value: "conference-rooms" },
  { label: "Private offices", value: "private-offices" },
  { label: "Executive suites", value: "executive-suites" },
];

export const MAX_CLUBHOUSE_AMBIENCE_IMAGES = 3;

export const ACCEPTED_CLUBHOUSE_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
