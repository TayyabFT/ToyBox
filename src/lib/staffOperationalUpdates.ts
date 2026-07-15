import type {
  FeedStatus,
  FeedTag,
  ManagementBroadcast,
  OpUpdateFilter,
  OpUpdateHeader,
  OpUpdateTab,
  PinnedNotice,
  PostCategory,
  ShiftFeedItem,
  ShiftLogEntry,
} from "@/components/staff/op-updates/types";
import type {
  OperationalUpdateType,
  StaffOperationalUpdateBroadcastRaw,
  StaffOperationalUpdateCreateRequest,
  StaffOperationalUpdatePinnedNoticeRaw,
  StaffOperationalUpdateRaw,
  StaffOperationalUpdateShiftLogRaw,
  StaffOperationalUpdateTabRaw,
  StaffOperationalUpdateTagRaw,
  StaffOperationalUpdatesHeaderRaw,
  StaffOperationalUpdatesShiftLogData,
  StaffOperationalUpdatesSummaryData,
} from "@/types/api";

const DEFAULT_TABS: OpUpdateTab[] = [
  { id: "all", label: "All Updates" },
  { id: "announcements", label: "Announcements" },
  { id: "my-posts", label: "My Posts" },
  { id: "flagged", label: "Flagged" },
];

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function extractArray<T>(
  value: unknown,
  keys: string[] = ["items", "feed", "updates", "records", "data", "notices", "pinned", "entries", "log"],
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

function readText(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" && !Number.isNaN(value)) {
    return String(value);
  }

  return "";
}

function normalizeSummaryData(data: unknown): StaffOperationalUpdatesSummaryData | null {
  const record = asRecord(data);

  if (!record) {
    return null;
  }

  const screen = asRecord(record.screen);
  const merged: StaffOperationalUpdatesSummaryData = {
    ...record,
    ...(screen ?? {}),
  };

  if (screen?.header) {
    merged.header = screen.header as StaffOperationalUpdatesHeaderRaw;
  }

  return merged;
}

export function mapOpUpdateFilterToQuery(
  filter: OpUpdateFilter,
): string | undefined {
  if (filter === "all") {
    return undefined;
  }

  return filter;
}

export const OPERATIONAL_UPDATE_LINKED_REFERENCE_MAX = 40;

const ALLOWED_UPDATE_TYPES: OperationalUpdateType[] = [
  "general",
  "shift_note",
  "flagged_issue",
  "service_reminder",
  "inspection",
  "transport",
  "detailing",
  "workshop",
];

export function resolveOperationalUpdateType(
  category: PostCategory,
  isFlagged: boolean,
): OperationalUpdateType {
  if (isFlagged) {
    return "flagged_issue";
  }

  if (category === "vehicle") {
    return "inspection";
  }

  if (category === "member") {
    return "general";
  }

  return "shift_note";
}

export function normalizeLinkedJobReference(
  value?: string,
): string | undefined {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  return trimmed.slice(0, OPERATIONAL_UPDATE_LINKED_REFERENCE_MAX);
}

export function validateOperationalUpdateForm(options: {
  body: string;
  category: PostCategory;
  isFlagged: boolean;
  vehicleId?: string;
  memberId?: string;
  linkedJobReference?: string;
}): string | null {
  const body = options.body.trim();

  if (!body) {
    return "Update text is required.";
  }

  if (options.category === "vehicle" && !options.vehicleId?.trim()) {
    return "Please select a vehicle for this update.";
  }

  if (options.category === "member" && !options.memberId?.trim()) {
    return "Please select a member for this update.";
  }

  const linkedJobReference = options.linkedJobReference?.trim();

  if (
    linkedJobReference &&
    linkedJobReference.length > OPERATIONAL_UPDATE_LINKED_REFERENCE_MAX
  ) {
    return `Linked job reference must be ${OPERATIONAL_UPDATE_LINKED_REFERENCE_MAX} characters or less.`;
  }

  return null;
}

export function mapPostCategoryToUpdateType(
  category: PostCategory,
  isFlagged = false,
): OperationalUpdateType {
  return resolveOperationalUpdateType(category, isFlagged);
}

