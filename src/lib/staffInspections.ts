import { isApiError } from "@/lib/apiError";
import type { VehicleStatus } from "@/components/staff/vehicles/types";
import { normalizeBayForApi, normalizeFuelLevelForApi, normalizeOdometerForApi } from "@/lib/addInspectionValidation";
import type {
  ActiveInspection,
  InspectionChecklistItem,
  InspectionPhoto,
  InspectionQueueItem,
  InspectionStats,
  InspectionStep,
  InspectionStepId,
} from "@/components/staff/inspections/types";
import type {
  StaffInspectionChecklistItemRaw,
  StaffInspectionCreateRequest,
  StaffInspectionDashboardSummaryRaw,
  StaffInspectionDetailRaw,
  StaffInspectionDraftRequest,
  StaffInspectionFlaggedIssueRaw,
  StaffInspectionListData,
  StaffInspectionPhotoRaw,
  StaffInspectionQueueItemRaw,
  StaffInspectionStatRaw,
  StaffInspectionStepRaw,
} from "@/types/api";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function isNumericId(value: string): boolean {
  return /^\d+$/.test(value);
}

export function resolveInspectionApiId(
  primaryId?: string,
  fallbackId?: string,
): string {
  const primary = primaryId?.trim() ?? "";
  const fallback = fallbackId?.trim() ?? "";

  if (isNumericId(primary)) {
    return primary;
  }

  if (isNumericId(fallback)) {
    return fallback;
  }

  return primary || fallback;
}

function isInspectionVehicleRecord(record: Record<string, unknown>): boolean {
  return (
    record.make !== undefined ||
    record.model !== undefined ||
    record.displayName !== undefined
  );
}

function isInspectionStaffRecord(record: Record<string, unknown>): boolean {
  return record.email !== undefined;
}

function shouldMergeNestedInspectionRecord(
  record: Record<string, unknown>,
): boolean {
  if (isInspectionVehicleRecord(record) || isInspectionStaffRecord(record)) {
    return false;
  }

  return hasInspectionDetailShape(record);
}

