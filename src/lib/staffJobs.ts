import type { JobStatusTone } from "@/components/shared/service-requests/types";
import type {
  StaffActiveJobRaw,
  StaffJobNoteRaw,
  StaffJobQueueStatus,
  StaffJobSubtaskRaw,
  StaffJobTimelineItemRaw,
} from "@/types/api";

export type StaffJobNote = {
  id: string;
  text: string;
  createdAt: string;
  author?: string;
};

export type StaffJobPhoto = {
  id: string;
  url: string;
  caption?: string;
  createdAt?: string;
};

export type StaffActiveJobView = {
  queueJobId: string;
  referenceId: string;
  jobId: string;
  referenceType: string;
  categoryLabel: string;
  statusLabel: string;
  statusTone: JobStatusTone;
  queueStatus: StaffJobQueueStatus;
  vehicle: string;
  subtitle: string;
  assignee: string;
  hasAssignee: boolean;
  pickup: { label: string; detail: string } | null;
  dropoff: { label: string; detail: string } | null;
  timeline: Array<{
    key: string;
    label: string;
    status: string;
    completedAt?: string;
  }>;
  steps: Array<{
    id: string;
    key: string;
    label: string;
    completed: boolean;
    time?: string;
  }>;
  specialInstructions: string | null;
  progressPercent: number;
  progressNote?: string;
  elapsedMinutes?: number;
  remainingMinutes?: number;
  notes: StaffJobNote[];
  photos: StaffJobPhoto[];
  estimatedMinutes: number;
  slotDurationHours: 4 | 6;
  scheduledStart?: string;
  scheduledEnd?: string;
  canSchedule: boolean;
  canStart: boolean;
  canComplete: boolean;
  canAddNote: boolean;
  canAddPhoto: boolean;
  canToggleSubtasks: boolean;
};

export type ScheduleSlot = {
  startTime: string;
  endTime: string;
  label: string;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export function unwrapActiveJobPayload(data: unknown): StaffActiveJobRaw | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;

  if (record.job && typeof record.job === "object") {
    return record.job as StaffActiveJobRaw;
  }

  if (record.id || record.referenceId || record.referenceNumber) {
    return record as StaffActiveJobRaw;
  }

  return null;
}

export function unwrapCompletePayload(data: unknown): StaffActiveJobRaw | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;
  const nextJob = record.nextJob;

  if (nextJob && typeof nextJob === "object") {
    return nextJob as StaffActiveJobRaw;
  }

  return null;
}

export function unwrapCompletedJobPayload(data: unknown): StaffActiveJobRaw | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;
  const completed = record.completed;

  if (completed && typeof completed === "object") {
    return completed as StaffActiveJobRaw;
  }

  return null;
}

function normalizeQueueStatus(job: StaffActiveJobRaw): StaffJobQueueStatus {
  const status = job.status?.trim().toLowerCase().replace(/-/g, "_") ?? "";
  const badge = job.statusBadge?.label?.trim().toLowerCase() ?? "";

  if (status.includes("progress") || badge.includes("progress")) {
    return "in_progress";
  }

  if (status === "scheduled" || badge.includes("schedule")) {
    return "scheduled";
  }

  if (status.includes("assign") || badge.includes("assign")) {
    return "assigned";
  }

  if (status.includes("complete") || badge.includes("complete")) {
    return "completed";
  }

  if (status.includes("pending") || badge.includes("pending")) {
    return "pending";
  }

  return "assigned";
}

function mapApiTone(tone?: string): JobStatusTone | null {
  const normalized = tone?.trim().toLowerCase() ?? "";

  if (normalized.includes("success")) return "active";
  if (normalized.includes("info")) return "assigned";

  if (normalized.includes("progress")) return "in-progress";
  if (normalized.includes("urgent") || normalized.includes("danger")) {
    return "urgent";
  }

  if (normalized.includes("pending") || normalized.includes("neutral")) {
    return "pending";
  }

  if (normalized.includes("assign") || normalized.includes("active")) {
    return "assigned";
  }

  return null;
}

function mapStatusTone(status: StaffJobQueueStatus, apiTone?: string): JobStatusTone {
  return mapApiTone(apiTone) ?? mapQueueStatusTone(status);
}

function mapQueueStatusTone(status: StaffJobQueueStatus): JobStatusTone {
  switch (status) {
    case "in_progress":
      return "in-progress";
    case "scheduled":
      return "assigned";
    case "completed":
      return "active";
    case "pending":
      return "pending";
    default:
      return "active";
  }
}

function formatStatusLabel(status: StaffJobQueueStatus): string {
  switch (status) {
    case "in_progress":
      return "In Progress";
    case "scheduled":
      return "Scheduled";
    case "assigned":
      return "Assigned";
    case "completed":
      return "Completed";
    default:
      return "Pending";
  }
}