export function buildOperationalUpdatePayload(options: {
  body: string;
  category: PostCategory;
  isFlagged: boolean;
  vehicleId?: string;
  memberId?: string;
  linkedJobReference?: string;
  title?: string;
}): StaffOperationalUpdateCreateRequest {
  const updateType = resolveOperationalUpdateType(
    options.category,
    options.isFlagged,
  );

  if (!ALLOWED_UPDATE_TYPES.includes(updateType)) {
    throw new Error("Invalid operational update type.");
  }

  const payload: StaffOperationalUpdateCreateRequest = {
    body: options.body.trim(),
    updateType,
    flagIssue: options.isFlagged || undefined,
  };

  const title = options.title?.trim();

  if (title) {
    payload.title = title.slice(0, 120);
  }

  const linkedJobReference = normalizeLinkedJobReference(
    options.linkedJobReference,
  );

  if (linkedJobReference) {
    payload.linkedJobReference = linkedJobReference;
  }

  if (options.vehicleId?.trim()) {
    payload.vehicleId = options.vehicleId.trim();
  }

  if (options.memberId?.trim()) {
    payload.memberId = options.memberId.trim();
  }

  return payload;
}

const GUID_PATTERN =
  /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;

const GUID_ONLY_PATTERN =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

/**
 * Feed items can arrive with prefixed identifiers (e.g. `bulletin-<guid>`),
 * but the operational-updates pin/detail endpoints only accept a bare GUID.
 * Pull the GUID out when present, otherwise fall back to the raw value.
 */
export function extractOperationalUpdateId(id: string | number): string {
  const text = String(id).trim();
  const match = text.match(GUID_PATTERN);

  return match ? match[0] : text;
}

/**
 * Only bare-GUID records are real operational updates that the pin endpoint
 * can act on. Prefixed identifiers (e.g. `bulletin-<guid>` broadcasts) belong
 * to other systems and must not offer a pin/unpin action here.
 */
export function isPinnableOperationalUpdateId(id: string | number): boolean {
  return GUID_ONLY_PATTERN.test(String(id).trim());
}