function extractArray<T>(
  value: unknown,
  keys: string[] = ["items", "inspections", "queue", "records", "data"],
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

function readStatValue(stat?: StaffInspectionStatRaw | null): string | undefined {
  if (!stat) {
    return undefined;
  }

  if (stat.displayValue?.trim()) {
    return stat.displayValue.trim();
  }

  for (const candidate of [stat.value, stat.count, stat.total]) {
    if (candidate !== undefined && candidate !== null) {
      return String(candidate);
    }
  }

  return undefined;
}

function sanitizeDraftValue(value?: string): string | undefined {
  const trimmed = value?.trim();

  if (!trimmed || trimmed === "—") {
    return undefined;
  }

  return trimmed;
}

export function normalizeInspectionListData(
  data: unknown,
): StaffInspectionListData | null {
  const record = asRecord(data);

  if (!record) {
    return null;
  }

  for (const key of ["screen", "dashboard", "summary"]) {
    const nested = asRecord(record[key]);

    if (nested && (nested.dashboardSummary || nested.inspections || nested.items)) {
      return nested as StaffInspectionListData;
    }
  }

  return record as StaffInspectionListData;
}

const SUMMARY_STAT_KEYS = [
  "dueToday",
  "inProgress",
  "completedThisShift",
  "completed",
  "flaggedIssues",
  "flagged",
];

function hasSummaryStatShape(record: Record<string, unknown>): boolean {
  return SUMMARY_STAT_KEYS.some((key) => record[key] !== undefined);
}

export function extractInspectionDashboardSummary(
  data: unknown,
): StaffInspectionDashboardSummaryRaw | null | undefined {
  const record = normalizeInspectionListData(data);

  if (record?.dashboardSummary) {
    return record.dashboardSummary;
  }

  const raw = asRecord(data);

  if (!raw) {
    return undefined;
  }

  const nestedDashboard = asRecord(raw.dashboardSummary);

  if (nestedDashboard) {
    return nestedDashboard as StaffInspectionDashboardSummaryRaw;
  }

  if (hasSummaryStatShape(raw)) {
    return raw as StaffInspectionDashboardSummaryRaw;
  }

  for (const value of Object.values(raw)) {
    const nested = asRecord(value);

    if (nested && hasSummaryStatShape(nested)) {
      return nested as StaffInspectionDashboardSummaryRaw;
    }

    const nestedDashboardSummary = asRecord(nested?.dashboardSummary);

    if (nestedDashboardSummary && hasSummaryStatShape(nestedDashboardSummary)) {
      return nestedDashboardSummary as StaffInspectionDashboardSummaryRaw;
    }
  }

  return undefined;
}

export function hasMeaningfulInspectionSummary(data: unknown): boolean {
  const summary = extractInspectionDashboardSummary(data);

  if (!summary) {
    return false;
  }

  return SUMMARY_STAT_KEYS.some((key) => {
    const stat = (summary as Record<string, unknown>)[key];
    return asRecord(stat) !== null && Object.keys(asRecord(stat) ?? {}).length > 0;
  });
}

export function extractInspectionQueue(
  data: unknown,
): StaffInspectionQueueItemRaw[] {
  const record = normalizeInspectionListData(data);

  if (!record) {
    return extractArray<StaffInspectionQueueItemRaw>(data, [
      "inspections",
      "items",
      "queue",
      "records",
    ]);
  }

  return extractArray<StaffInspectionQueueItemRaw>(
    record.inspections ?? record.items ?? record.queue,
    ["inspections", "items", "queue", "records"],
  );
}

export function normalizeInspectionDetailData(
  data: unknown,
): StaffInspectionDetailRaw | null {
  const record = asRecord(data);

  if (!record) {
    return null;
  }

  let merged: Record<string, unknown> = {};

  if (hasInspectionDetailShape(record)) {
    merged = { ...merged, ...record };
  }

  for (const key of [
    "inspection",
    "detail",
    "record",
    "result",
    "data",
    "screen",
    "payload",
  ]) {
    const nested = asRecord(record[key]);

    if (nested && shouldMergeNestedInspectionRecord(nested)) {
      merged = { ...merged, ...nested };
    }
  }

  for (const value of Object.values(record)) {
    const nested = asRecord(value);

    if (nested && shouldMergeNestedInspectionRecord(nested)) {
      merged = { ...merged, ...nested };
    }
  }

  if (!hasInspectionDetailShape(merged)) {
    return hasInspectionDetailShape(record)
      ? (record as StaffInspectionDetailRaw)
      : null;
  }

  return merged as StaffInspectionDetailRaw;
}

function hasInspectionDetailShape(record: Record<string, unknown>): boolean {
  return (
    record.id !== undefined ||
    Boolean(readText(record.referenceNumber) || readText(record.reference)) ||
    Boolean(
      record.checklist ||
        record.checklistItems ||
        record.steps ||
        record.inspectionSteps ||
        record.flaggedIssues ||
        record.flaggedIssue ||
        record.issues ||
        record.photos ||
        record.photoEvidence ||
        record.evidencePhotos ||
        record.images,
    ) ||
    Boolean(record.vehicle || record.bay) ||
    Boolean(
      readText(record.currentStep) ||
        readText(record.activeStep) ||
        readText(record.currentStepKey) ||
        readText(record.activeStepKey),
    )
  );
}

export type MapActiveInspectionOptions = {
  fallbackId?: string;
  queueItem?: InspectionQueueItem | null;
};

export function buildFallbackInspectionFromQueue(
  queueItem: InspectionQueueItem | null | undefined,
  fallbackId: string,
): ActiveInspection | null {
  if (!queueItem || !fallbackId) {
    return null;
  }

  return {
    id: resolveInspectionApiId(fallbackId, queueItem.id),
    reference: queueItem.reference || "—",
    vehicle: queueItem.vehicle,
    bay: queueItem.bay,
    mileage: "—",
    inspectionType: queueItem.serviceType,
    steps: STEP_ORDER.map((id, index) => ({
      id,
      label: STEP_LABELS[id],
      state: index === 0 ? "active" : "upcoming",
    })),
    activeStepId: "exterior",
    checklist: [],
    odometer: "—",
    fuelLevel: "—",
    photos: [],
  };
}

export function filterChecklistForStep(
  checklist: InspectionChecklistItem[],
  stepId: InspectionStepId,
): InspectionChecklistItem[] {
  const stepItems = checklist.filter(
    (item) => !item.stepId || item.stepId === stepId,
  );

  return stepItems.length > 0 ? stepItems : checklist;
}

export function hasMeaningfulInspectionDetailData(data: unknown): boolean {
  const record = asRecord(data);

  if (!record) {
    return false;
  }

  return hasInspectionDetailShape(record);
}

export function isInspectionCompletedStatus(status?: string): boolean {
  const normalized = status?.trim().toLowerCase().replace(/_/g, "-") ?? "";

  if (!normalized) {
    return false;
  }

  return (
    normalized === "done" ||
    normalized.includes("complete") ||
    normalized.includes("submit") ||
    normalized === "closed"
  );
}

export function isInspectionEditable(
  queueItem?: InspectionQueueItem | null,
  detailStatus?: string,
): boolean {
  if (queueItem?.status === "done") {
    return false;
  }

  if (isInspectionCompletedStatus(detailStatus)) {
    return false;
  }

  return true;
}

export function isInspectionSubmittable(
  queueItem?: InspectionQueueItem | null,
  detailStatus?: string,
): boolean {
  return isInspectionEditable(queueItem, detailStatus);
}

const INSPECTION_PHOTO_PROXY_PREFIX = "/api/backend";

function resolveInspectionPhotoUrl(url: string): string {
  const trimmed = url.trim();

  if (!trimmed) {
    return "";
  }

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("/api/")) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return `${INSPECTION_PHOTO_PROXY_PREFIX}${trimmed}`;
  }

  return `${INSPECTION_PHOTO_PROXY_PREFIX}/${trimmed}`;
}

