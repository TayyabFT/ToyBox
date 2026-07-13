import type { ClubhouseVenueStatusTone } from "../types";

export type ClubhouseRestaurantListItem = {
  id: string;
  restaurantName: string;
  cuisineType: string;
  statusLabel: string;
  statusTone: ClubhouseVenueStatusTone;
  openingTime: string;
  closingTime: string;
  numberOfTables: number;
  capacity: number;
  totalCapacity: number;
  booked: number;
  capacityLabel: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
};