function resolveSlotDurationHours(job: StaffActiveJobRaw): 4 | 6 {
  if (job.slotDurationHours === 4 || job.slotDurationHours === 6) {
    return job.slotDurationHours;
  }

  const category = `${job.referenceType ?? ""} ${job.category ?? ""} ${job.requestType ?? ""}`
    .trim()
    .toLowerCase();

  if (category.includes("transport") || category.includes("delivery")) {
    return 4;
  }

  return 6;
}

function resolveEstimatedMinutes(job: StaffActiveJobRaw): number {
  if (
    typeof job.progress?.estimatedMinutes === "number" &&
    !Number.isNaN(job.progress.estimatedMinutes) &&
    job.progress.estimatedMinutes >= 1
  ) {
    return job.progress.estimatedMinutes;
  }

  if (
    typeof job.estimatedMinutes === "number" &&
    !Number.isNaN(job.estimatedMinutes) &&
    job.estimatedMinutes >= 1
  ) {
    return job.estimatedMinutes;
  }

  const scheduleStart =
    job.schedule?.startTime?.trim() ||
    job.scheduledStart?.trim() ||
    job.startTime?.trim();
  const scheduleEnd =
    job.schedule?.endTime?.trim() ||
    job.scheduledEnd?.trim() ||
    job.endTime?.trim();

  if (scheduleStart && scheduleEnd) {
    const start = new Date(scheduleStart);
    const end = new Date(scheduleEnd);
    const diffMinutes = (end.getTime() - start.getTime()) / 60_000;

    if (!Number.isNaN(diffMinutes) && diffMinutes >= 1) {
      return Math.round(diffMinutes);
    }
  }

  return resolveSlotDurationHours(job) * 60;
}

function buildCategoryLabel(job: StaffActiveJobRaw, queueStatus: StaffJobQueueStatus): string {
  const type =
    job.referenceType?.trim() ||
    job.requestTypeLabel?.trim() ||
    job.requestType?.trim() ||
    job.category?.trim() ||
    "Service Job";

  return `${type} · ${formatStatusLabel(queueStatus)}`;
}

function buildSubtitle(job: StaffActiveJobRaw): string {
  if (job.subtitle?.trim()) {
    return job.subtitle.trim();
  }

  if (job.detail?.subtitle?.trim()) {
    return job.detail.subtitle.trim();
  }

  const parts = [
    job.serviceType?.trim() || job.detail?.serviceType?.trim(),
    job.memberName?.trim() || job.member?.trim() || job.detail?.member?.trim(),
    job.workshop?.trim() || job.centre?.trim() || job.detail?.workshop?.trim(),
  ].filter(Boolean);

  return parts.join(" · ") || "—";
}

function resolveLocation(
  primary: StaffActiveJobRaw["pickup"],
  fallbackLabel: string,
  fallback?: StaffActiveJobRaw["from"],
  detailFallback?: StaffActiveJobRaw["detail"],
  detailKey?: "pickup" | "dropoff",
): { label: string; detail: string } | null {
  const detailLocation =
    detailKey && detailFallback?.[detailKey]
      ? detailFallback[detailKey]
      : undefined;

  const source =
    primary ??
    detailLocation ??
    (typeof fallback === "object" ? fallback : undefined);

  const detailText =
    source?.detail?.trim() ||
    source?.address?.trim() ||
    (typeof fallback === "string" ? fallback.trim() : "") ||
    (detailKey === "pickup" ? detailFallback?.from?.trim() : detailFallback?.to?.trim());

  if (!detailText) {
    return null;
  }

  return {
    label: source?.label?.trim() || fallbackLabel,
    detail: detailText,
  };
}

function mapSubtask(
  subtask: StaffJobSubtaskRaw,
  index: number,
): StaffActiveJobView["steps"][number] {
  const key = subtask.key?.trim() || `step-${index + 1}`;

  return {
    id: key,
    key,
    label: subtask.label?.trim() || `Step ${index + 1}`,
    completed: Boolean(subtask.done ?? subtask.completed),
    time: subtask.completedAt?.trim() || undefined,
  };
}

export type StaffJobListItem = {
  id: string;
  referenceId: string;
  referenceNumber: string;
  referenceType: string;
  statusLabel: string;
  statusTone: JobStatusTone;
  metaLine?: string;
  progressPercent?: number;
};