export function createLocalInspectionPhoto(
  file: File,
  itemKey?: string,
): InspectionPhoto {
  return {
    id: `local-${Date.now()}`,
    url: URL.createObjectURL(file),
    itemKey: itemKey?.trim() || undefined,
    caption: file.name,
  };
}

export function mergeInspectionPhotos(
  ...groups: InspectionPhoto[][]
): InspectionPhoto[] {
  const merged: InspectionPhoto[] = [];
  const seen = new Set<string>();

  for (const group of groups) {
    for (const photo of group) {
      const key = photo.id || photo.url;

      if (!key || seen.has(key)) {
        continue;
      }

      seen.add(key);
      merged.push(photo);
    }
  }

  return merged;
}

export function formatInspectionApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (!isApiError(error)) {
    return (error as { message?: string }).message ?? fallback;
  }

  const fieldErrors = error.errors ?? [];
  const checklistErrors = fieldErrors.filter((item) =>
    item.field?.includes("checklist"),
  );

  if (checklistErrors.length > 0) {
    return "Checklist status is invalid. Items must be unchecked, pass, or fail.";
  }

  const messages = [
    ...new Set(
      fieldErrors
        .map((item) => item.message?.trim())
        .filter((message): message is string => Boolean(message)),
    ),
  ];

  if (messages.length === 1) {
    return messages[0];
  }

  if (messages.length > 1) {
    return `${error.message}: ${messages.slice(0, 2).join(" · ")}`;
  }

  return error.message || fallback;
}

function mapInspectionPhoto(
  photo: StaffInspectionPhotoRaw,
  index: number,
): InspectionPhoto | null {
  const url = resolveInspectionPhotoUrl(
    photo.url?.trim() ||
      photo.imageUrl?.trim() ||
      photo.thumbnailUrl?.trim() ||
      photo.src?.trim() ||
      photo.photoUrl?.trim() ||
      photo.fileUrl?.trim() ||
      photo.path?.trim() ||
      "",
  );

  if (!url) {
    return null;
  }

  return {
    id:
      photo.id !== undefined && photo.id !== null
        ? String(photo.id)
        : `photo-${index + 1}`,
    url,
    itemKey: photo.itemKey?.trim() || undefined,
    caption: photo.caption?.trim() || photo.label?.trim() || undefined,
    createdAt: photo.createdAt?.trim() || photo.uploadedAt?.trim() || undefined,
  };
}

