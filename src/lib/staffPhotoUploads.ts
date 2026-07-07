import type {
  CameraContext,
  CaptureStatus,
  PendingSummary,
  PhotoUploadFilter,
  PhotoUploadHeader,
  RecentUpload,
  SelectedPhoto,
  ServiceTypeTab,
  TodayCapture,
  UploadState,
  CaptureMode,
} from "@/components/staff/photo-uploads/types";
import type {
  StaffPhotoCaptureDetailRaw,
  StaffPhotoCaptureRaw,
  StaffPhotoUploadActiveJobRaw,
  StaffPhotoUploadHeaderRaw,
  StaffPhotoUploadListItemRaw,
  StaffPhotoUploadSummaryData,
  StaffPhotoUploadTabRaw,
  StaffPhotoUploadTodaySummaryRaw,
} from "@/types/api";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function extractArray<T>(
  value: unknown,
  keys: string[] = ["items", "captures", "uploads", "records", "data"],
): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  const record = asRecord(value);

  if (!record) {
    return [];
  }

  for (const key of keys) {
    const nested = record[key];

    if (Array.isArray(nested)) {
      return nested as T[];
    }
  }

  return [];
}

function parseCategoryTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((tag) => humanizeTag(String(tag)))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return [];
    }

    try {
      const parsed = JSON.parse(trimmed) as unknown;

      if (Array.isArray(parsed)) {
        return parsed
          .map((tag) => humanizeTag(String(tag)))
          .filter(Boolean);
      }
    } catch {
      return [humanizeTag(trimmed)];
    }
  }

  return [];
}

function readText(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" && !Number.isNaN(value)) {
    return String(value);
  }

  return "";
}