function formatJobTimestamp(iso?: string | null): string | undefined {
  if (!iso?.trim()) {
    return undefined;
  }

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function mapStaffJobListItem(job: StaffActiveJobRaw): StaffJobListItem | null {
  if (!job.id?.trim()) {
    return null;
  }

  const queueStatus = normalizeQueueStatus(job);
  const scheduledLabel = formatScheduleRange(
    job.schedule?.startTime?.trim() ||
      job.scheduledStart?.trim() ||
      job.startTime?.trim(),
    job.schedule?.endTime?.trim() ||
      job.scheduledEnd?.trim() ||
      job.endTime?.trim(),
  );

  let metaLine: string | undefined;

  if (queueStatus === "completed") {
    metaLine = formatJobTimestamp(job.completedAt)
      ? `Completed ${formatJobTimestamp(job.completedAt)}`
      : "Completed";
  } else if (scheduledLabel) {
    metaLine = `Scheduled · ${scheduledLabel}`;
  } else if (queueStatus === "in_progress") {
    metaLine = "In progress";
  } else if (queueStatus === "scheduled") {
    metaLine = "Ready to start";
  } else {
    metaLine = "Awaiting schedule";
  }

  const progressPercent =
    typeof job.progress?.percent === "number" ? job.progress.percent : undefined;

  return {
    id: job.id.trim(),
    referenceId: job.referenceId?.trim() || job.id.trim(),
    referenceNumber: job.referenceNumber?.trim() || job.referenceId?.trim() || job.id.trim(),
    referenceType: job.referenceType?.trim() || "Service",
    statusLabel:
      job.statusBadge?.label?.trim() || formatStatusLabel(queueStatus),
    statusTone: mapStatusTone(queueStatus, job.statusBadge?.tone),
    metaLine,
    progressPercent,
  };
}

export function mapStaffJobListItems(jobs?: StaffActiveJobRaw[]): StaffJobListItem[] {
  return (jobs ?? [])
    .map((job) => mapStaffJobListItem(job))
    .filter((job): job is StaffJobListItem => Boolean(job));
}

export function buildSubtaskKey(label: string, index: number): string {
  const slug = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return slug || `subtask_${index + 1}`;
}

export function normalizeStartSubtasks(
  items: Array<{ label: string }>,
): Array<{ key: string; label: string }> {
  const usedKeys = new Set<string>();

  return items
    .map((item) => item.label.trim())
    .filter(Boolean)
    .map((label, index) => {
      let key = buildSubtaskKey(label, index);

      if (usedKeys.has(key)) {
        key = `${key}_${index + 1}`;
      }

      usedKeys.add(key);

      return { key, label };
    });
}

function resolveAuthor(note: StaffJobNoteRaw): string | undefined {
  if (typeof note.author === "object" && note.author?.name?.trim()) {
    return note.author.name.trim();
  }

  if (typeof note.author === "string" && note.author.trim()) {
    return note.author.trim();
  }

  return note.authorName?.trim() || undefined;
}

export function mapStaffJobNotes(data: unknown): StaffJobNote[] {
  const record = asRecord(data);
  const items = Array.isArray(data)
    ? (data as StaffJobNoteRaw[])
    : Array.isArray(record?.notes)
      ? (record?.notes as StaffJobNoteRaw[])
      : Array.isArray(record?.items)
        ? (record?.items as StaffJobNoteRaw[])
        : [];

  return items.map((note, index) => ({
    id: String(note.id ?? `note-${index + 1}`),
    text:
      note.note?.trim() ||
      note.body?.trim() ||
      note.text?.trim() ||
      "Note",
    createdAt: note.createdAt?.trim() || "",
    author: resolveAuthor(note),
  }));
}

export function mapStaffJobPhotos(data: unknown): StaffJobPhoto[] {
  const record = asRecord(data);
  const items = Array.isArray(data)
    ? (data as StaffJobNoteRaw[])
    : Array.isArray(record?.notes)
      ? (record?.notes as StaffJobNoteRaw[])
      : [];

  const photos: StaffJobPhoto[] = [];

  items.forEach((note, noteIndex) => {
    (note.imageUrls ?? []).forEach((url, imageIndex) => {
      const trimmed = url?.trim();

      if (!trimmed) {
        return;
      }

      photos.push({
        id: `${note.id ?? noteIndex}-photo-${imageIndex + 1}`,
        url: trimmed,
        caption:
          note.note?.trim() ||
          note.body?.trim() ||
          note.text?.trim() ||
          undefined,
        createdAt: note.createdAt?.trim() || undefined,
      });
    });
  });

  return photos;
}

function mapTimeline(
  items?: StaffJobTimelineItemRaw[],
): StaffActiveJobView["timeline"] {
  return (items ?? []).map((item, index) => ({
    key: item.key?.trim() || `timeline-${index + 1}`,
    label: item.label?.trim() || `Step ${index + 1}`,
    status: item.status?.trim() || "pending",
    completedAt: item.completedAt?.trim() || undefined,
  }));
}

export function mapStaffActiveJob(job: StaffActiveJobRaw | null): StaffActiveJobView | null {
  if (!job?.id?.trim()) {
    return null;
  }

  const queueStatus = normalizeQueueStatus(job);
  const referenceId =
    job.referenceId?.trim() ||
    job.referenceNumber?.trim() ||
    job.id.trim();
  const inProgress = queueStatus === "in_progress";
  const subtasks =
    inProgress && job.subtasks && job.subtasks.length > 0
      ? job.subtasks.map(mapSubtask)
      : [];

  const specialInstructions =
    job.specialInstructions?.trim() ||
    job.detail?.specialInstructions?.trim() ||
    job.notesText?.trim() ||
    null;

  const progress = job.progress;

  return {
    queueJobId: job.id.trim(),
    referenceId,
    jobId: job.referenceNumber?.trim() || referenceId,
    referenceType: job.referenceType?.trim() || "Service",
    categoryLabel: buildCategoryLabel(job, queueStatus),
    statusLabel:
      job.statusBadge?.label?.trim() || formatStatusLabel(queueStatus),
    statusTone: mapStatusTone(queueStatus, job.statusBadge?.tone),
    queueStatus,
    vehicle:
      job.vehicle?.trim() ||
      job.detail?.vehicle?.trim() ||
      job.title?.trim() ||
      job.referenceType?.trim() ||
      "Service request",
    subtitle: buildSubtitle(job),
    assignee:
      job.assigneeName?.trim() ||
      job.assignee?.trim() ||
      job.assignedStaff?.name?.trim() ||
      "Assigned to you",
    hasAssignee: Boolean(
      job.assigneeName?.trim() ||
        job.assignee?.trim() ||
        job.assignedStaff?.name?.trim(),
    ),
    pickup: resolveLocation(job.pickup, "Pickup", job.from, job.detail, "pickup"),
    dropoff: resolveLocation(job.dropoff, "Dropoff", job.to, job.detail, "dropoff"),
    timeline: mapTimeline(job.timeline),
    steps: subtasks,
    specialInstructions,
    progressPercent: Math.min(
      100,
      Math.max(0, Number(progress?.percent ?? 0) || 0),
    ),
    progressNote:
      progress?.note?.trim() ||
      progress?.label?.trim() ||
      (typeof progress?.remainingMinutes === "number"
        ? `${progress.remainingMinutes} min remaining`
        : undefined),
    elapsedMinutes: progress?.elapsedMinutes,
    remainingMinutes: progress?.remainingMinutes,
    notes: mapStaffJobNotes(job.notes),
    photos: mapStaffJobPhotos(job.notes),
    estimatedMinutes: resolveEstimatedMinutes(job),
    slotDurationHours: resolveSlotDurationHours(job),
    scheduledStart:
      job.schedule?.startTime?.trim() ||
      job.scheduledStart?.trim() ||
      job.startTime?.trim(),
    scheduledEnd:
      job.schedule?.endTime?.trim() ||
      job.scheduledEnd?.trim() ||
      job.endTime?.trim(),
    canSchedule: queueStatus === "assigned" || queueStatus === "pending",
    canStart: queueStatus === "scheduled",
    canComplete: inProgress,
    canAddNote: inProgress,
    canAddPhoto: inProgress,
    canToggleSubtasks: inProgress,
  };
}

function roundUpToNextHour(date: Date): Date {
  const next = new Date(date);
  next.setMinutes(0, 0, 0);
  next.setHours(next.getHours() + 1);
  return next;
}

function toIsoLocal(date: Date): string {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function formatSlotLabel(start: Date, end: Date): string {
  const day = start.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const startTime = start.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = end.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${day} · ${startTime} – ${endTime}`;
}

export function buildScheduleSlots(durationHours: 4 | 6, count = 6): ScheduleSlot[] {
  const slots: ScheduleSlot[] = [];
  let cursor = roundUpToNextHour(new Date());

  while (slots.length < count) {
    const end = new Date(cursor.getTime() + durationHours * 60 * 60 * 1000);

    slots.push({
      startTime: cursor.toISOString(),
      endTime: end.toISOString(),
      label: formatSlotLabel(cursor, end),
    });

    cursor = new Date(end);
  }

  return slots;
}

export function formatScheduleRange(
  startTime?: string,
  endTime?: string,
): string | null {
  if (!startTime || !endTime) {
    return null;
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  return formatSlotLabel(start, end);
}

export function toDateTimeLocalValue(iso?: string): string {
  if (!iso) {
    return "";
  }

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return toIsoLocal(date);
}
