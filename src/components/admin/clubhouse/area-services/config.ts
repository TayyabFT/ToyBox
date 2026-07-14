import type { ClubhouseAreaId, ClubhouseAreaStaticConfig } from "./types";

export const CLUBHOUSE_AREA_STATIC_CONFIG: Record<
  ClubhouseAreaId,
  ClubhouseAreaStaticConfig
> = {
  restaurant: {
    pageTitle: "Restaurant Services",
    title: { before: "Restaurant ", highlight: "Services" },
    listTitle: { before: "Clubhouse ", highlight: "Restaurants" },
    itemCountLabel: (count) => `${count} Restaurant${count === 1 ? "" : "s"}`,
    nameColumnLabel: "Restaurant",
    columns: [
      { key: "cuisineType", label: "Cuisine" },
      { key: "serviceHours", label: "Service Hours" },
      { key: "tables", label: "Tables", align: "center" },
      { key: "capacity", label: "Capacity", align: "center" },
    ],
  },

  private_lounge: {
    pageTitle: "Private Lounge Services",
    title: { before: "Private Lounge ", highlight: "Services" },
    listTitle: { before: "Members' ", highlight: "Lounge Areas" },
    itemCountLabel: (count) => `${count} Lounge Area${count === 1 ? "" : "s"}`,
    nameColumnLabel: "Area",
    columns: [
      { key: "type", label: "Type" },
      { key: "availability", label: "Availability" },
      { key: "capacity", label: "Capacity", align: "center" },
      { key: "inUse", label: "In Use", align: "center" },
    ],
  },

  suite_lounge: {
    pageTitle: "Suite Lounge Services",
    title: { before: "Suite Lounge ", highlight: "Services" },
    listTitle: { before: "Private ", highlight: "Suites" },
    itemCountLabel: (count) => `${count} Suite${count === 1 ? "" : "s"}`,
    nameColumnLabel: "Suite",
    columns: [
      { key: "location", label: "Location" },
      { key: "availability", label: "Availability" },
      { key: "capacity", label: "Capacity", align: "center" },
      { key: "use", label: "Use", align: "center" },
    ],
  },
};
