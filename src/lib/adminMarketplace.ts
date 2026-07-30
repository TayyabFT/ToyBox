import type {
  MarketplaceOfferAction,
  MarketplaceOfferActionRequest,
  MarketplaceOfferRaw,
  MarketplaceOffersListData,
  MarketplaceVehicleRaw,
  MarketplaceVehicleWizardRequest,
  MarketplaceVehiclesListData,
} from "@/types/api";
import {
  DOC_FIELDS,
  HEALTH_CATEGORIES,
  createInitialAddVehicleForm,
  createInitialDocsForm,
  createInitialHealthForm,
  type AddVehicleFormState,
} from "@/components/staff/vehicles/add-vehicle/types";
import type {
  MarketplaceOfferItem,
  MarketplaceOfferStatusTone,
  MarketplaceVehicleHealthItem,
  MarketplaceVehicleItem,
  MarketplaceVehicleStatusTone,
} from "@/components/admin/marketplace/types";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function extractList<T>(
  data: unknown,
  keys: string[],
): { items: T[]; total: number } {
  if (Array.isArray(data)) {
    return { items: data as T[], total: data.length };
  }

  const record = asRecord(data);

  if (!record) {
    return { items: [], total: 0 };
  }

  for (const key of keys) {
    const value = record[key];

    if (Array.isArray(value)) {
      const total =
        typeof record.count === "number"
          ? record.count
          : typeof record.total === "number"
            ? record.total
            : value.length;

      return { items: value as T[], total };
    }
  }

  return { items: [], total: 0 };
}

function toNumber(value: unknown): number {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, "").trim());
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  return 0;
}

function formatMoney(value: number): string {
  if (!value && value !== 0) return "—";

  return `AED ${value.toLocaleString("en-US")}`;
}

function formatMileage(value: unknown): string {
  const num = toNumber(value);

  if (!num && value !== 0 && value !== "0") {
    return typeof value === "string" && value.trim() ? value.trim() : "—";
  }

  return `${num.toLocaleString("en-US")} km`;
}

export function mapMarketplaceVehicleStatusTone(
  status?: string,
): MarketplaceVehicleStatusTone {
  const normalized = status?.trim().toLowerCase() ?? "";

  if (normalized.includes("sold") || normalized.includes("purchased")) {
    return "sold";
  }

  if (normalized.includes("reserve")) {
    return "reserved";
  }

  if (normalized.includes("available") || normalized.includes("active")) {
    return "available";
  }

  return "other";
}

export function mapMarketplaceOfferStatusTone(
  status?: string,
): MarketplaceOfferStatusTone {
  const normalized = status?.trim().toLowerCase() ?? "";

  if (normalized.includes("purchased") || normalized.includes("complete")) {
    return "purchased";
  }

  if (normalized.includes("reject")) {
    return "rejected";
  }

  if (normalized.includes("payment")) {
    return "payment";
  }

  if (normalized.includes("counter")) {
    return "countered";
  }

  if (normalized.includes("pending") || normalized.includes("submitted")) {
    return "pending";
  }

  return "other";
}

