import {
  CLUBHOUSE_CUISINE_TYPE_OPTIONS,
  CLUBHOUSE_LOUNGE_TITLE_OPTIONS,
  CLUBHOUSE_RESTAURANT_NAME_OPTIONS,
  CLUBHOUSE_SUITE_TITLE_OPTIONS,
} from "@/components/admin/clubhouse/add-area/constants";
import type {
  ClubhousePrivateLoungeFormState,
  ClubhouseRestaurantFormState,
  ClubhouseSuiteLoungeFormState,
} from "@/components/admin/clubhouse/add-area/types";
import type { ClubhouseRestaurantListItem } from "@/components/admin/clubhouse/restaurant/types";
import type {
  AdminClubhouseRestaurantListData,
  AdminClubhouseRestaurantRaw,
  CreateAdminClubhousePrivateLoungeBody,
  CreateAdminClubhouseRestaurantBody,
  CreateAdminClubhouseSuiteLoungeBody,
} from "@/types/api";

const CLUBHOUSE_AREA_STATUS = "active";

function resolveOptionLabel(
  options: { label: string; value: string }[],
  value: string,
): string {
  return options.find((option) => option.value === value)?.label ?? value.trim();
}

function parsePositiveInt(value: string, fallback = 0): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseMaintenanceHours(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function getClubhouseImageFiles(images: (File | null)[]): File[] {
  return images.filter((file): file is File => file !== null);
}

export function hasClubhouseImages(images: (File | null)[]): boolean {
  return getClubhouseImageFiles(images).length > 0;
}

function appendImageFiles(formData: FormData, files: File[]) {
  for (const file of files) {
    formData.append("imageUrls", file);
  }
}

function appendStringArray(formData: FormData, key: string, values: string[]) {
  for (const value of values) {
    formData.append(key, value);
  }
}

export function buildRestaurantPayload(
  form: ClubhouseRestaurantFormState,
): CreateAdminClubhouseRestaurantBody {
  return {
    restaurantName: resolveOptionLabel(
      CLUBHOUSE_RESTAURANT_NAME_OPTIONS,
      form.restaurantName,
    ),
    openingTime: form.openingTime.trim(),
    closingTime: form.closingTime.trim(),
    numberOfTables: parsePositiveInt(form.tableCount),
    capacity: parsePositiveInt(form.capacity),
    cuisineType: resolveOptionLabel(CLUBHOUSE_CUISINE_TYPE_OPTIONS, form.cuisineType),
    status: CLUBHOUSE_AREA_STATUS,
  };
}

export function buildRestaurantFormData(
  form: ClubhouseRestaurantFormState,
): FormData {
  const payload = buildRestaurantPayload(form);
  const formData = new FormData();

  formData.append("restaurantName", payload.restaurantName);
  formData.append("openingTime", payload.openingTime);
  formData.append("closingTime", payload.closingTime);
  formData.append("numberOfTables", String(payload.numberOfTables));
  formData.append("capacity", String(payload.capacity));
  formData.append("cuisineType", payload.cuisineType);
  formData.append("status", payload.status);

  appendImageFiles(formData, getClubhouseImageFiles(form.ambienceImages));

  return formData;
}

export function buildPrivateLoungePayload(
  form: ClubhousePrivateLoungeFormState,
): CreateAdminClubhousePrivateLoungeBody {
  return {
    loungeTitle: resolveOptionLabel(
      CLUBHOUSE_LOUNGE_TITLE_OPTIONS,
      form.loungeTitle,
    ),
    type: form.type.trim(),
    isAvailable24x7: form.isAvailable24x7,
    capacity: parsePositiveInt(form.capacity),
    maintenanceIntervalHours: parseMaintenanceHours(form.maintainTiming),
    status: CLUBHOUSE_AREA_STATUS,
  };
}

export function buildPrivateLoungeFormData(
  form: ClubhousePrivateLoungeFormState,
): FormData {
  const payload = buildPrivateLoungePayload(form);
  const formData = new FormData();

  formData.append("loungeTitle", payload.loungeTitle);
  formData.append("type", payload.type);
  formData.append("isAvailable24x7", String(payload.isAvailable24x7));
  formData.append("capacity", String(payload.capacity));
  formData.append("maintenanceIntervalHours", String(payload.maintenanceIntervalHours));
  formData.append("status", payload.status);

  appendImageFiles(formData, getClubhouseImageFiles(form.images));

  return formData;
}

export function buildSuiteLoungePayload(
  form: ClubhouseSuiteLoungeFormState,
): CreateAdminClubhouseSuiteLoungeBody {
  const primarySuite = form.suites[0];

  const body: CreateAdminClubhouseSuiteLoungeBody = {
    suiteTitle: resolveOptionLabel(
      CLUBHOUSE_SUITE_TITLE_OPTIONS,
      primarySuite?.suiteTitle ?? "",
    ),
    location: primarySuite?.location.trim() ?? "",
    suites: form.suites
      .map((suite) =>
        resolveOptionLabel(CLUBHOUSE_SUITE_TITLE_OPTIONS, suite.suiteTitle),
      )
      .filter(Boolean),
    roomType: primarySuite?.roomType.trim() ?? "",
    capacity: parsePositiveInt(primarySuite?.capacity ?? ""),
    status: CLUBHOUSE_AREA_STATUS,
  };

  const notes = form.notes.trim();
  if (notes) {
    body.notes = notes;
  }

  return body;
}

export function buildSuiteLoungeFormData(
  form: ClubhouseSuiteLoungeFormState,
): FormData {
  const payload = buildSuiteLoungePayload(form);
  const formData = new FormData();

  formData.append("suiteTitle", payload.suiteTitle);
  formData.append("location", payload.location);
  appendStringArray(formData, "suites", payload.suites);
  formData.append("roomType", payload.roomType);
  formData.append("capacity", String(payload.capacity));
  formData.append("status", payload.status);

  if (payload.notes) {
    formData.append("notes", payload.notes);
  }

  appendImageFiles(formData, getClubhouseImageFiles(form.images));

  return formData;
}

function mapRestaurantStatusTone(
  status: string,
): ClubhouseRestaurantListItem["statusTone"] {
  return status.trim().toLowerCase() === "active" ? "active" : "quiet";
}

export function mapAdminClubhouseRestaurant(
  item: AdminClubhouseRestaurantRaw,
): ClubhouseRestaurantListItem {
  return {
    id: item.id,
    restaurantName: item.restaurantName?.trim() || "—",
    cuisineType: item.cuisineType?.trim() || "—",
    statusLabel: item.status?.trim() || "—",
    statusTone: mapRestaurantStatusTone(item.status ?? ""),
    openingTime: item.openingTime?.trim() || "—",
    closingTime: item.closingTime?.trim() || "—",
    numberOfTables: item.numberOfTables ?? 0,
    capacity: item.capacity ?? 0,
    totalCapacity: item.totalCapacity ?? item.capacity ?? 0,
    booked: item.booked ?? 0,
    capacityLabel: item.capacityLabel?.trim() || "",
    images: item.images ?? [],
    createdAt: item.createdAt ?? "",
    updatedAt: item.updatedAt ?? "",
  };
}

export function mapAdminClubhouseRestaurantList(
  data: unknown,
): ClubhouseRestaurantListItem[] {
  const record =
    data && typeof data === "object"
      ? (data as AdminClubhouseRestaurantListData)
      : {};

  return (record.items ?? []).map(mapAdminClubhouseRestaurant);
}