function extractInspectionPhotosFromRecord(
  record: StaffInspectionDetailRaw | Record<string, unknown> | null,
): InspectionPhoto[] {
  if (!record) {
    return [];
  }

  const photos: InspectionPhoto[] = [];
  const extracted = extractArray<StaffInspectionPhotoRaw>(
    (record as StaffInspectionDetailRaw).photos ??
      (record as StaffInspectionDetailRaw).photoEvidence ??
      (record as StaffInspectionDetailRaw).evidencePhotos ??
      (record as StaffInspectionDetailRaw).evidence ??
      (record as StaffInspectionDetailRaw).images,
    [
      "photos",
      "photoEvidence",
      "evidencePhotos",
      "evidence",
      "images",
      "uploadedPhotos",
      "attachments",
      "media",
      "files",
      "items",
    ],
  );

  photos.push(
    ...extracted
      .map((photo, index) => mapInspectionPhoto(photo, index))
      .filter((photo): photo is InspectionPhoto => Boolean(photo)),
  );

  const imageUrls = (record as StaffInspectionDetailRaw).imageUrls;

  if (Array.isArray(imageUrls)) {
    imageUrls.forEach((value, index) => {
      if (typeof value !== "string" || !value.trim()) {
        return;
      }

      photos.push({
        id: `image-url-${index + 1}`,
        url: resolveInspectionPhotoUrl(value),
      });
    });
  }

  const flaggedIssues = extractFlaggedIssues(record);

  flaggedIssues.forEach((issue, issueIndex) => {
    const issueKey = issue.itemKey?.trim() || issue.key?.trim();
    const issueLabel = issue.label?.trim() || issue.title?.trim() || issue.tag?.trim();
    const issuePhotoUrls = [...(issue.photoUrls ?? []), ...(issue.imageUrls ?? [])];

    issuePhotoUrls.forEach((value, photoIndex) => {
      if (typeof value !== "string" || !value.trim()) {
        return;
      }

      photos.push({
        id: `flagged-${issueKey || issueIndex + 1}-${photoIndex + 1}`,
        url: resolveInspectionPhotoUrl(value),
        itemKey: issueKey || undefined,
        caption: issueLabel || undefined,
      });
    });

    const issuePhotos = extractArray<StaffInspectionPhotoRaw>(issue.photos, [
      "photos",
      "photoUrls",
      "imageUrls",
      "items",
    ]);

    photos.push(
      ...issuePhotos
        .map((photo, photoIndex) =>
          mapInspectionPhoto(
            {
              ...photo,
              itemKey: photo.itemKey ?? issueKey,
              caption: photo.caption ?? issueLabel,
            },
            photoIndex,
          ),
        )
        .filter((photo): photo is InspectionPhoto => Boolean(photo)),
    );
  });

  return photos;
}

export function extractInspectionPhotos(data: unknown): InspectionPhoto[] {
  const raw = asRecord(data);
  const sources = [
    normalizeInspectionDetailData(data),
    raw as StaffInspectionDetailRaw | null,
  ].filter(Boolean) as Array<StaffInspectionDetailRaw | Record<string, unknown>>;

  const photos = sources.flatMap((record) =>
    extractInspectionPhotosFromRecord(record),
  );

  if (raw) {
    for (const key of [
      "data",
      "inspection",
      "detail",
      "result",
      "photo",
      "upload",
      "payload",
    ]) {
      photos.push(
        ...extractInspectionPhotosFromRecord(
          asRecord(raw[key]) as StaffInspectionDetailRaw | null,
        ),
      );
    }
  }

  return mergeInspectionPhotos(photos);
}

export function mergeInspectionAfterDraft(
  current: ActiveInspection,
  responseData: unknown,
  options?: MapActiveInspectionOptions,
): ActiveInspection {
  if (!hasMeaningfulInspectionDetailData(responseData)) {
    return current;
  }

  const mapped = mapActiveInspection(responseData, options);

  if (!mapped) {
    return current;
  }

  return {
    ...mapped,
    checklist: mapped.checklist.length > 0 ? mapped.checklist : current.checklist,
    odometer: mapped.odometer !== "—" ? mapped.odometer : current.odometer,
    fuelLevel: mapped.fuelLevel !== "—" ? mapped.fuelLevel : current.fuelLevel,
    notes: mapped.notes ?? current.notes,
    flaggedIssue: mapped.flaggedIssue ?? current.flaggedIssue,
    photos: mergeInspectionPhotos(
      mapped.photos.length > 0 ? mapped.photos : current.photos,
    ),
    statusKey: mapped.statusKey ?? current.statusKey,
  };
}

const STEP_ORDER: InspectionStepId[] = [
  "exterior",
  "interior",
  "mechanical",
  "tyres",
];

const STEP_LABELS: Record<InspectionStepId, string> = {
  exterior: "Exterior",
  interior: "Interior",
  mechanical: "Mechanical",
  tyres: "Tyres",
};

function readText(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" && !Number.isNaN(value)) {
    return String(value);
  }

  return "";
}