export function mapMarketplaceVehicle(
  raw: MarketplaceVehicleRaw,
): MarketplaceVehicleItem | null {
  if (raw.id === undefined || raw.id === null) {
    return null;
  }

  const info = raw.vehicleInfo;
  const ownership = raw.ownershipInfo;
  const price = toNumber(raw.price);
  const discount = toNumber(raw.discount);
  const finalPrice =
    raw.finalPrice !== undefined && raw.finalPrice !== null
      ? toNumber(raw.finalPrice)
      : Math.max(0, price - discount);

  const make =
    info?.make?.trim() ||
    info?.name?.trim() ||
    raw.make?.trim() ||
    "";
  const model = info?.model?.trim() || raw.model?.trim() || "";
  const year = toNumber(info?.year ?? raw.year) || undefined;
  const color =
    ownership?.colour?.trim() ||
    ownership?.color?.trim() ||
    raw.color?.trim() ||
    raw.colour?.trim() ||
    "";
  const mileageValue = ownership?.mileage ?? raw.mileage;
  const vin =
    ownership?.chassisNo?.trim() ||
    raw.chassisNo?.trim() ||
    raw.vin?.trim() ||
    "";
  const transmission =
    info?.transmission?.trim() || raw.transmission?.trim() || "";
  const fuelType = info?.fuelType?.trim() || raw.fuelType?.trim() || "";

  const title =
    raw.title?.trim() ||
    [make, model, raw.variant?.trim()].filter(Boolean).join(" ") ||
    "Untitled Listing";

  const status = raw.status?.trim() || "AVAILABLE";
  const images = [
    ...(raw.images ?? []),
    ...(raw.vehicleImages ?? []),
  ]
    .map((url) => url.trim())
    .filter(Boolean);
  const imageUrl = images[0] || raw.imageUrl?.trim() || "";

  const health: MarketplaceVehicleHealthItem[] = (raw.health ?? [])
    .map((item) => {
      const category = item.category?.trim();
      if (!category) return null;

      return {
        category,
        percentage: toNumber(item.percentage),
        ...(item.note?.trim() ? { note: item.note.trim() } : {}),
      };
    })
    .filter((item): item is MarketplaceVehicleHealthItem => item !== null);

  return {
    id: String(raw.id),
    title,
    description: raw.description?.trim() || "",
    make,
    model,
    variant: raw.variant?.trim() || "",
    year,
    color,
    mileageLabel: formatMileage(mileageValue),
    mileage: toNumber(mileageValue),
    vin,
    transmission,
    fuelType,
    engine: info?.engine?.trim() || raw.engine?.trim() || "",
    power: info?.power?.trim() || raw.power?.trim() || "",
    drive: info?.drive?.trim() || raw.drive?.trim() || "",
    zeroToHundred:
      info?.zeroToHundred?.trim() || raw.zeroToHundred?.trim() || "",
    topSpeed: info?.topSpeed?.trim() || raw.topSpeed?.trim() || "",
    plate: ownership?.plate?.trim() || raw.plate?.trim() || "",
    purchasedAt:
      ownership?.purchasedAt?.trim() || raw.purchasedAt?.trim() || "",
    storageBay:
      ownership?.storageBay?.trim() || raw.storageBay?.trim() || "",
    health,
    images,
    imageUrl,
    specifications: raw.specifications ?? {},
    price,
    discount,
    finalPrice,
    priceLabel: formatMoney(price),
    discountLabel: formatMoney(discount),
    finalPriceLabel: formatMoney(finalPrice),
    status,
    statusLabel: status.replace(/_/g, " "),
    statusTone: mapMarketplaceVehicleStatusTone(status),
    createdAt: raw.createdAt?.trim() || "",
  };
}

export function mapMarketplaceVehicles(
  data: MarketplaceVehiclesListData | null | undefined,
): MarketplaceVehicleItem[] {
  return extractList<MarketplaceVehicleRaw>(data, [
    "items",
    "vehicles",
    "data",
  ]).items
    .map(mapMarketplaceVehicle)
    .filter((item): item is MarketplaceVehicleItem => item !== null);
}

export function mapMarketplaceOffer(
  raw: MarketplaceOfferRaw,
): MarketplaceOfferItem | null {
  if (raw.id === undefined || raw.id === null) {
    return null;
  }

  const vehicle =
    raw.vehicle && typeof raw.vehicle === "object"
      ? mapMarketplaceVehicle(raw.vehicle)
      : null;

  const memberName =
    raw.member?.name?.trim() ||
    raw.memberName?.trim() ||
    "Member";

  const status = raw.status?.trim() || "PENDING";
  const offerPrice = toNumber(raw.offerPrice);
  const counterOfferPrice = toNumber(raw.counterOfferPrice);
  const statusTone = mapMarketplaceOfferStatusTone(status);
  const isOpenOffer =
    statusTone === "pending" || statusTone === "countered" || statusTone === "other";
  const isPaymentPending = statusTone === "payment";

  return {
    id: String(raw.id),
    status,
    statusLabel: status.replace(/_/g, " "),
    statusTone,
    offerPrice,
    offerPriceLabel: formatMoney(offerPrice),
    counterOfferPrice,
    counterOfferPriceLabel: counterOfferPrice
      ? formatMoney(counterOfferPrice)
      : undefined,
    remarks: raw.remarks?.trim() || raw.note?.trim() || "",
    memberName,
    memberEmail: raw.member?.email?.trim() || "",
    memberTier: raw.member?.tier?.trim() || "",
    memberId: raw.member?.id?.trim() || raw.memberId?.trim() || "",
    vehicleId:
      vehicle?.id ||
      (raw.vehicleId != null ? String(raw.vehicleId) : "") ||
      (raw.marketplaceVehicleId != null
        ? String(raw.marketplaceVehicleId)
        : ""),
    vehicleTitle: vehicle?.title || "Vehicle",
    vehicleSubtitle:
      [vehicle?.make, vehicle?.model, vehicle?.variant]
        .filter(Boolean)
        .join(" · ") || "",
    vehiclePriceLabel: vehicle?.finalPriceLabel || vehicle?.priceLabel || "—",
    vehicleImageUrl: vehicle?.imageUrl || "",
    vehicleStatusLabel: vehicle?.statusLabel || "",
    vehicleMake: vehicle?.make || "",
    vehicleModel: vehicle?.model || "",
    vehicleYear: vehicle?.year,
    vehicleColor: vehicle?.color || "",
    vehicleMileageLabel: vehicle?.mileageLabel || "—",
    createdAt: raw.createdAt?.trim() || "",
    updatedAt: raw.updatedAt?.trim() || "",
    canApprove: isOpenOffer,
    canReject: isOpenOffer,
    canCounter: isOpenOffer,
    canApprovePayment: isPaymentPending,
    canRejectPayment: isPaymentPending,
  };
}

