import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { MemberDiaryData, DiaryEntry, DiaryGroup } from "@/components/member/diary/types";
import type { ApiResponse } from "@/types/api";

// ── Parking session raw shape from GET /api/v1/parking/sessions ─────────────

type ParkingSessionRaw = {
  id?: string;
  referenceNumber?: string;
  mode?: string;
  status?: string;
  scheduledStartAt?: string | null;
  scheduledEndAt?: string | null;
  createdAt?: string;
  vehicle?: {
    make?: string;
    model?: string;
    colour?: string;
    plate?: string;
  } | null;
  slot?: {
    slotCode?: string;
    level?: string | number;
    zone?: string;
    label?: string;
  } | null;
};

type ParkingSessionsResponse = ApiResponse<{
  sessions?: ParkingSessionRaw[];
  rows?: ParkingSessionRaw[];
  data?: ParkingSessionRaw[];
  total?: number;
}>;

// ── Helpers ─────────────────────────────────────────────────────────────────

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"] as const;

function formatDateLabel(dateInput: string | null | undefined): string {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";
  return `${DAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

function formatTimeLabel(dateInput: string | null | undefined): string {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function extractSessions(responseData: ParkingSessionsResponse["data"]): ParkingSessionRaw[] {
  if (!responseData) return [];
  if (Array.isArray(responseData)) return responseData;
  // API may return { sessions: [] } or { rows: [] } or { data: [] }
  if (Array.isArray((responseData as Record<string, unknown>).sessions)) {
    return (responseData as { sessions: ParkingSessionRaw[] }).sessions;
  }
  if (Array.isArray((responseData as Record<string, unknown>).rows)) {
    return (responseData as { rows: ParkingSessionRaw[] }).rows;
  }
  if (Array.isArray((responseData as Record<string, unknown>).data)) {
    return (responseData as { data: ParkingSessionRaw[] }).data;
  }
  return [];
}

type StatusMeta = {
  label: string;
  tone: NonNullable<DiaryEntry["statusTone"]>;
};

function resolveStatusMeta(status?: string): StatusMeta {
  switch (status) {
    case "active":    return { label: "PARKED", tone: "teal" };
    case "accepted":  return { label: "ACCEPTED",    tone: "teal" };
    case "pending":   return { label: "PENDING",     tone: "gold" };
    case "completed": return { label: "COMPLETED",   tone: "green" };
    case "cancelled": return { label: "CANCELLED",   tone: "red" };
    default:
      return {
        label: status ? status.toUpperCase() : "SUBMITTED",
        tone: "muted",
      };
  }
}

function mapSessionToDiaryEntry(session: ParkingSessionRaw): DiaryEntry & { rawDate: Date } {
  const veh = session.vehicle;
  const slot = session.slot;
  const vehicleName = veh ? `${veh.make ?? ""} ${veh.model ?? ""}`.trim().toUpperCase() : "VEHICLE";
  const slotLabel = slot
    ? (slot.label || slot.slotCode || [slot.level, slot.zone].filter(Boolean).join("-") || "SLOT")
    : "SLOT";
  const modeLabel = session.mode === "pickup" ? "VALET PICKUP" : "SELF DROP-OFF";
  const { label: statusLabel, tone: statusTone } = resolveStatusMeta(session.status);

  const dateStr = session.scheduledStartAt ?? session.createdAt ?? null;

  return {
    id: `parking-${session.id ?? session.referenceNumber ?? Math.random()}`,
    kind: "parking",
    dateLabel: formatDateLabel(dateStr),
    timeLabel: session.scheduledStartAt ? formatTimeLabel(session.scheduledStartAt) : formatTimeLabel(session.createdAt),
    titlePrefix: vehicleName ? `${vehicleName} —` : "PARKING —",
    titleHighlight: `PARKING · ${String(slotLabel).toUpperCase()}`,
    description: `${modeLabel} request for slot ${String(slotLabel).toUpperCase()}.${session.scheduledStartAt ? ` Scheduled: ${formatDateLabel(session.scheduledStartAt)} at ${formatTimeLabel(session.scheduledStartAt)}.` : ""} Status: ${statusLabel.charAt(0) + statusLabel.slice(1).toLowerCase()}.${session.referenceNumber ? ` Ref: ${session.referenceNumber}.` : ""}`,
    tags: ["PARKING", "GARAGE"],
    statusLabel,
    statusTone,
    rawDate: dateStr ? new Date(dateStr) : new Date(0),
  };
}

// ── Group boundary helpers (mirrors the backend logic) ──────────────────────

function startOfWeekMonday(now: Date): Date {
  const d = new Date(now);
  const day = d.getDay(); // 0 Sun … 6 Sat
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfWeekSunday(now: Date): Date {
  const start = startOfWeekMonday(now);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

function getGroupId(rawDate: Date): "this-week" | "earlier-this-month" | "earlier" {
  const now = new Date();
  const weekStart = startOfWeekMonday(now);
  const weekEnd = endOfWeekSunday(now);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  if (rawDate >= weekStart && rawDate <= weekEnd) return "this-week";
  if (rawDate >= monthStart && rawDate < weekStart) return "earlier-this-month";
  return "earlier";
}

// ── Merge parking sessions into existing diary groups ────────────────────────

function mergeParkingIntoGroups(
  groups: DiaryGroup[],
  sessions: ParkingSessionRaw[],
): DiaryGroup[] {
  if (sessions.length === 0) return groups;

  const entries = sessions
    .map(mapSessionToDiaryEntry)
    .filter((e) => e.rawDate.getTime() > 0);

  // Build a map of existing groups for fast lookup
  const groupMap = new Map<string, DiaryGroup & { rawEntries: Array<DiaryEntry & { rawDate: Date }> }>();

  const GROUP_META: Record<"this-week" | "earlier-this-month" | "earlier", { label: string }> = {
    "this-week": { label: "THIS WEEK" },
    "earlier-this-month": { label: "EARLIER THIS MONTH" },
    "earlier": { label: "EARLIER" },
  };

  // Pre-populate with existing groups; attach a rawDate for sorting by cloning entries
  for (const group of groups) {
    groupMap.set(group.id, {
      ...group,
      rawEntries: group.entries.map((e) => ({ ...e, rawDate: new Date(0) })),
    });
  }

  // Add parking entries to their correct group
  for (const entry of entries) {
    const gid = getGroupId(entry.rawDate);
    if (!groupMap.has(gid)) {
      groupMap.set(gid, {
        id: gid,
        label: GROUP_META[gid].label,
        countLabel: "",
        entries: [],
        rawEntries: [],
      });
    }
    groupMap.get(gid)!.rawEntries.push(entry);
    groupMap.get(gid)!.entries.push(entry);
  }

  // Re-sort each group's entries: parking entries mixed with existing ones
  // For existing (non-parking) entries we don't have rawDate, so just push parking
  // entries to the front/back based on whether it's an "earlier" group or recent.
  // Simple approach: for each group, sort parking entries by rawDate desc and
  // prepend them before the existing non-parking entries.
  const GROUP_ORDER: Array<"this-week" | "earlier-this-month" | "earlier"> = [
    "this-week", "earlier-this-month", "earlier",
  ];

  const result: DiaryGroup[] = [];

  for (const gid of GROUP_ORDER) {
    const group = groupMap.get(gid);
    if (!group) continue;

    // Separate parking entries from existing entries
    const parkingEntries = group.entries
      .filter((e) => e.kind === "parking")
      .sort((a, b) => {
        const aRaw = group.rawEntries.find((r) => r.id === a.id);
        const bRaw = group.rawEntries.find((r) => r.id === b.id);
        return (bRaw?.rawDate.getTime() ?? 0) - (aRaw?.rawDate.getTime() ?? 0);
      });
    const otherEntries = group.entries.filter((e) => e.kind !== "parking");

    // Merged: parking first (most recent), then existing entries
    const merged = [...parkingEntries, ...otherEntries];
    const count = merged.length;

    result.push({
      id: group.id,
      label: group.label,
      countLabel: `${count} ${count === 1 ? "ENTRY" : "ENTRIES"}`,
      entries: merged,
    });
  }

  // Include any groups from the original that weren't in our order (defensive)
  for (const group of groups) {
    if (!GROUP_ORDER.includes(group.id as (typeof GROUP_ORDER)[number])) {
      result.push(group);
    }
  }

  return result.filter((g) => g.entries.length > 0);
}

// ── Public API ───────────────────────────────────────────────────────────────

export const diaryApi = {
  getDiary: async (): Promise<ApiResponse<MemberDiaryData>> => {
    // Fetch diary and parking sessions in parallel
    const [diaryRes, parkingRes] = await Promise.allSettled([
      apiClient<ApiResponse<MemberDiaryData>>(`${API_ENDPOINTS.member.diary}?full=true`),
      apiClient<ParkingSessionsResponse>(
        `${API_ENDPOINTS.memberParking.sessions}?limit=50&offset=0`,
      ),
    ]);

    // If diary failed, propagate the error
    if (diaryRes.status === "rejected") {
      throw diaryRes.reason;
    }

    const diary = diaryRes.value;

    // If parking failed, return diary as-is (graceful degradation)
    if (parkingRes.status === "rejected" || !diary.success || !diary.data) {
      return diary;
    }

    const sessions = extractSessions(parkingRes.value?.data);
    if (sessions.length === 0) return diary;

    // Merge parking sessions into diary groups
    return {
      ...diary,
      data: {
        ...diary.data,
        groups: mergeParkingIntoGroups(diary.data.groups ?? [], sessions),
      },
    };
  },
};
