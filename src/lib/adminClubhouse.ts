import {
  CLUBHOUSE_CUISINE_TYPE_OPTIONS,
  CLUBHOUSE_LOUNGE_TITLE_OPTIONS,
  CLUBHOUSE_PRIVATE_LOUNGE_TYPE_OPTIONS,
  CLUBHOUSE_RESTAURANT_NAME_OPTIONS,
  CLUBHOUSE_RESTAURANT_TYPE_OPTIONS,
  CLUBHOUSE_SUITE_ROOM_TYPE_OPTIONS,
  CLUBHOUSE_SUITE_TITLE_OPTIONS,
} from "@/components/admin/clubhouse/add-area/constants";
import type {
  ClubhousePrivateLoungeFormState,
  ClubhouseRestaurantFormState,
  ClubhouseSuiteLoungeFormState,
} from "@/components/admin/clubhouse/add-area/types";
import type { ClubhouseRestaurantListItem } from "@/components/admin/clubhouse/restaurant/types";
import type {
  ClubhouseReservationRow,
  ClubhouseReservationsDisplay,
  ClubhouseReservationStatus,
  ClubhouseStatsDisplay,
  ClubhouseVenueCard,
  ClubhouseVenuesDisplay,
  ClubhouseVenueStatusTone,
} from "@/components/admin/clubhouse/types";
import type {
  ClubhouseAreaCategoryCard,
  ClubhouseAreaId,
  ClubhouseAreaOverviewDisplay,
  ClubhouseAreaServiceRow,
} from "@/components/admin/clubhouse/area-services/types";
import type {
  AdminClubhouseAreaOverviewData,
  AdminClubhouseAreaOverviewItemRaw,
  AdminClubhouseOverviewArea,
  AdminClubhouseOverviewAreaType,
  AdminClubhouseOverviewData,
  AdminClubhouseReservationRaw,
  AdminClubhouseReservationsData,
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

function appendImageFiles(
  formData: FormData,
  fieldName: string,
  files: File[],
) {
  for (const file of files) {
    formData.append(fieldName, file);
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
    restaurantType: resolveOptionLabel(
      CLUBHOUSE_RESTAURANT_TYPE_OPTIONS,
      form.restaurantType,
    ),
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
  formData.append("restaurantType", payload.restaurantType);
  formData.append("status", payload.status);

  appendImageFiles(
    formData,
    "images",
    getClubhouseImageFiles(form.ambienceImages),
  );

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
    type: resolveOptionLabel(CLUBHOUSE_PRIVATE_LOUNGE_TYPE_OPTIONS, form.type),
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

  appendImageFiles(formData, "images", getClubhouseImageFiles(form.images));

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
    roomType: resolveOptionLabel(
      CLUBHOUSE_SUITE_ROOM_TYPE_OPTIONS,
      primarySuite?.roomType ?? "",
    ),
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

  appendImageFiles(formData, "imageUrls", getClubhouseImageFiles(form.images));

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

const CLUBHOUSE_AREA_TITLES: Record<string, string> = {
  restaurant: "Restaurant",
  private_lounge: "Private Lounge",
  suite_lounge: "Suite Lounge",
};

const CLUBHOUSE_AREA_HREFS: Record<string, string> = {
  restaurant: "/admin/clubhouse/restaurant",
  private_lounge: "/admin/clubhouse/private-lounge",
  suite_lounge: "/admin/clubhouse/suite-lounge",
};

function mapAdminClubhouseOverviewArea(
  id: string,
  area: AdminClubhouseOverviewArea | undefined,
): ClubhouseVenueCard {
  const totalCapacity = area?.totalCapacity ?? 0;
  const totalOccupied = area?.totalOccupied ?? 0;
  const types = area?.types ?? [];
  const occupancyPercent =
    totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  return {
    id,
    href: CLUBHOUSE_AREA_HREFS[id],
    title: { highlight: CLUBHOUSE_AREA_TITLES[id] ?? id.replace(/_/g, " ") },
    statusLabel: `${occupancyPercent}% Occupied`,
    statusTone: occupancyPercent >= 50 ? "active" : "quiet",
    subtitle: `${types.length} ${
      types.length === 1 ? "Category" : "Categories"
    } · ${totalCapacity} Total`,
    occupied: totalOccupied,
    capacity: totalCapacity,
    details: types.map((type) => ({
      label: type.type?.trim() || "—",
      value:
        type.occupancyLabel?.trim() ||
        `${type.totalOccupied ?? 0}/${type.totalCapacity ?? 0}`,
    })),
  };
}

export function mapAdminClubhouseOverviewStats(
  data: AdminClubhouseOverviewData,
): ClubhouseStatsDisplay {
  const metrics = data.metrics ?? {};
  const onPremises = metrics.onPremises ?? {};
  const fnbRevenue = metrics.fnbRevenue ?? {};
  const suiteOccupancy = metrics.suiteOccupancy ?? {};

  const suiteTotal = suiteOccupancy.total ?? suiteOccupancy.booked ?? 0;
  const suiteOccupied = suiteOccupancy.occupied ?? 0;
  const suiteAvailable = Math.max(0, suiteTotal - suiteOccupied);

  return {
    onPremises: {
      label: "On Premises",
      value: String(onPremises.members ?? onPremises.today ?? 0),
      subtext: onPremises.label?.trim() || "Members",
      trend:
        onPremises.changePercent !== undefined
          ? `${onPremises.changePercent >= 0 ? "+" : ""}${onPremises.changePercent}%`
          : undefined,
    },
    reservations: {
      label: "Reservations",
      value: String(metrics.reservations ?? 0),
      subtext: "Today",
    },
    fnbRevenue: {
      label: "F&B Revenue",
      value: fnbRevenue.label?.trim() || String(fnbRevenue.amount ?? 0),
      subtext: "Today",
    },
    suiteOccupancy: {
      label: "Suite Occupancy",
      value: suiteOccupancy.label?.trim() || `${suiteOccupied}/${suiteTotal}`,
      subtext: `Available · ${suiteAvailable}`,
    },
  };
}

export function mapAdminClubhouseOverviewVenues(
  data: AdminClubhouseOverviewData,
): ClubhouseVenuesDisplay {
  const areas = data.areas ?? {};

  return [
    mapAdminClubhouseOverviewArea("restaurant", areas.restaurant),
    mapAdminClubhouseOverviewArea("private_lounge", areas.private_lounge),
    mapAdminClubhouseOverviewArea("suite_lounge", areas.suite_lounge),
  ];
}

export function createEmptyAdminClubhouseStats(): ClubhouseStatsDisplay {
  return {
    onPremises: { label: "On Premises", value: "0", subtext: "Members" },
    reservations: { label: "Reservations", value: "0", subtext: "Today" },
    fnbRevenue: { label: "F&B Revenue", value: "AED 0", subtext: "Today" },
    suiteOccupancy: {
      label: "Suite Occupancy",
      value: "0/0",
      subtext: "Available · 0",
    },
  };
}

export function createEmptyAdminClubhouseVenues(): ClubhouseVenuesDisplay {
  return (["restaurant", "private_lounge", "suite_lounge"] as const).map(
    (id) => mapAdminClubhouseOverviewArea(id, undefined),
  );
}

function normalizeAdminReservationStatus(
  status?: string,
): ClubhouseReservationStatus {
  const normalized = status?.trim().toLowerCase() ?? "";

  if (normalized === "confirmed") {
    return "confirmed";
  }

  if (normalized === "prep" || normalized === "preparation") {
    return "prep";
  }

  return "pending";
}

export function mapAdminClubhouseReservation(
  row: AdminClubhouseReservationRaw,
): ClubhouseReservationRow {
  const member = row.member ?? {};
  const memberName = member.name?.trim() || "—";

  return {
    id: row.id,
    time: row.time?.trim() || row.timeSlot?.trim() || "—",
    memberName,
    memberInitial:
      member.initial?.trim() ||
      memberName.charAt(0).toUpperCase() ||
      "?",
    memberNumber:
      member.memberNumberLabel?.trim() ||
      member.memberNumber?.trim() ||
      "—",
    zone: row.zone?.trim() || row.areaTitle?.trim() || "—",
    party: row.party ?? row.pax ?? row.guests ?? 0,
    status: normalizeAdminReservationStatus(row.status),
    statusLabel: row.statusLabel?.trim() || undefined,
    notes: row.notes?.trim() || "—",
  };
}

export function mapAdminClubhouseReservations(
  data?: AdminClubhouseReservationsData | null,
): ClubhouseReservationsDisplay {
  const summary = data?.summary ?? {};

  return {
    confirmedCount: summary.confirmed ?? 0,
    walkInCount: summary.walkIns ?? 0,
    summaryLabel: summary.label?.trim() || undefined,
    rows: (data?.reservations ?? []).map(mapAdminClubhouseReservation),
  };
}

export function createEmptyAdminClubhouseReservations(): ClubhouseReservationsDisplay {
  return {
    confirmedCount: 0,
    walkInCount: 0,
    rows: [],
  };
}

function mapClubhouseItemStatus(status?: string): {
  label: string;
  tone: ClubhouseVenueStatusTone;
} {
  const normalized = status?.trim().toLowerCase() || "active";

  if (normalized === "prep" || normalized === "preparation") {
    return { label: "Prep", tone: "prep" };
  }

  if (normalized === "inactive" || normalized === "closed") {
    return { label: "Closed", tone: "quiet" };
  }

  return {
    label: normalized.replace(/\b\w/g, (char) => char.toUpperCase()),
    tone: "active",
  };
}

function buildClubhouseAreaServiceCells(
  areaId: ClubhouseAreaId,
  item: AdminClubhouseAreaOverviewItemRaw,
): Record<string, string> {
  if (areaId === "restaurant") {
    const serviceHours =
      item.serviceHours?.trim() ||
      (item.openingTime && item.closingTime
        ? `${item.openingTime} - ${item.closingTime}`
        : "—");

    return {
      cuisineType: item.cuisineType?.trim() || "—",
      serviceHours,
      tables: item.tables !== undefined ? String(item.tables) : "—",
      capacity: String(item.capacity ?? 0),
    };
  }

  if (areaId === "private_lounge") {
    const availability =
      item.availability?.trim() ||
      (item.isAvailable24x7
        ? "Available 24x7"
        : item.available
          ? "Available"
          : "—");

    return {
      type: item.type?.trim() || "—",
      availability,
      capacity: String(item.capacity ?? 0),
      inUse: String(item.occupied ?? 0),
    };
  }

  return {
    location: item.location?.trim() || item.type?.trim() || "—",
    availability:
      item.availability?.trim() || (item.available ? "Available" : "—"),
    capacity: String(item.capacity ?? 0),
    use: String(item.occupied ?? 0),
  };
}

function mapClubhouseAreaServiceRow(
  areaId: ClubhouseAreaId,
  item: AdminClubhouseAreaOverviewItemRaw,
): ClubhouseAreaServiceRow {
  const status = mapClubhouseItemStatus(item.status);

  return {
    id: item.id,
    name: item.title?.trim() || "—",
    categoryId: item.type?.trim() || "—",
    statusLabel: status.label,
    statusTone: status.tone,
    cells: buildClubhouseAreaServiceCells(areaId, item),
  };
}

function mapClubhouseAreaCategoryCard(
  type: AdminClubhouseOverviewAreaType,
  items: AdminClubhouseAreaOverviewItemRaw[],
): ClubhouseAreaCategoryCard {
  const totalCapacity = type.totalCapacity ?? 0;
  const totalOccupied = type.totalOccupied ?? 0;
  const typeName = type.type?.trim() || "—";
  const occupancyPercent =
    totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  const topItems = items
    .filter((item) => (item.type?.trim() || "") === typeName)
    .slice(0, 3)
    .map((item) => ({
      id: item.id,
      label: item.title?.trim() || "—",
      value:
        item.occupancyLabel?.trim() ||
        `${item.occupied ?? 0}/${item.capacity ?? 0}`,
    }));

  return {
    id: typeName,
    tabLabel: typeName,
    title: { highlight: typeName },
    statusLabel: `${occupancyPercent}% Occupied`,
    statusTone: occupancyPercent >= 50 ? "active" : "quiet",
    available: Math.max(0, totalCapacity - totalOccupied),
    occupied: totalOccupied,
    topItems,
  };
}

export function mapAdminClubhouseAreaOverview(
  areaId: ClubhouseAreaId,
  data: AdminClubhouseAreaOverviewData,
): ClubhouseAreaOverviewDisplay {
  const types = data.types ?? [];
  const items = data.items ?? [];

  return {
    areaCountLabel: `${types.length} ${
      types.length === 1 ? "Category" : "Categories"
    } · ${data.totalCapacity ?? 0} Total`,
    categories: types.map((type) => mapClubhouseAreaCategoryCard(type, items)),
    items: items.map((item) => mapClubhouseAreaServiceRow(areaId, item)),
  };
}

export function createEmptyAdminClubhouseAreaOverview(): ClubhouseAreaOverviewDisplay {
  return {
    areaCountLabel: "0 Categories · 0 Total",
    categories: [],
    items: [],
  };
}