export function normalizeMarketplaceOfferDetail(
  data: unknown,
): MarketplaceOfferRaw | null {
  const record = asRecord(data);

  if (!record) return null;

  if (record.id !== undefined && record.id !== null) {
    return record as MarketplaceOfferRaw;
  }

  const nested =
    asRecord(record.offer) ||
    asRecord(record.data) ||
    asRecord(record.item);

  if (nested && nested.id !== undefined && nested.id !== null) {
    return nested as MarketplaceOfferRaw;
  }

  return null;
}

export function buildMarketplaceOfferActionBody(input: {
  action: MarketplaceOfferAction;
  counterOfferPrice?: number;
  remarks?: string;
}): MarketplaceOfferActionRequest {
  return {
    action: input.action,
    counterOfferPrice:
      input.action === "counter" ? Number(input.counterOfferPrice ?? 0) : 0,
    remarks: input.remarks?.trim() || "",
  };
}

export function mapMarketplaceOffers(
  data: MarketplaceOffersListData | null | undefined,
): MarketplaceOfferItem[] {
  return extractList<MarketplaceOfferRaw>(data, [
    "items",
    "offers",
    "data",
  ]).items
    .map(mapMarketplaceOffer)
    .filter((item): item is MarketplaceOfferItem => item !== null);
}

function parsePurchasedAt(value: string): string {
  const trimmed = value.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const parsed = Date.parse(trimmed);

  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toISOString().slice(0, 10);
  }

  const monthYear = trimmed.match(/^([A-Za-z]+)\s+(\d{4})$/);

  if (monthYear) {
    const date = new Date(`${monthYear[1]} 1, ${monthYear[2]}`);

    if (!Number.isNaN(date.getTime())) {
      return date.toISOString().slice(0, 10);
    }
  }

  return trimmed;
}

export type MarketplaceVehicleWizardForm = AddVehicleFormState & {
  fuelType: string;
  price: string;
  discount: string;
  status: string;
  existingImageUrls: string[];
};

export function createInitialMarketplaceVehicleForm(): MarketplaceVehicleWizardForm {
  return {
    ...createInitialAddVehicleForm(),
    fuelType: "",
    price: "",
    discount: "0",
    status: "AVAILABLE",
    existingImageUrls: [],
  };
}

export function marketplaceVehicleToWizardForm(
  vehicle: MarketplaceVehicleItem,
): MarketplaceVehicleWizardForm {
  const health = createInitialHealthForm();

  for (const item of vehicle.health) {
    const key = item.category as keyof typeof health;

    if (key in health) {
      health[key] = {
        percentage: item.percentage || 45,
        note: item.note || "",
        noteOpen: Boolean(item.note),
      };
    }
  }

  return {
    vehicleInfo: {
      name: vehicle.make,
      model: vehicle.model,
      year: vehicle.year ? String(vehicle.year) : "",
      engine: vehicle.engine,
      power: vehicle.power,
      transmission: vehicle.transmission,
      drive: vehicle.drive,
      zeroToHundred: vehicle.zeroToHundred,
      topSpeed: vehicle.topSpeed,
      vehicleImages: [],
    },
    ownershipInfo: {
      colour: vehicle.color,
      chassisNo: vehicle.vin,
      plate: vehicle.plate,
      purchased: vehicle.purchasedAt,
      storageBay: vehicle.storageBay,
      mileage: vehicle.mileage ? String(vehicle.mileage) : "",
    },
    docs: createInitialDocsForm(),
    health,
    fuelType: vehicle.fuelType,
    price: vehicle.price ? String(vehicle.price) : "",
    discount: String(vehicle.discount || 0),
    status: vehicle.status || "AVAILABLE",
    existingImageUrls: vehicle.images,
  };
}