function mapStatCard(
  stat?: StaffInspectionStatRaw,
  fallbackValue = "0",
  fallbackSubtext = "—",
): { value: string; subtext: string } {
  const value = readStatValue(stat) ?? fallbackValue;

  return {
    value,
    subtext:
      stat?.subtitle?.trim() ||
      stat?.subtext?.trim() ||
      stat?.label?.trim() ||
      fallbackSubtext,
  };
}

export function mapInspectionStats(
  summary?: StaffInspectionDashboardSummaryRaw | null,
): InspectionStats {
  return {
    dueToday: {
      ...mapStatCard(summary?.dueToday, "0", "Inspections Pending"),
      summaryKey: "dueToday",
    },
    inProgress: {
      ...mapStatCard(summary?.inProgress, "0", "Active Now"),
      summaryKey: "inProgress",
    },
    completed: {
      ...mapStatCard(
        summary?.completedThisShift ?? summary?.completed,
        "0",
        "This Shift",
      ),
      summaryKey: "completedThisShift",
    },
    flagged: {
      ...mapStatCard(
        summary?.flaggedIssues ?? summary?.flagged,
        "0",
        "Needs Review",
      ),
      summaryKey: "flaggedIssues",
    },
  };
}

function mapQueueStatus(statusKey?: string): VehicleStatus {
  const normalized = statusKey?.trim().toLowerCase().replace(/_/g, "-") ?? "";

  if (normalized.includes("progress")) return "in-progress";
  if (normalized.includes("overdue")) return "overdue";
  if (
    normalized.includes("complete") ||
    normalized.includes("done") ||
    normalized.includes("submit") ||
    normalized === "closed"
  ) {
    return "done";
  }

  if (normalized.includes("critical")) return "critical";
  if (normalized.includes("pending")) return "pending";

  return "pending";
}

function resolveVehicleLabel(
  vehicle?: StaffInspectionQueueItemRaw["vehicle"],
  referenceNumber?: string,
): string {
  if (typeof vehicle === "string") {
    const label = vehicle.trim();

    if (label) {
      return label;
    }
  } else if (vehicle && typeof vehicle === "object") {
    const label =
      vehicle.displayName?.trim() ||
      vehicle.name?.trim() ||
      [vehicle.make?.trim(), vehicle.model?.trim()].filter(Boolean).join(" ") ||
      vehicle.label?.trim();

    if (label) {
      return label;
    }
  }

  return referenceNumber?.trim() || "Vehicle";
}

function resolveStaffLabel(
  staff?: StaffInspectionQueueItemRaw["assignedStaff"],
  fallback?: string,
): string {
  if (typeof staff === "string") {
    return staff.trim() || fallback || "Unassigned";
  }

  return staff?.name?.trim() || staff?.label?.trim() || fallback || "Unassigned";
}

