export type ClubhouseAreaType =
  | "clubhouse_restaurant"
  | "private_lounge"
  | "suite_lounge";

export type ClubhouseAddAreaStep =
  | "select-type"
  | "clubhouse_restaurant"
  | "private_lounge"
  | "suite_lounge";

export type ClubhouseRestaurantFormState = {
  restaurantName: string;
  openingTime: string;
  closingTime: string;
  tableCount: string;
  capacity: string;
  cuisineType: string;
  restaurantType: string;
  ambienceImages: (File | null)[];
};

export type ClubhousePrivateLoungeFormState = {
  loungeTitle: string;
  type: string;
  isAvailable24x7: boolean;
  capacity: string;
  maintainTiming: string;
  images: (File | null)[];
};

export type ClubhouseSuiteEntry = {
  id: string;
  suiteTitle: string;
  location: string;
  roomType: string;
  capacity: string;
};

export type ClubhouseSuiteLoungeFormState = {
  suites: ClubhouseSuiteEntry[];
  images: (File | null)[];
  notes: string;
};