export function buildMarketplaceVehicleWizardPayload(
  form: MarketplaceVehicleWizardForm,
): MarketplaceVehicleWizardRequest {
  const { vehicleInfo, ownershipInfo, health, fuelType, price, discount, status } =
    form;
  const make = vehicleInfo.name.trim() || vehicleInfo.model.trim();

  // ── Use the wizard (nested) shape ────────────────────────────────────────
  // The backend accepts Joi.alternatives: wizard body OR flat body.
  // We use the wizard shape so all vehicle metadata is preserved.
  //
  // ownershipInfo.chassisNo has min(5) — send a placeholder when blank so
  // validation passes; the admin can fill it in later via edit.
  const chassisNo = ownershipInfo.chassisNo.trim() || "N/A-0";
  const plate     = ownershipInfo.plate.trim()     || "N/A";
  const storageBay= ownershipInfo.storageBay.trim()|| "N/A";
  const colour    = ownershipInfo.colour.trim()    || "N/A";
  const mileage   = ownershipInfo.mileage.trim()   || "0";

  // purchasedAt must be a date string — default to today when blank
  const today = new Date().toISOString().slice(0, 10);
  const purchasedAt = ownershipInfo.purchased.trim()
    ? parsePurchasedAt(ownershipInfo.purchased)
    : today;

  return {
    vehicleInfo: {
      make,
      model: vehicleInfo.model.trim(),
      year: Number.parseInt(vehicleInfo.year, 10),
      engine: vehicleInfo.engine.trim(),
      power: vehicleInfo.power.trim(),
      transmission: vehicleInfo.transmission.trim(),
      drive: vehicleInfo.drive.trim(),
      zeroToHundred: vehicleInfo.zeroToHundred.trim(),
      topSpeed: vehicleInfo.topSpeed.trim(),
      fuelType: fuelType.trim(),
    },
    ownershipInfo: {
      colour,
      chassisNo,
      plate,
      purchasedAt,
      storageBay,
      mileage,
    },
    health: HEALTH_CATEGORIES.map(({ key }) => ({
      category: key,
      percentage: health[key].percentage,
      ...(health[key].note.trim() ? { note: health[key].note.trim() } : {}),
    })),
    price: toNumber(price),
    discount: toNumber(discount),
    status: status.trim() || "AVAILABLE",
    registrationStep: "complete" as const,
  };
}

export function buildMarketplaceVehicleFormData(
  form: MarketplaceVehicleWizardForm,
): FormData {
  const payload = buildMarketplaceVehicleWizardPayload(form);
  const formData = new FormData();
  const { vehicleInfo, ownershipInfo } = payload;

  formData.append("make", vehicleInfo.make);
  formData.append("model", vehicleInfo.model);
  formData.append("year", String(vehicleInfo.year));
  formData.append("engine", vehicleInfo.engine);
  formData.append("power", vehicleInfo.power);
  formData.append("transmission", vehicleInfo.transmission);
  formData.append("drive", vehicleInfo.drive);
  formData.append("zeroToHundred", vehicleInfo.zeroToHundred);
  formData.append("topSpeed", vehicleInfo.topSpeed);
  formData.append("fuelType", vehicleInfo.fuelType);
  formData.append("colour", ownershipInfo.colour);
  formData.append("chassisNo", ownershipInfo.chassisNo);
  formData.append("plate", ownershipInfo.plate);
  formData.append("purchasedAt", ownershipInfo.purchasedAt);
  formData.append("storageBay", ownershipInfo.storageBay);
  formData.append("mileage", ownershipInfo.mileage);
  formData.append("health", JSON.stringify(payload.health));
  formData.append("price", String(payload.price));
  formData.append("discount", String(payload.discount));
  formData.append("status", payload.status);
  formData.append("registrationStep", "complete");

  // Nested JSON fields — backend multipart parser reads these
  formData.append("vehicleInfo", JSON.stringify(vehicleInfo));
  formData.append("ownershipInfo", JSON.stringify(ownershipInfo));

  for (const field of DOC_FIELDS) {
    const file = form.docs[field.key];
    if (file) {
      formData.append(field.key, file);
    }
  }

  for (const image of form.vehicleInfo.vehicleImages) {
    formData.append("vehicleImages", image);
  }

  return formData;
}

export function marketplaceVehicleNeedsMultipart(
  form: MarketplaceVehicleWizardForm,
): boolean {
  return (
    Object.values(form.docs).some((file) => file !== null) ||
    form.vehicleInfo.vehicleImages.length > 0
  );
}