function humanizeTag(tag: string): string {
  return tag
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatCaptureTime(value?: string): string {
  const text = readText(value);

  if (!text) {
    return "—";
  }

  const date = new Date(text);

  if (Number.isNaN(date.getTime())) {
    return text;
  }

  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatCaptureDateTime(value?: string): string {
  const text = readText(value);

  if (!text) {
    return "—";
  }

  const date = new Date(text);

  if (Number.isNaN(date.getTime())) {
    return text;
  }

  const time = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const day = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  return `${time} · ${day}`;
}

function formatFileSize(value?: string | number, fileType?: string): string {
  const sizeText = readText(value);
  const typeText = readText(fileType).toUpperCase();

  if (!sizeText && !typeText) {
    return "—";
  }

  if (sizeText && typeText) {
    return `${sizeText} · ${typeText}`;
  }

  return sizeText || typeText;
}

function mapCaptureStatus(
  status?: string,
  isIssueFlagged?: boolean,
): CaptureStatus {
  if (isIssueFlagged) {
    return "flagged";
  }

  const normalized = status?.trim().toLowerCase().replace(/_/g, "-") ?? "";

  if (
    normalized.includes("flag") ||
    normalized.includes("issue")
  ) {
    return "flagged";
  }

  if (
    normalized.includes("pending") ||
    normalized.includes("draft") ||
    normalized.includes("queued")
  ) {
    return "pending";
  }

  return "uploaded";
}

function mapUploadState(
  status?: string,
  isIssueFlagged?: boolean,
): UploadState {
  if (isIssueFlagged) {
    return "flagged";
  }

  const normalized = status?.trim().toLowerCase().replace(/_/g, "-") ?? "";

  if (normalized.includes("flag") || normalized.includes("issue")) {
    return "flagged";
  }

  if (
    normalized.includes("pending") ||
    normalized.includes("draft") ||
    normalized.includes("queued")
  ) {
    return "pending";
  }

  if (normalized.includes("approve")) {
    return "approved";
  }

  return "synced";
}

function mapSelectedStatus(
  status?: string,
  isIssueFlagged?: boolean,
): SelectedPhoto["status"] {
  const uploadState = mapUploadState(status, isIssueFlagged);

  if (uploadState === "flagged") return "flagged";
  if (uploadState === "approved") return "approved";
  return "pending";
}

export function mapPhotoUploadFilterToQuery(
  filter: PhotoUploadFilter,
): string | undefined {
  if (filter === "all") {
    return undefined;
  }

  if (filter === "pending-upload") {
    return "pending_upload";
  }

  return filter;
}

export function mapPhotoUploadHeader(
  header?: StaffPhotoUploadHeaderRaw | null,
): PhotoUploadHeader {
  return {
    dateLabel: header?.dateLabel?.trim() || "—",
    shiftLabel: header?.shiftLabel?.trim() || "Staff Shift",
  };
}

export function mapPhotoUploadTabs(
  tabs?: StaffPhotoUploadTabRaw[] | unknown,
): { id: PhotoUploadFilter; label: string }[] | null {
  const tabList = extractArray<StaffPhotoUploadTabRaw>(tabs, [
    "tabs",
    "items",
    "filters",
  ]);

  if (!tabList.length) {
    return null;
  }

  const mapped = tabList
    .map((tab) => {
      const key = tab.key?.trim().toLowerCase().replace(/_/g, "-");

      if (
        key !== "all" &&
        key !== "today" &&
        key !== "pending-upload" &&
        key !== "inspection" &&
        key !== "service"
      ) {
        return null;
      }

      return {
        id: key as PhotoUploadFilter,
        label: tab.label?.trim() || humanizeTag(key),
      };
    })
    .filter((tab): tab is { id: PhotoUploadFilter; label: string } =>
      Boolean(tab),
    );

  return mapped.length > 0 ? mapped : null;
}

export function mapCameraContext(
  activeJob?: StaffPhotoUploadActiveJobRaw | null,
): CameraContext {
  const reference =
    readText(activeJob?.linkedJobReference) || readText(activeJob?.reference);
  const vehicle = readText(activeJob?.vehicleName) || readText(activeJob?.vehicle);
  const bay = readText(activeJob?.bay);
  const imageCode =
    readText(activeJob?.imageCode) || readText(activeJob?.fileName);

  const parts = [reference, vehicle, bay, imageCode].filter(Boolean);

  return {
    caption: parts.join(" · ") || "No active job linked",
    linkedJobReference: reference || undefined,
    sectionLabel: readText(activeJob?.caption) || undefined,
  };
}

export function mapTodaySummary(
  summary?: StaffPhotoUploadTodaySummaryRaw | null,
  captures: TodayCapture[] = [],
): PendingSummary {
  const pendingFromSummary =
    summary?.pendingUpload ??
    summary?.pendingUploadCount ??
    captures.filter((capture) => capture.status === "pending").length;

  const sizeValue =
    summary?.pendingTotalSize ??
  summary?.pendingSizeMb;

  const totalSizeMb =
    typeof sizeValue === "number"
      ? `${sizeValue.toFixed(1)} MB`
      : readText(sizeValue) || "—";

  return {
    totalPhotos: summary?.totalPhotos ?? captures.length,
    pendingCount: pendingFromSummary,
    totalSizeMb,
  };
}

function extractItemId(
  item: StaffPhotoUploadListItemRaw | StaffPhotoCaptureRaw | StaffPhotoCaptureDetailRaw,
): string {
  const record = asRecord(item);

  if (!record) {
    return "";
  }

  for (const key of [
    "id",
    "_id",
    "photoUploadId",
    "captureId",
    "uploadId",
    "referenceNumber",
  ]) {
    const id = readText(record[key]);

    if (id) {
      return id;
    }
  }

  return "";
}

export function normalizeDetailData(
  data: unknown,
): StaffPhotoCaptureDetailRaw | null {
  const record = asRecord(data);

  if (!record) {
    return null;
  }

  if (extractItemId(record as StaffPhotoCaptureDetailRaw)) {
    return record as StaffPhotoCaptureDetailRaw;
  }

  for (const key of ["photo", "capture", "upload", "selectedPhoto", "data"]) {
    const nested = asRecord(record[key]);

    if (nested && extractItemId(nested as StaffPhotoCaptureDetailRaw)) {
      return nested as StaffPhotoCaptureDetailRaw;
    }
  }

  return record as StaffPhotoCaptureDetailRaw;
}

export function mapTodayCapture(
  item: StaffPhotoCaptureRaw,
): TodayCapture | null {
  const id = extractItemId(item);

  if (!id) {
    return null;
  }

  const status = mapCaptureStatus(item.status ?? item.statusKey, item.isIssueFlagged);
  const label = readText(item.sectionLabel) || readText(item.label) || "Capture";
  const capturedAt = readText(item.capturedAt) || readText(item.time);

  return {
    id,
    label,
    time:
      status === "pending"
        ? "Pending upload"
        : status === "flagged"
          ? readText(item.caption) || label
          : formatCaptureTime(capturedAt),
    status,
    thumbnailUrl: readText(item.thumbnailUrl) || readText(item.imageUrl) || undefined,
  };
}

export function mapTodayCaptures(
  items?: StaffPhotoCaptureRaw[] | unknown,
): TodayCapture[] {
  const list = extractArray<StaffPhotoCaptureRaw>(items, [
    "captures",
    "todayCaptures",
    "items",
    "records",
  ]);

  return list
    .map((item) => mapTodayCapture(item))
    .filter((item): item is TodayCapture => Boolean(item));
}

export function mapSelectedPhoto(
  data?: StaffPhotoCaptureDetailRaw | null | unknown,
): SelectedPhoto | null {
  const normalized = normalizeDetailData(data ?? null);

  if (!normalized) {
    return null;
  }

  const id = extractItemId(normalized);

  if (!id) {
    return null;
  }

  const title =
    readText(normalized.sectionLabel) || readText(normalized.label) || "Photo";
  const linkedJob = readText(normalized.linkedJobReference);
  const indexValue = normalized.photoIndex ?? normalized.index;
  const status = mapSelectedStatus(
    normalized.status ?? normalized.statusKey,
    normalized.isIssueFlagged,
  );
  const categoryTags = parseCategoryTags(normalized.categoryTags);

  return {
    id,
    reference: linkedJob || "—",
    index:
      indexValue !== undefined
        ? `Photo ${String(indexValue).padStart(2, "0")}`
        : "Photo",
    title,
    status,
    time: formatCaptureDateTime(normalized.capturedAt ?? normalized.time),
    size: formatFileSize(
      normalized.fileSize,
      normalized.fileType ?? normalized.mimeType,
    ),
    fileId: linkedJob || id,
    categoryTags,
    caption: readText(normalized.caption) || readText(normalized.notes),
    isIssueFlagged: Boolean(normalized.isIssueFlagged),
    imageUrl:
      readText(normalized.imageUrl) ||
      readText(normalized.thumbnailUrl) ||
      undefined,
  };
}

function buildUploadTitle(item: StaffPhotoUploadListItemRaw): string {
  const vehicle = readText(item.vehicleName) || readText(item.vehicle);
  const section = readText(item.sectionLabel) || readText(item.title);

  if (vehicle && section) {
    return `${vehicle} — ${section}`;
  }

  return section || vehicle || "Photo Upload";
}

function buildUploadMeta(item: StaffPhotoUploadListItemRaw): string {
  const reference = readText(item.linkedJobReference);
  const time = formatCaptureTime(item.capturedAt ?? item.time);
  const size = readText(item.fileSize);

  return [reference, time, size].filter(Boolean).join(" · ") || "—";
}

export function mapRecentUpload(
  item: StaffPhotoUploadListItemRaw,
): RecentUpload | null {
  const id = extractItemId(item);

  if (!id) {
    return null;
  }

  return {
    id,
    title: buildUploadTitle(item),
    meta: buildUploadMeta(item),
    state: mapUploadState(item.status ?? item.statusKey, item.isIssueFlagged),
  };
}

export function mapRecentUploads(
  items?: StaffPhotoUploadListItemRaw[] | unknown,
): RecentUpload[] {
  const list = extractArray<StaffPhotoUploadListItemRaw>(items, [
    "uploads",
    "recentUploads",
    "items",
    "records",
  ]);

  return list
    .map((item) => mapRecentUpload(item))
    .filter((item): item is RecentUpload => Boolean(item));
}

export function extractRecentUploads(
  data?: StaffPhotoUploadSummaryData | null | unknown,
): StaffPhotoUploadListItemRaw[] {
  const normalized = normalizeSummaryData(data ?? null);
  const record = asRecord(normalized ?? data);

  if (!record) {
    return extractArray<StaffPhotoUploadListItemRaw>(data, [
      "recentUploads",
      "uploads",
      "items",
      "records",
    ]);
  }

  const sidebar = asRecord(record.sidebar);
  const candidates = [
    record.recentUploads,
    record.uploads,
    sidebar?.recentUploads,
    sidebar?.uploads,
  ];

  for (const candidate of candidates) {
    const items = extractArray<StaffPhotoUploadListItemRaw>(candidate, [
      "items",
      "uploads",
      "recentUploads",
      "records",
      "data",
    ]);

    if (items.length > 0) {
      return items;
    }
  }

  return [];
}

export function extractTodayCaptures(
  data?: StaffPhotoUploadSummaryData | null | unknown,
): StaffPhotoCaptureRaw[] {
  if (!data) {
    return [];
  }

  const record = asRecord(data);

  if (!record) {
    return [];
  }

  return extractArray<StaffPhotoCaptureRaw>(record.todayCaptures, [
    "captures",
    "todayCaptures",
    "items",
    "records",
  ]);
}

export function extractSelectedPhoto(
  data?: StaffPhotoUploadSummaryData | null | unknown,
): StaffPhotoCaptureDetailRaw | null | undefined {
  if (!data) {
    return undefined;
  }

  const record = asRecord(data);

  if (!record) {
    return undefined;
  }

  const sidebar = asRecord(record.sidebar);

  const selected =
    record.selectedPhoto ??
    sidebar?.selectedPhoto ??
    sidebar?.photo ??
    record.photo;

  return asRecord(selected) as StaffPhotoCaptureDetailRaw | undefined;
}

export function normalizeSummaryData(
  data: unknown,
): StaffPhotoUploadSummaryData | null {
  const record = asRecord(data);

  if (!record) {
    return null;
  }

  for (const key of ["screen", "dashboard", "summary"]) {
    const nested = asRecord(record[key]);

    if (nested) {
      return nested as StaffPhotoUploadSummaryData;
    }
  }

  return record as StaffPhotoUploadSummaryData;
}

const SERVICE_TAB_LABELS: Record<ServiceTypeTab, string> = {
  "pre-service": "Pre-Service Inspection",
  detailing: "Detailing",
  transport: "Transport",
  "damage-report": "Damage Report",
  "sign-off": "Sign-Off",
};

export function serviceTabToDraftMeta(tab: ServiceTypeTab): {
  sectionLabel: string;
  categoryTags: string[];
} {
  return {
    sectionLabel: SERVICE_TAB_LABELS[tab],
    categoryTags: [tab.replace(/-/g, "_")],
  };
}

export function captureModeToMeta(mode: CaptureMode): {
  accept: string;
  multiple: boolean;
  categoryTags: string[];
  sectionSuffix: string;
  showRec: boolean;
  zoomViewfinder: boolean;
} {
  switch (mode) {
    case "video":
      return {
        accept: "video/*",
        multiple: false,
        categoryTags: ["video"],
        sectionSuffix: "Video",
        showRec: true,
        zoomViewfinder: false,
      };
    case "burst":
      return {
        accept: "image/*",
        multiple: true,
        categoryTags: ["burst"],
        sectionSuffix: "Burst",
        showRec: false,
        zoomViewfinder: false,
      };
    case "zoom":
      return {
        accept: "image/*",
        multiple: false,
        categoryTags: ["zoom"],
        sectionSuffix: "Zoom",
        showRec: false,
        zoomViewfinder: true,
      };
    case "flash":
      return {
        accept: "image/*",
        multiple: false,
        categoryTags: ["flash"],
        sectionSuffix: "Flash",
        showRec: false,
        zoomViewfinder: false,
      };
    case "scan":
      return {
        accept: "image/*",
        multiple: false,
        categoryTags: ["scan"],
        sectionSuffix: "Scan",
        showRec: false,
        zoomViewfinder: false,
      };
    default:
      return {
        accept: "image/*",
        multiple: false,
        categoryTags: ["photo"],
        sectionSuffix: "Photo",
        showRec: false,
        zoomViewfinder: false,
      };
  }
}

export function buildCaptureUploadMeta(
  serviceTab: ServiceTypeTab,
  captureMode: CaptureMode,
): {
  sectionLabel: string;
  categoryTags: string[];
} {
  const serviceMeta = serviceTabToDraftMeta(serviceTab);
  const modeMeta = captureModeToMeta(captureMode);

  return {
    sectionLabel: `${serviceMeta.sectionLabel} — ${modeMeta.sectionSuffix}`,
    categoryTags: [...new Set([...serviceMeta.categoryTags, ...modeMeta.categoryTags])],
  };
}

export function extractPhotoUploadId(data: unknown): string | null {
  const record = asRecord(data);

  if (!record) {
    return null;
  }

  for (const key of ["id", "photoUploadId", "captureId", "uploadId"]) {
    const id = readText(record[key]);

    if (id) {
      return id;
    }
  }

  const nested = asRecord(record.photo ?? record.capture ?? record.upload);

  if (nested) {
    return extractPhotoUploadId(nested);
  }

  return null;
}

export function extractListUploads(data: unknown): StaffPhotoUploadListItemRaw[] {
  const fromSummaryShape = extractRecentUploads(data);

  if (fromSummaryShape.length > 0) {
    return fromSummaryShape;
  }

  return extractArray<StaffPhotoUploadListItemRaw>(data, [
    "recentUploads",
    "uploads",
    "items",
    "records",
    "data",
    "photos",
    "photoUploads",
    "list",
    "results",
    "rows",
    "captures",
  ]);
}

export function extractTodayListData(data: unknown): {
  captures: StaffPhotoCaptureRaw[];
  summary?: StaffPhotoUploadTodaySummaryRaw | null;
} {
  const record = asRecord(data);

  if (!record) {
    return { captures: [] };
  }

  return {
    captures: extractArray<StaffPhotoCaptureRaw>(
      record.captures ?? record.todayCaptures ?? record,
      ["captures", "todayCaptures", "items", "records"],
    ),
    summary:
      (record.summary as StaffPhotoUploadTodaySummaryRaw | undefined) ??
      (asRecord(record.todaySummary) as StaffPhotoUploadTodaySummaryRaw | undefined) ??
      null,
  };
}

export function applySummaryToState(data?: StaffPhotoUploadSummaryData | null | unknown) {
  const normalized = normalizeSummaryData(data ?? null);
  const record = asRecord(normalized);
  const todayItems = mapTodayCaptures(extractTodayCaptures(normalized));

  return {
    header: mapPhotoUploadHeader(
      (record?.header as StaffPhotoUploadHeaderRaw | undefined) ?? undefined,
    ),
    tabs: mapPhotoUploadTabs(record?.tabs),
    cameraContext: mapCameraContext(
      (record?.activeJob as StaffPhotoUploadActiveJobRaw | undefined) ?? undefined,
    ),
    todayCaptures: todayItems,
    todaySummary: mapTodaySummary(
      (record?.todaySummary as StaffPhotoUploadTodaySummaryRaw | undefined) ??
        (asRecord(record?.todayCaptures)?.summary as
          | StaffPhotoUploadTodaySummaryRaw
          | undefined),
      todayItems,
    ),
    selectedPhoto: mapSelectedPhoto(extractSelectedPhoto(normalized)),
    recentUploads: mapRecentUploads(extractRecentUploads(normalized)),
  };
}
