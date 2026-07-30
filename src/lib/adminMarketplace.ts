import type {
  MarketplaceOfferAction,
  MarketplaceOfferActionRequest,
  MarketplaceOfferRaw,
  MarketplaceOffersListData,
  MarketplaceVehicleRaw,
  MarketplaceVehiclesListData,
} from "@/types/api";
import type {
  MarketplaceOfferItem,
  MarketplaceOfferStatusTone,
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

  const price = toNumber(raw.price);
  const discount = toNumber(raw.discount);
  const finalPrice =
    raw.finalPrice !== undefined && raw.finalPrice !== null
      ? toNumber(raw.finalPrice)
      : Math.max(0, price - discount);

  const title =
    raw.title?.trim() ||
    [raw.make?.trim(), raw.model?.trim(), raw.variant?.trim()]
      .filter(Boolean)
      .join(" ") ||
    "Untitled Listing";

  const status = raw.status?.trim() || "AVAILABLE";
  const imageUrl =
    raw.images?.find((url) => url?.trim())?.trim() ||
    raw.imageUrl?.trim() ||
    "";

  return {
    id: String(raw.id),
    title,
    description: raw.description?.trim() || "",
    make: raw.make?.trim() || "",
    model: raw.model?.trim() || "",
    variant: raw.variant?.trim() || "",
    year: toNumber(raw.year) || undefined,
    color: raw.color?.trim() || raw.colour?.trim() || "",
    mileageLabel: formatMileage(raw.mileage),
    mileage: toNumber(raw.mileage),
    vin: raw.vin?.trim() || "",
    transmission: raw.transmission?.trim() || "",
    fuelType: raw.fuelType?.trim() || "",
    images: (raw.images ?? []).map((url) => url.trim()).filter(Boolean),
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

export function buildMarketplaceVehicleBody(input: {
  title: string;
  description: string;
  make: string;
  model: string;
  variant: string;
  year: string;
  color: string;
  mileage: string;
  vin: string;
  transmission: string;
  fuelType: string;
  imagesText: string;
  price: string;
  discount: string;
  status: string;
}) {
  const images = input.imagesText
    .split(/\n|,/)
    .map((url) => url.trim())
    .filter(Boolean);

  return {
    title: input.title.trim(),
    description: input.description.trim(),
    make: input.make.trim(),
    model: input.model.trim(),
    variant: input.variant.trim(),
    year: toNumber(input.year),
    color: input.color.trim(),
    mileage: toNumber(input.mileage),
    vin: input.vin.trim(),
    transmission: input.transmission.trim(),
    fuelType: input.fuelType.trim(),
    images,
    specifications: {},
    price: toNumber(input.price),
    discount: toNumber(input.discount),
    status: input.status.trim() || "AVAILABLE",
  };
}