function formatQueueTime(scheduledAt?: string, time?: string): string {
  if (time?.trim()) {
    return time.trim();
  }

  if (!scheduledAt?.trim()) {
    return "—";
  }

  const date = new Date(scheduledAt);

  if (Number.isNaN(date.getTime())) {
    return scheduledAt;
  }

  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function mapInspectionQueueItem(
  item: StaffInspectionQueueItemRaw,
): InspectionQueueItem | null {
  if (item.id === undefined || item.id === null) {
    return null;
  }

  const reference = item.referenceNumber?.trim() || "";
  const bay = item.bay?.trim() || "—";
  const normalizedBay = bay.toLowerCase().startsWith("bay") ? bay : `Bay ${bay}`;

  return {
    id: String(item.id),
    reference,
    vehicle: resolveVehicleLabel(item.vehicle, reference),
    serviceType:
      item.serviceType?.trim() ||
      item.inspectionType?.trim() ||
      "Inspection",
    bay: normalizedBay,
    assignee:
      resolveStaffLabel(item.assignedStaff, item.assigneeName?.trim()) ||
      item.assignee?.trim() ||
      "Unassigned",
    time: formatQueueTime(item.scheduledAt, item.time),
    status: mapQueueStatus(item.statusKey ?? item.status),
  };
}

export function mapInspectionQueue(
  items?: StaffInspectionQueueItemRaw[] | unknown,
): InspectionQueueItem[] {
  const list = extractArray<StaffInspectionQueueItemRaw>(items, [
    "inspections",
    "items",
    "queue",
    "records",
  ]);

  return list
    .map((item) => mapInspectionQueueItem(item))
    .filter((item): item is InspectionQueueItem => Boolean(item));
}

function normalizeStepId(value?: string): InspectionStepId | null {
  const normalized = value?.trim().toLowerCase() ?? "";

  if (STEP_ORDER.includes(normalized as InspectionStepId)) {
    return normalized as InspectionStepId;
  }

  if (normalized.includes("exterior")) return "exterior";
  if (normalized.includes("interior")) return "interior";
  if (normalized.includes("mechanic")) return "mechanical";
  if (normalized.includes("tyre") || normalized.includes("tire")) return "tyres";

  return null;
}

function mapChecklistState(status?: string): InspectionChecklistItem["state"] {
  const normalized = status?.trim().toLowerCase() ?? "";

  if (
    normalized.includes("issue") ||
    normalized.includes("flag") ||
    normalized.includes("fail")
  ) {
    return "issue";
  }

  if (
    normalized.includes("ok") ||
    normalized.includes("pass") ||
    normalized.includes("checked") ||
    normalized.includes("complete")
  ) {
    return "ok";
  }

  return "pending";
}

export function mapChecklistStateToApi(
  state: InspectionChecklistItem["state"],
): string {
  switch (state) {
    case "ok":
      return "pass";
    case "issue":
      return "fail";
    default:
      return "unchecked";
  }
}

function mapChecklistItem(
  item: StaffInspectionChecklistItemRaw,
  index: number,
): InspectionChecklistItem {
  const key = item.key?.trim() || String(item.id ?? `item-${index + 1}`);

  return {
    id: key,
    label: item.label?.trim() || `Checklist item ${index + 1}`,
    state: mapChecklistState(item.status ?? item.state),
    stepId: normalizeStepId(item.step ?? item.stepKey) ?? undefined,
  };
}

function extractInspectionSteps(
  normalized: StaffInspectionDetailRaw,
): StaffInspectionStepRaw[] {
  const progress = asRecord(normalized.progress);

  return extractArray<StaffInspectionStepRaw>(
    normalized.steps ?? normalized.inspectionSteps ?? progress?.steps,
    ["steps", "inspectionSteps", "items", "records"],
  );
}

function extractChecklistItems(
  normalized: StaffInspectionDetailRaw,
): StaffInspectionChecklistItemRaw[] {
  return extractArray<StaffInspectionChecklistItemRaw>(
    normalized.checklist ?? normalized.checklistItems,
    ["items", "checklist", "checklistItems", "records"],
  );
}

function extractFlaggedIssues(
  normalized: StaffInspectionDetailRaw,
): StaffInspectionFlaggedIssueRaw[] {
  const list = extractArray<StaffInspectionFlaggedIssueRaw>(
    normalized.flaggedIssues ?? normalized.issues,
    ["items", "flaggedIssues", "issues", "records"],
  );

  if (normalized.flaggedIssue) {
    return [normalized.flaggedIssue, ...list];
  }

  return list;
}

function formatInspectionTypeLabel(value?: string): string {
  const normalized = value?.trim().toLowerCase().replace(/[\s-]+/g, "_") ?? "";

  if (normalized === "pre_service") return "Pre-Service";
  if (normalized === "storage_check_in") return "Storage Check-In";
  if (normalized === "general") return "General";

  return value?.trim() || "Inspection";
}

function deriveFlaggedIssue(
  flaggedItems: StaffInspectionFlaggedIssueRaw[],
  checklist: InspectionChecklistItem[],
  notes?: string,
): ActiveInspection["flaggedIssue"] | undefined {
  const flagged = flaggedItems[0];

  if (flagged) {
    const issueItem = checklist.find((item) => item.state === "issue");

    return {
      tag:
        flagged.tag?.trim() ||
        flagged.label?.trim() ||
        flagged.title?.trim() ||
        "Flagged issue",
      notes:
        flagged.notes?.trim() ||
        flagged.note?.trim() ||
        flagged.description?.trim() ||
        notes?.trim() ||
        "",
      itemKey: flagged.key?.trim() || issueItem?.id,
    };
  }

  const issueItem = checklist.find((item) => item.state === "issue");

  if (issueItem) {
    return {
      tag: issueItem.label,
      notes: notes?.trim() || "",
      itemKey: issueItem.id,
    };
  }

  if (notes?.trim()) {
    return {
      tag: "Flagged issue",
      notes: notes.trim(),
    };
  }

  return undefined;
}

function buildSteps(
  rawSteps: StaffInspectionStepRaw[] | undefined,
  currentStep?: string,
): { steps: InspectionStep[]; activeStepId: InspectionStepId } {
  const activeStepId = normalizeStepId(currentStep) ?? "exterior";
  const rawById = new Map<InspectionStepId, StaffInspectionStepRaw>();

  (rawSteps ?? []).forEach((step) => {
    const id = normalizeStepId(step.key ?? step.id);

    if (id) {
      rawById.set(id, step);
    }
  });

  const activeIndex = STEP_ORDER.indexOf(activeStepId);
  const steps = STEP_ORDER.map((id, index) => {
    const raw = rawById.get(id);
    const rawState = raw?.state?.trim().toLowerCase() ?? raw?.status?.trim().toLowerCase();

    let state: InspectionStep["state"] = "upcoming";

    if (rawState?.includes("complete") || rawState?.includes("done")) {
      state = "complete";
    } else if (index < activeIndex) {
      state = "complete";
    } else if (id === activeStepId) {
      state = "active";
    }

    return {
      id,
      label:
        raw?.label?.trim() ||
        STEP_LABELS[id],
      state,
    };
  });

  return { steps, activeStepId };
}

function formatMileage(value?: string | number): string {
  const text = readText(value);

  if (!text) {
    return "—";
  }

  if (text.toLowerCase().includes("km")) {
    return text;
  }

  const numeric = Number(text.replace(/,/g, ""));

  if (!Number.isNaN(numeric)) {
    return `${numeric.toLocaleString("en-GB")} km`;
  }

  return text;
}

function readInspectionStatusKey(
  data?: StaffInspectionDetailRaw | Record<string, unknown> | null,
): string {
  const record = asRecord(data);

  if (!record) {
    return "";
  }

  return (
    readText(record.statusKey) ||
    readText(record.status) ||
    readText(record.inspectionStatus) ||
    ""
  );
}

export function mapActiveInspection(
  data?: StaffInspectionDetailRaw | null | unknown,
  options?: MapActiveInspectionOptions,
): ActiveInspection | null {
  const normalized = normalizeInspectionDetailData(data ?? null);
  const fallbackId = options?.fallbackId ?? "";
  const queueItem = options?.queueItem ?? null;

  if (!normalized) {
    return buildFallbackInspectionFromQueue(queueItem, fallbackId);
  }

  const currentStep =
    normalized.currentStep ??
    normalized.activeStep ??
    normalized.currentStepKey ??
    normalized.activeStepKey;

  const { steps, activeStepId } = buildSteps(
    extractInspectionSteps(normalized),
    currentStep,
  );

  const checklist = extractChecklistItems(normalized).map(mapChecklistItem);
  const flaggedItems = extractFlaggedIssues(normalized);
  const notes =
    normalized.notes?.trim() ||
    flaggedItems[0]?.notes?.trim() ||
    flaggedItems[0]?.note?.trim() ||
    flaggedItems[0]?.description?.trim();
  const flaggedIssue = deriveFlaggedIssue(flaggedItems, checklist, notes);
  const photos = extractInspectionPhotos(normalized);
  const fuelLevel = normalized.fuelLevel?.trim() || "—";
  const normalizedFuel = fuelLevel.toLowerCase().includes("tank")
    ? fuelLevel
    : fuelLevel === "—"
      ? fuelLevel
      : `${fuelLevel} Tank`;
  const reference =
    normalized.referenceNumber?.trim() ||
    normalized.reference?.trim() ||
    queueItem?.reference ||
    "—";
  const id = resolveInspectionApiId(
    normalized.id !== undefined && normalized.id !== null
      ? String(normalized.id)
      : undefined,
    fallbackId || queueItem?.id,
  ) || undefined;
  const bayRaw = normalized.bay?.trim() || queueItem?.bay || "—";
  const bay = bayRaw.toLowerCase().startsWith("bay") ? bayRaw : `Bay ${bayRaw}`;

  if (
    !id &&
    reference === "—" &&
    checklist.length === 0 &&
    !flaggedIssue &&
    !readText(normalized.odometerReading ?? normalized.mileage)
  ) {
    return buildFallbackInspectionFromQueue(queueItem, fallbackId);
  }

  return {
    id,
    reference,
    vehicle: resolveVehicleLabel(normalized.vehicle, reference),
    bay: bay === "Bay —" ? "—" : bay,
    mileage: formatMileage(normalized.mileage ?? normalized.odometerReading),
    inspectionType: formatInspectionTypeLabel(
      normalized.inspectionType ?? normalized.type ?? queueItem?.serviceType,
    ),
    steps,
    activeStepId,
    checklist,
    flaggedIssue,
    odometer:
      readText(normalized.odometerReading ?? normalized.mileage) || "—",
    fuelLevel: normalizedFuel,
    notes: notes || flaggedIssue?.notes,
    photos,
    statusKey:
      readInspectionStatusKey(normalized) ||
      (queueItem?.status === "done" ? "completed" : undefined),
  };
}

export function resolveFlaggedItemKey(
  inspection: ActiveInspection,
): string | undefined {
  if (inspection.flaggedIssue?.itemKey?.trim()) {
    return inspection.flaggedIssue.itemKey.trim();
  }

  const issueItem = inspection.checklist.find((item) => item.state === "issue");

  return issueItem?.id;
}

export function buildInspectionDraftPayload(
  inspection: ActiveInspection,
): StaffInspectionDraftRequest {
  const payload: StaffInspectionDraftRequest = {
    currentStep: inspection.activeStepId,
    checklist: inspection.checklist.map((item) => ({
      key: item.id,
      status: mapChecklistStateToApi(item.state),
    })),
  };

  const odometerReading = normalizeOdometerForApi(inspection.odometer);
  const fuelLevel = normalizeFuelLevelForApi(inspection.fuelLevel);
  const notes = sanitizeDraftValue(inspection.notes);

  if (odometerReading) {
    payload.odometerReading = odometerReading;
  }

  if (fuelLevel) {
    payload.fuelLevel = fuelLevel;
  }

  if (notes) {
    payload.notes = notes;
  }

  return payload;
}

export function getAdjacentStepId(
  current: InspectionStepId,
  direction: "back" | "next",
): InspectionStepId | null {
  const index = STEP_ORDER.indexOf(current);

  if (index === -1) {
    return null;
  }

  const nextIndex = direction === "back" ? index - 1 : index + 1;

  if (nextIndex < 0 || nextIndex >= STEP_ORDER.length) {
    return null;
  }

  return STEP_ORDER[nextIndex];
}

export function setActiveStep(
  inspection: ActiveInspection,
  stepId: InspectionStepId,
): ActiveInspection {
  const stepIndex = STEP_ORDER.indexOf(stepId);

  return {
    ...inspection,
    activeStepId: stepId,
    steps: inspection.steps.map((step, index) => {
      if (index < stepIndex) {
        return { ...step, state: "complete" };
      }

      if (step.id === stepId) {
        return { ...step, state: "active" };
      }

      return { ...step, state: "upcoming" };
    }),
  };
}

export function cycleChecklistItemState(
  state: InspectionChecklistItem["state"],
): InspectionChecklistItem["state"] {
  if (state === "pending") return "ok";
  if (state === "ok") return "issue";
  return "pending";
}

export function extractCreatedInspectionId(data: unknown): string {
  const record = asRecord(data);

  if (!record) {
    return "";
  }

  if (record.id !== undefined && record.id !== null) {
    return String(record.id);
  }

  if (record.inspectionId !== undefined && record.inspectionId !== null) {
    return String(record.inspectionId);
  }

  for (const key of ["inspection", "record", "result", "data"]) {
    const nested = asRecord(record[key]);

    if (nested?.id !== undefined && nested.id !== null) {
      return String(nested.id);
    }
  }

  for (const value of Object.values(record)) {
    const nested = asRecord(value);

    if (nested?.id !== undefined && nested.id !== null) {
      return String(nested.id);
    }
  }

  return "";
}

export function findCreatedInspectionInQueue(
  items: InspectionQueueItem[],
  body: StaffInspectionCreateRequest,
  createdId?: string,
): string {
  if (createdId && items.some((item) => item.id === createdId)) {
    return createdId;
  }

  const normalizedBay = normalizeBayForApi(body.bay).toLowerCase();

  const bayMatch = items.find((item) =>
    item.bay.toLowerCase().includes(normalizedBay),
  );

  if (bayMatch) {
    return bayMatch.id;
  }

  return items[0]?.id ?? createdId ?? "";
}
