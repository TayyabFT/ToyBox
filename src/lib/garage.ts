import type {
  GarageServiceInfoRaw,
  GarageTabRaw,
  GarageVehicleRaw,
  MemberVehicleDetailData,
  MemberVehicleDocumentItemRaw,
  MemberVehicleQuickActionRaw,
} from "@/types/api";
import type {
  GarageFilter,
  GarageFilterKey,
  GarageVehicle,
  GarageVehicleStatusTone,
  MemberVehicleDetail,
  MemberVehicleDocument,
  MemberVehicleDocumentIconTone,
  MemberVehicleHealthMetric,
  MemberVehicleRequestItem,
} from "@/components/member/garage/types";

const KNOWN_STATUS_TONES: GarageVehicleStatusTone[] = [
  "ready",
  "in_service",
  "away",
  "stored",
  "in_review",
];

function mapStatusTone(
  statusKey?: string,
  statusLabel?: string,
): GarageVehicleStatusTone {
  if (statusKey && KNOWN_STATUS_TONES.includes(statusKey as GarageVehicleStatusTone)) {
    return statusKey as GarageVehicleStatusTone;
  }

  const normalized = (statusLabel || statusKey || "")
    .toLowerCase()
    .replace(/\s+/g, "_");

  if (normalized.includes("review")) return "in_review";
  if (normalized.includes("service")) return "in_service";
  if (normalized.includes("away")) return "away";
  if (normalized.includes("ready")) return "ready";
  if (normalized.includes("stored")) return "stored";

  return "stored";
}

function formatServiceValue(service?: GarageServiceInfoRaw): string {
  if (!service) return "—";
  if (service.display) return service.display;
  if (service.isDue) return "Due";
  if (service.months) return `${service.months}mo`;

  return "—";
}

/** `service` is a plain display string on the current API; fall back to the older `{ label, months, isDue }` object shape. */
function resolveServiceDisplay(raw: GarageVehicleRaw): string {
  if (typeof raw.service === "string" && raw.service) return raw.service;

  const serviceObject =
    (typeof raw.service === "object" ? raw.service : undefined) ??
    raw.serviceInterval ??
    raw.metrics?.service;

  return formatServiceValue(serviceObject);
}

function formatCompactMileage(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return Number.isInteger(millions)
      ? `${millions.toLocaleString()}M`
      : `${millions.toFixed(1)}M`;
  }

  if (value >= 100_000) {
    return `${Math.round(value / 1000).toLocaleString()}K`;
  }

  return value.toLocaleString();
}