export function extractCreatedOperationalUpdateId(data: unknown): string {
  const record = asRecord(data);

  if (!record) {
    return "";
  }

  if (record.id !== undefined && record.id !== null) {
    return String(record.id);
  }

  if (record.updateId !== undefined && record.updateId !== null) {
    return String(record.updateId);
  }

  for (const key of ["update", "record", "result", "data"]) {
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

function formatFeedTime(value?: string): string {
  const text = readText(value);

  if (!text) {
    return "—";
  }

  const date = new Date(text);

  if (!Number.isNaN(date.getTime()) && text.includes("T")) {
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  return text;
}

function resolveAuthorName(raw: StaffOperationalUpdateRaw): string {
  return (
    readText(raw.authorName) ||
    readText(raw.author) ||
    readText(raw.staffName) ||
    "Staff"
  );
}

function resolveAuthorInitial(raw: StaffOperationalUpdateRaw, author: string): string {
  const explicit = readText(raw.authorInitial);

  if (explicit) {
    return explicit.slice(0, 1).toUpperCase();
  }

  return author.slice(0, 1).toUpperCase() || "S";
}

function resolveFeedBody(raw: StaffOperationalUpdateRaw): string {
  return (
    readText(raw.body) ||
    readText(raw.message) ||
    readText(raw.content) ||
    readText(raw.title) ||
    "—"
  );
}

function normalizeFeedStatus(raw: StaffOperationalUpdateRaw): FeedStatus {
  const status = (
    readText(raw.statusKey) ||
    readText(raw.status) ||
    readText(raw.updateType) ||
    readText(raw.type)
  ).toLowerCase();

  if (raw.flagIssue || raw.isFlagged || status.includes("issue") || status.includes("flag")) {
    return "issue";
  }

  if (status.includes("announce") || status.includes("management") || raw.isAnnouncement) {
    return "management";
  }

  if (status.includes("complete") || status.includes("done")) {
    return "completed";
  }

  if (status.includes("transit") || status.includes("transport")) {
    return "in-transit";
  }

  if (status.includes("progress") || status.includes("workshop")) {
    return "in-progress";
  }

  if (status.includes("inspect")) {
    return "inspection";
  }

  return raw.flagIssue || raw.isFlagged ? "issue" : "inspection";
}

function mapFeedIcon(
  raw: StaffOperationalUpdateRaw,
  status: FeedStatus,
): ShiftFeedItem["icon"] {
  const icon = readText(raw.iconKey || raw.icon).toLowerCase();

  if (icon.includes("flag")) return "flag";
  if (icon.includes("check")) return "check";
  if (icon.includes("truck") || icon.includes("transit")) return "truck";
  if (icon.includes("wrench") || icon.includes("workshop")) return "wrench";
  if (icon.includes("megaphone") || icon.includes("announce")) return "megaphone";

  if (status === "issue") return "flag";
  if (status === "completed") return "check";
  if (status === "in-transit") return "truck";
  if (status === "in-progress") return "wrench";
  if (status === "management") return "megaphone";

  return "inspect";
}

function mapTagTone(tone?: string): FeedTag["tone"] {
  const normalized = tone?.trim().toLowerCase() ?? "";

  if (normalized.includes("pink") || normalized.includes("issue") || normalized.includes("flag")) {
    return "pink";
  }

  if (normalized.includes("gold") || normalized.includes("primary") || normalized.includes("vip")) {
    return "gold";
  }

  if (normalized.includes("teal") || normalized.includes("ready") || normalized.includes("complete")) {
    return "teal";
  }

  return "default";
}

function mapFeedTags(raw: StaffOperationalUpdateRaw): FeedTag[] {
  const tags = extractArray<StaffOperationalUpdateTagRaw>(raw.tags ?? raw.labels, [
    "tags",
    "labels",
    "items",
  ]);

  const mapped: FeedTag[] = [];

  for (const tag of tags) {
    const label = readText(tag.label);

    if (!label) {
      continue;
    }

    mapped.push({
      label: label.toUpperCase(),
      tone: mapTagTone(tag.tone),
    });
  }

  if (mapped.length > 0) {
    return mapped;
  }

  const fallback: FeedTag[] = [];

  if (typeof raw.vehicle === "string") {
    const label = raw.vehicle.trim();

    if (label) {
      fallback.push({ label: label.toUpperCase() });
    }
  } else if (raw.vehicle && typeof raw.vehicle === "object") {
    const label =
      readText(raw.vehicle.displayName) ||
      readText(raw.vehicle.name) ||
      [readText(raw.vehicle.make), readText(raw.vehicle.model)].filter(Boolean).join(" ");

    if (label) {
      fallback.push({ label: label.toUpperCase() });
    }
  }

  if (raw.linkedJobReference?.trim()) {
    fallback.push({ label: raw.linkedJobReference.trim().toUpperCase(), tone: "gold" });
  }

  if (raw.flagIssue || raw.isFlagged) {
    fallback.push({ label: "ISSUE FLAG", tone: "pink" });
  }

  if (raw.isPinned) {
    fallback.push({ label: "PINNED", tone: "gold" });
  }

  return fallback;
}

function deriveFilterTags(raw: StaffOperationalUpdateRaw): OpUpdateFilter[] {
  const explicit = extractArray<string>(raw.filterTags, ["filterTags", "filters"]);

  const tags = new Set<OpUpdateFilter>(["all"]);

  explicit.forEach((tag) => {
    const normalized = tag.trim().toLowerCase() as OpUpdateFilter;

    if (["all", "announcements", "my-posts", "flagged"].includes(normalized)) {
      tags.add(normalized);
    }
  });

  if (raw.isAnnouncement) {
    tags.add("announcements");
  }

  if (raw.isOwnPost || raw.isMine) {
    tags.add("my-posts");
  }

  if (raw.flagIssue || raw.isFlagged) {
    tags.add("flagged");
  }

  const updateType = readText(raw.updateType || raw.type).toLowerCase();

  if (updateType.includes("announce")) {
    tags.add("announcements");
  }

  return [...tags];
}

function mapStatusLabel(status: FeedStatus, raw: StaffOperationalUpdateRaw): string {
  const explicit = readText(raw.statusLabel);

  if (explicit) {
    return explicit.toUpperCase();
  }

  return {
    issue: "ISSUE",
    completed: "COMPLETED",
    "in-transit": "IN TRANSIT",
    "in-progress": "IN PROGRESS",
    management: "MANAGEMENT",
    inspection: "UPDATE",
  }[status];
}

export function mapShiftFeedItem(raw: StaffOperationalUpdateRaw): ShiftFeedItem | null {
  const id =
    raw.id !== undefined && raw.id !== null
      ? String(raw.id)
      : raw.updateId !== undefined && raw.updateId !== null
        ? String(raw.updateId)
        : "";

  if (!id) {
    return null;
  }

  const author = resolveAuthorName(raw);
  const status = normalizeFeedStatus(raw);

  return {
    id,
    author,
    authorInitial: resolveAuthorInitial(raw, author),
    status,
    statusLabel: mapStatusLabel(status, raw),
    time: formatFeedTime(raw.time || raw.timeLabel || raw.createdAt || raw.postedAt),
    body: resolveFeedBody(raw),
    tags: mapFeedTags(raw),
    icon: mapFeedIcon(raw, status),
    filterTags: deriveFilterTags(raw),
    isFlagged: Boolean(raw.flagIssue || raw.isFlagged),
    isAnnouncement: Boolean(raw.isAnnouncement),
    isOwnPost: Boolean(raw.isOwnPost || raw.isMine),
    isPinned: Boolean(raw.isPinned),
    canPin: raw.canPin !== false && isPinnableOperationalUpdateId(id),
  };
}

export function mapShiftFeedItems(data: unknown): ShiftFeedItem[] {
  const normalized = normalizeSummaryData(data);
  const source =
    normalized?.feed ??
    normalized?.updates ??
    normalized?.items ??
    data;

  return extractArray<StaffOperationalUpdateRaw>(source, [
    "feed",
    "updates",
    "items",
    "records",
    "data",
  ])
    .map((item) => mapShiftFeedItem(item))
    .filter((item): item is ShiftFeedItem => Boolean(item));
}

export function mapOpUpdatesHeader(
  header?: StaffOperationalUpdatesHeaderRaw | null,
): OpUpdateHeader {
  return {
    dateLabel: readText(header?.dateLabel) || readText(header?.date) || "—",
    shiftLabel: readText(header?.shiftLabel) || readText(header?.shift) || "Staff Shift",
  };
}

export function mapOpUpdateTabs(
  tabs?: StaffOperationalUpdateTabRaw[] | unknown,
): OpUpdateTab[] {
  const list = extractArray<StaffOperationalUpdateTabRaw>(tabs, ["tabs", "filterTabs", "items"]);

  const mapped = list
    .map((tab) => {
      const id = readText(tab.id || tab.key).toLowerCase() as OpUpdateFilter;

      if (!["all", "announcements", "my-posts", "flagged"].includes(id)) {
        return null;
      }

      return {
        id,
        label: readText(tab.label) || id,
      };
    })
    .filter((tab): tab is OpUpdateTab => Boolean(tab));

  return mapped.length > 0 ? mapped : DEFAULT_TABS;
}

export function mapManagementBroadcast(
  broadcast?: StaffOperationalUpdateBroadcastRaw | null,
): ManagementBroadcast | null {
  if (!broadcast) {
    return null;
  }

  const body = readText(broadcast.body) || readText(broadcast.message);
  const author = readText(broadcast.authorName) || readText(broadcast.author);

  if (!body && !author) {
    return null;
  }

  return {
    author: author || "Management",
    role: readText(broadcast.role) || readText(broadcast.authorRole) || "Ops",
    body: body || "—",
    timeLabel:
      readText(broadcast.timeLabel) ||
      formatFeedTime(broadcast.postedAt) ||
      (broadcast.isPinned ? "PINNED" : "—"),
  };
}

export function extractSummaryShell(data: unknown): {
  header: OpUpdateHeader;
  tabs: OpUpdateTab[];
  broadcast: ManagementBroadcast | null;
} {
  const normalized = normalizeSummaryData(data);

  return {
    header: mapOpUpdatesHeader(normalized?.header),
    tabs: mapOpUpdateTabs(normalized?.tabs ?? normalized?.filterTabs),
    broadcast: mapManagementBroadcast(
      normalized?.managementBroadcast ?? normalized?.broadcast,
    ),
  };
}

function mapPinnedTone(value?: string): PinnedNotice["tone"] {
  const normalized = value?.trim().toLowerCase() ?? "";

  if (normalized.includes("purple") || normalized.includes("vip")) {
    return "purple";
  }

  if (normalized.includes("teal") || normalized.includes("shift")) {
    return "teal";
  }

  return "gold";
}

export function mapPinnedNotices(data: unknown): PinnedNotice[] {
  const record = asRecord(data);
  const source = record?.notices ?? record?.pinned ?? record?.items ?? data;
  const notices: PinnedNotice[] = [];

  for (const [index, notice] of extractArray<StaffOperationalUpdatePinnedNoticeRaw>(
    source,
    ["notices", "pinned", "items", "records", "data"],
  ).entries()) {
    const id =
      notice.id !== undefined && notice.id !== null
        ? String(notice.id)
        : `notice-${index + 1}`;
    const title = readText(notice.title);
    const body = readText(notice.body) || readText(notice.message);

    if (!title && !body) {
      continue;
    }

    notices.push({
      id,
      title: title || "NOTICE",
      body: body || "—",
      tone: mapPinnedTone(notice.tone || notice.color),
      isPinned: notice.isPinned !== false,
    });
  }

  return notices;
}

function mapShiftLogTone(value?: string): ShiftLogEntry["tone"] {
  const normalized = value?.trim().toLowerCase() ?? "";

  if (normalized.includes("pink") || normalized.includes("issue") || normalized.includes("flag")) {
    return "pink";
  }

  if (normalized.includes("teal") || normalized.includes("complete")) {
    return "teal";
  }

  if (normalized.includes("gold") || normalized.includes("transport")) {
    return "gold";
  }

  return "default";
}

function normalizeShiftLogData(data: unknown): StaffOperationalUpdatesShiftLogData | null {
  const record = asRecord(data);

  if (!record) {
    return null;
  }

  return record as StaffOperationalUpdatesShiftLogData;
}

export function mapShiftLogEntries(data: unknown): {
  staffName: string;
  entries: ShiftLogEntry[];
  footerNote: string;
} {
  const normalized = normalizeShiftLogData(data);
  const source =
    normalized?.entries ?? normalized?.items ?? normalized?.log ?? data;

  const entries: ShiftLogEntry[] = [];

  for (const [index, entry] of extractArray<StaffOperationalUpdateShiftLogRaw>(
    source,
    ["entries", "items", "log", "records", "data"],
  ).entries()) {
    const id =
      entry.id !== undefined && entry.id !== null
        ? String(entry.id)
        : `log-${index + 1}`;
    const title = readText(entry.title) || readText(entry.label);
    const highlight = readText(entry.highlight) || readText(entry.body);

    if (!title && !highlight) {
      continue;
    }

    entries.push({
      id,
      time: formatFeedTime(entry.time),
      title: title || "Update —",
      highlight: highlight || undefined,
      tone: mapShiftLogTone(entry.tone),
    });
  }

  return {
    staffName:
      readText(normalized?.staffName) ||
      readText(normalized?.name) ||
      "Staff",
    entries,
    footerNote:
      readText(normalized?.footerNote) ||
      readText(normalized?.footer) ||
      readText(normalized?.priorityNote) ||
      "",
  };
}

export function mapOperationalUpdateDetail(data: unknown): ShiftFeedItem | null {
  const record = asRecord(data);

  if (!record) {
    return null;
  }

  return mapShiftFeedItem(record as StaffOperationalUpdateRaw);
}

export function getProfileInitial(name?: string, email?: string): string {
  const fromName = name?.trim().charAt(0);

  if (fromName) {
    return fromName.toUpperCase();
  }

  const fromEmail = email?.trim().charAt(0);

  if (fromEmail) {
    return fromEmail.toUpperCase();
  }

  return "S";
}

export function getProfileDisplayName(name?: string, email?: string): string {
  return name?.trim() || email?.trim() || "Staff";
}
