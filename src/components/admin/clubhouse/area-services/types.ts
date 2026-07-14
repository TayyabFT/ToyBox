import type {
  ClubhouseVenueStatusTone,
  ClubhouseVenueTitle,
} from "../types";

export type ClubhouseAreaId = "restaurant" | "private_lounge" | "suite_lounge";

export type ClubhouseAreaCategoryTopItem = {
  id: string;
  label: string;
  value: string;
};

export type ClubhouseAreaCategoryCard = {
  id: string;
  tabLabel: string;
  title: ClubhouseVenueTitle;
  statusLabel: string;
  statusTone: ClubhouseVenueStatusTone;
  available: number;
  occupied: number;
  topItems: ClubhouseAreaCategoryTopItem[];
};

export type ClubhouseAreaServiceColumn = {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
};

export type ClubhouseAreaServiceRow = {
  id: string;
  name: string;
  locationLabel?: string;
  categoryId: string;
  statusLabel: string;
  statusTone: ClubhouseVenueStatusTone;
  cells: Record<string, string>;
};

export type ClubhouseAreaStaticConfig = {
  pageTitle: string;
  title: ClubhouseVenueTitle;
  listTitle: ClubhouseVenueTitle;
  itemCountLabel: (count: number) => string;
  nameColumnLabel: string;
  columns: ClubhouseAreaServiceColumn[];
};

export type ClubhouseAreaOverviewDisplay = {
  areaCountLabel: string;
  categories: ClubhouseAreaCategoryCard[];
  items: ClubhouseAreaServiceRow[];
};