function parseMileageValue(value: string | number): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const parsed = Number(String(value).replace(/[^\d]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function formatMilesValue(value: string | number): string {
  const parsed = parseMileageValue(value);

  if (parsed == null) {
    return String(value);
  }

  if (parsed >= 100_000) {
    return formatCompactMileage(parsed);
  }

  return parsed.toLocaleString();
}

function resolveMilesDisplay(raw: GarageVehicleRaw): string {
  if (raw.miles) return formatMilesValue(raw.miles);
  if (raw.metrics?.miles?.display) return formatMilesValue(raw.metrics.miles.display);
  if (raw.mileageLabel) return formatMilesValue(raw.mileageLabel);

  const value = raw.metrics?.miles?.value ?? raw.mileage;
  if (value == null) return "—";

  return formatMilesValue(value);
}

function resolveInspectedDisplay(raw: GarageVehicleRaw): string {
  return (
    raw.inspected ||
    raw.metrics?.inspected?.display ||
    raw.inspection?.display ||
    "—"
  );
}

function formatLastInspectedValue(
  lastInspected: GarageVehicleRaw["lastInspected"],
): string {
  if (lastInspected && typeof lastInspected === "object") {
    return lastInspected.label || "—";
  }

  return "—";
}

export function mapGarageVehicle(raw: GarageVehicleRaw): GarageVehicle {
  return {
    id: raw.id,
    make: raw.make || raw.displayName || "Vehicle",
    model: raw.model || "",
    detail: raw.subtitle || (raw.year ? String(raw.year) : ""),
    imageUrl: raw.imageUrl || "",
    era: raw.collectionEra === "classic" ? "classic" : "modern",
    statusTone: mapStatusTone(raw.statusKey, raw.statusLabel || raw.status),
    statusLabel: raw.statusLabel,
    bayLabel: raw.bay?.label || raw.storageBay || undefined,
    stats: [
      {
        value: resolveMilesDisplay(raw),
        label: raw.metrics?.miles?.label || "Miles",
      },
      {
        value: resolveServiceDisplay(raw),
        label: raw.metrics?.service?.label || "Service",
      },
      {
        value: resolveInspectedDisplay(raw),
        label: raw.metrics?.inspected?.label || "Inspected",
      },
    ],
    lastInspectedLabel: "Last inspected",
    lastInspectedValue: formatLastInspectedValue(raw.lastInspected),
  };
}

export function mapGarageFilters(tabs?: GarageTabRaw[]): GarageFilter[] {
  if (!tabs || tabs.length === 0) {
    return [{ key: "all", label: "All" }];
  }

  return tabs.map((tab) => ({
    key: tab.key as GarageFilterKey,
    label: tab.label,
    count: tab.count,
  }));
}

const EMPTY_VALUE = "—";

const QUICK_ACTION_MAP: Record<
  string,
  Pick<MemberVehicleRequestItem, "id" | "title" | "subtitle" | "icon">
> = {
  transport: {
    id: "transport",
    title: "Transport & Delivery",
    subtitle: "Pickup or drop-off",
    icon: "transport",
  },
  detailing: {
    id: "detailing",
    title: "Detailing & Wash",
    subtitle: "Full detail or wash",
    icon: "detailing",
  },
  service: {
    id: "maintenance",
    title: "Maintenance & Service",
    subtitle: "Repairs & scheduled",
    icon: "maintenance",
  },
  vehicle_source: {
    id: "parking",
    title: "Vehicle Parking",
    subtitle: "Request parking slot",
    icon: "parking",
  },
};

function displayOrDash(value?: string | number | null): string {
  if (value == null) return EMPTY_VALUE;
  const text = String(value).trim();
  return text || EMPTY_VALUE;
}

function formatPurchasedDate(value?: string): string {
  if (!value?.trim()) return EMPTY_VALUE;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function formatGeneratedAt(value?: string): string {
  if (!value?.trim()) return EMPTY_VALUE;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return EMPTY_VALUE;

  const now = new Date();
  const time = parsed.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (parsed.toDateString() === now.toDateString()) {
    return `${time} today`;
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function buildDetailLine(year?: number, suffix?: string): string {
  const parts: string[] = [];

  if (year) parts.push(String(year));
  if (suffix?.trim()) parts.push(suffix.trim());

  return parts.join(" · ");
}

function mapQuickActions(
  actions?: MemberVehicleQuickActionRaw[],
): MemberVehicleRequestItem[] {
  if (!actions?.length) {
    return Object.values(QUICK_ACTION_MAP);
  }

  return actions.map((action) => {
    const mapped = action.key ? QUICK_ACTION_MAP[action.key] : undefined;

    if (mapped) {
      return mapped;
    }

    return {
      id: (action.key || action.type || "unknown") as MemberVehicleRequestItem["id"],
      title: displayOrDash(action.label),
      subtitle: "",
      icon: "transport",
    };
  });
}

function mapHealthMetrics(
  data: MemberVehicleDetailData,
): MemberVehicleHealthMetric[] {
  const items =
    data.healthReport?.items ??
    data.details?.healthSummary?.highlights ??
    [];

  return items.map((item) => ({
    label: item.label || item.category || "Health",
    percentage: item.percentage ?? 0,
    note: item.note?.trim() || EMPTY_VALUE,
  }));
}

function getFileTypeLabel(url: string): string {
  const extension = url.split("?")[0]?.split(".").pop()?.toLowerCase();

  if (extension === "pdf") return "PDF";
  if (["jpg", "jpeg", "png", "webp", "gif"].includes(extension ?? "")) {
    return "Image";
  }

  return extension ? extension.toUpperCase() : "File";
}

function formatDocMonthYear(value?: string): string | null {
  if (!value?.trim()) return null;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function mapDocumentIconTone(key: string): MemberVehicleDocumentIconTone {
  switch (key) {
    case "vehicleRegistration":
      return "red";
    case "insuranceCertificate":
      return "blue";
    case "purchasedInvoice":
      return "greenCheck";
    case "warrantyCertificate":
      return "green";
    default:
      return "orange";
  }
}

function buildDocumentSubtitle(
  item: MemberVehicleDocumentItemRaw,
  fileType: string,
): string {
  const parts = [fileType];
  const uploaded = formatDocMonthYear(item.uploadedAt);
  const expires = formatDocMonthYear(item.expiresAt);

  if (item.key === "insuranceCertificate" && expires) {
    parts.push(`Valid ${expires}`);
  } else if (item.key === "vehicleRegistration" && uploaded) {
    parts.push(`Issued ${uploaded}`);
  } else if (item.key === "warrantyCertificate" && expires) {
    parts.push(`Valid ${expires}`);
  } else if (uploaded) {
    parts.push(uploaded);
  }

  return parts.join(" · ");
}

function buildDocumentBadge(
  item: MemberVehicleDocumentItemRaw,
): MemberVehicleDocument["badge"] | undefined {
  const expiresAt = item.expiresAt?.trim();
  if (!expiresAt) {
    if (
      item.key === "insuranceCertificate" ||
      item.key === "warrantyCertificate"
    ) {
      return { label: "Valid", tone: "valid" };
    }

    return undefined;
  }

  const expires = new Date(expiresAt);
  if (Number.isNaN(expires.getTime())) return undefined;

  const now = new Date();
  if (expires < now) {
    return { label: "Expired", tone: "expired" };
  }

  const monthsUntilExpiry =
    (expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);

  if (item.key === "vehicleRegistration" || monthsUntilExpiry <= 18) {
    return {
      label: `Exp ${formatDocMonthYear(expiresAt)}`,
      tone: "expiring",
    };
  }

  return { label: "Valid", tone: "valid" };
}

function mapVehicleDocuments(
  data: MemberVehicleDetailData,
): MemberVehicleDocument[] {
  const sections = data.documents?.sections ?? [];

  return sections.flatMap((section) =>
    (section.items ?? [])
      .filter((item) => item.isUploaded && item.url?.trim())
      .map((item) => {
        const url = item.url!.trim();
        const fileType = getFileTypeLabel(url);

        return {
          key: item.key || item.label || url,
          title: item.label || "Document",
          subtitle: buildDocumentSubtitle(item, fileType),
          url,
          iconTone: mapDocumentIconTone(item.key || ""),
          badge: buildDocumentBadge(item),
        };
      }),
  );
}

export function mapMemberVehicleDetail(
  data: MemberVehicleDetailData,
): MemberVehicleDetail {
  const details = data.details;
  const quickStats = details?.quickStats;
  const specs = data.specs;
  const vehicleSpecs = specs?.vehicleSpecs;
  const ownershipInfo = specs?.ownershipInfo;
  const generalInfo = specs?.generalInfo;

  const make = details?.make || generalInfo?.make || data.displayName || "Vehicle";
  const model = details?.model || generalInfo?.model || "";
  const year = details?.year ?? generalInfo?.year ?? vehicleSpecs?.year;
  const detailSuffix =
    quickStats?.engine?.trim() ||
    details?.colour?.trim() ||
    generalInfo?.engineType?.trim();

  const mileageValue = quickStats?.mileage || ownershipInfo?.mileage;

  return {
    id: data.id,
    make,
    model,
    detail: buildDetailLine(year, detailSuffix),
    imageUrl: details?.imageUrl || "",
    statusTone: mapStatusTone(details?.statusKey, details?.status),
    statusLabel: details?.status || undefined,
    bayLabel: quickStats?.storageLocation?.trim() || ownershipInfo?.location?.trim() || undefined,
    stats: [
      {
        value: mileageValue ? formatMilesValue(mileageValue) : EMPTY_VALUE,
        label: "Miles",
      },
      {
        value: displayOrDash(quickStats?.lastServiced),
        label: "Service",
      },
      {
        value: displayOrDash(quickStats?.engine),
        label: "Engine",
      },
      {
        value: displayOrDash(quickStats?.storageLocation),
        label: "Location",
      },
    ],
    lastInspectedLabel: "Health report",
    lastInspectedValue: formatGeneratedAt(data.healthReport?.generatedAt),
    requests: mapQuickActions(details?.quickActions),
    specs: {
      make: displayOrDash(vehicleSpecs?.brand || generalInfo?.make || make),
      model: displayOrDash(vehicleSpecs?.model || generalInfo?.model || model),
      year: year ? String(year) : EMPTY_VALUE,
      engine: displayOrDash(
        vehicleSpecs?.engine || generalInfo?.engineType || quickStats?.engine,
      ),
      power: displayOrDash(
        vehicleSpecs?.power ||
          vehicleSpecs?.maxPower ||
          specs?.performance?.maxPower,
      ),
      transmission: displayOrDash(
        vehicleSpecs?.transmission || generalInfo?.transmission,
      ),
      drive: displayOrDash(vehicleSpecs?.drive),
      zeroToHundred: displayOrDash(
        vehicleSpecs?.zeroToHundred || specs?.performance?.zeroToHundred,
      ),
      topSpeed: displayOrDash(
        vehicleSpecs?.topSpeed || specs?.performance?.topSpeed,
      ),
    },
    ownership: {
      colour: displayOrDash(
        vehicleSpecs?.colour ||
          generalInfo?.exteriorColor ||
          details?.colour,
      ),
      chassisNo: displayOrDash(ownershipInfo?.vin || generalInfo?.vin),
      plate: displayOrDash(ownershipInfo?.plate),
      purchased: formatPurchasedDate(ownershipInfo?.purchasedAt),
      storageBay: displayOrDash(
        ownershipInfo?.location || quickStats?.storageLocation,
      ),
      mileage: mileageValue
        ? `${formatMilesValue(mileageValue)} miles`
        : EMPTY_VALUE,
    },
    health: mapHealthMetrics(data),
    healthCtaLabel: "Request Detailing",
    documents: mapVehicleDocuments(data),
    sourcingRequestId: details?.sourcingRequestId != null
      ? String(details.sourcingRequestId)
      : undefined,
  };
}
