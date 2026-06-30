import type {
  StaffOverviewAlertRaw,
  StaffOverviewAssignmentRaw,
  StaffOverviewData,
  StaffOverviewJobsData,
  StaffOverviewKpiRaw,
  StaffOverviewQuickActionRaw,
  StaffOverviewScheduleEventRaw,
  StaffOverviewShiftStatRaw,
  StaffOverviewStaffOnDutyRaw,
  StaffOverviewTaskRaw,
} from "@/types/api";
import type { StaffOverviewDisplay } from "@/components/staff/overview/types";
import { staffNavItems, STAFF_BASE } from "@/lib/staffNav";

const avatarClasses = [
  "bg-gradient-to-b from-gold-bright to-gold-deep text-dark",
  "bg-avatar-slate text-foreground",
  "bg-avatar-rose text-foreground",
  "bg-avatar-purple text-foreground",
  "bg-avatar-green text-foreground",
];

const defaultKpis: StaffOverviewDisplay["kpis"] = [
  {
    label: "Members in Club",
    value: "0",
    subtext: "No change today",
    iconKey: "members",
  },
  {
    label: "Vehicles Stored",
    value: "0",
    subtext: "No pending intake",
    iconKey: "vehicles",
  },
  {
    label: "Open Requests",
    value: "0",
    subtext: "No critical items",
    iconKey: "open-requests",
  },
  {
    label: "Storage Occupancy",
    value: "0%",
    subtext: "No bays available",
    iconKey: "storage",
  },
];

function resolveQuickActionHref(
  id: string,
  apiHref?: string,
): string {
  if (apiHref?.trim()) {
    return apiHref.trim();
  }

  return (
    staffNavItems.find((item) => item.id === id)?.href ??
    `${STAFF_BASE}/overview`
  );
}

const defaultQuickActions: StaffOverviewDisplay["quickActions"] = [
  {
    id: "inspections",
    title: "Inspections",
    subtitle: "0 pending",
    iconKey: "inspections",
    href: resolveQuickActionHref("inspections"),
  },
  {
    id: "photo-uploads",
    title: "Photo Uploads",
    subtitle: "0 pending upload",
    iconKey: "photo-uploads",
    href: resolveQuickActionHref("photo-uploads"),
  },
  {
    id: "concierge",
    title: "Concierge",
    subtitle: "0 unread chats",
    iconKey: "concierge",
    href: resolveQuickActionHref("concierge"),
  },
  {
    id: "bookings",
    title: "Bookings",
    subtitle: "0 await signature",
    iconKey: "bookings",
    href: resolveQuickActionHref("bookings"),
  },
];

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function extractItems<T>(value: unknown, keys: string[]): T[] {
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

function extractCount(
  value: unknown,
  items: unknown[],
  keys: string[],
): number {
  const record = asRecord(value);

  if (record) {
    for (const key of keys) {
      const nested = record[key];

      if (typeof nested === "number" && !Number.isNaN(nested)) {
        return nested;
      }
    }
  }

  return items.length;
}

function formatValue(value: string | number | undefined): string {
  if (value === undefined || value === null) {
    return "0";
  }

  return String(value);
}

function padIndex(value: number | string | undefined, fallback: number): string {
  if (typeof value === "number") {
    return String(value).padStart(2, "0");
  }

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  return String(fallback).padStart(2, "0");
}

function normalizeIconTone(value?: string): "pink" | "gold" | "blue" | "teal" {
  const normalized = value?.trim().toLowerCase() ?? "";

  if (normalized.includes("gold") || normalized.includes("primary")) {
    return "gold";
  }

  if (normalized.includes("blue") || normalized.includes("info")) {
    return "blue";
  }

  if (normalized.includes("teal") || normalized.includes("green")) {
    return "teal";
  }

  return "pink";
}

function mapKpiItem(
  item: StaffOverviewKpiRaw,
  fallback: StaffOverviewDisplay["kpis"][number],
): StaffOverviewDisplay["kpis"][number] {
  return {
    label: item.label?.trim() || fallback.label,
    value: formatValue(item.value),
    subtext: item.subtext?.trim() || item.subtitle?.trim() || fallback.subtext,
    trend: item.trend?.trim() || undefined,
    iconKey: item.icon?.trim() || fallback.iconKey,
  };
}

function mapKpis(data: StaffOverviewData["kpis"]): StaffOverviewDisplay["kpis"] {
  if (!data) {
    return defaultKpis;
  }

  if (Array.isArray(data)) {
    return defaultKpis.map((fallback, index) =>
      mapKpiItem(data[index] ?? {}, fallback),
    );
  }

  const record = asRecord(data);

  if (!record) {
    return defaultKpis;
  }

  const values = Object.values(record) as StaffOverviewKpiRaw[];

  if (values.length === 0) {
    return defaultKpis;
  }

  return defaultKpis.map((fallback, index) =>
    mapKpiItem(values[index] ?? {}, fallback),
  );
}

function mapQuickAction(
  item: StaffOverviewQuickActionRaw,
  fallback: StaffOverviewDisplay["quickActions"][number],
): StaffOverviewDisplay["quickActions"][number] {
  const id = item.id?.trim() || fallback.id;
  const subtitle =
    item.subtitle?.trim() ||
    item.subtext?.trim() ||
    (typeof item.count === "number" ? `${item.count} pending` : fallback.subtitle);

  return {
    id,
    title: item.title?.trim() || item.label?.trim() || fallback.title,
    subtitle,
    iconKey: item.icon?.trim() || fallback.iconKey,
    href: resolveQuickActionHref(id, item.href),
  };
}

function mapQuickActions(
  data: StaffOverviewQuickActionRaw[] | undefined,
): StaffOverviewDisplay["quickActions"] {
  if (!data?.length) {
    return defaultQuickActions;
  }

  return defaultQuickActions.map((fallback, index) =>
    mapQuickAction(data[index] ?? {}, fallback),
  );
}

function mapPriorityTask(
  item: StaffOverviewTaskRaw,
  index: number,
): StaffOverviewDisplay["priorityTasks"]["items"][number] {
  const status =
    typeof item.status === "string"
      ? { label: item.status, tone: "green" as const }
      : item.status?.label
        ? {
            label: item.status.label,
            tone: "green" as const,
          }
        : undefined;

  return {
    id: String(item.id ?? `task-${index + 1}`),
    index: padIndex(item.index, index + 1),
    title: item.title?.trim() || "Untitled task",
    detail:
      item.detail?.trim() || item.description?.trim() || "No details provided",
    time: item.time?.trim() || item.scheduledAt?.trim() || undefined,
    status,
    iconKey: item.icon?.trim() || "alert",
    iconTone: normalizeIconTone(item.iconTone),
  };
}

function mapScheduleItem(
  item: StaffOverviewScheduleEventRaw,
  index: number,
): StaffOverviewDisplay["schedule"]["items"][number] {
  return {
    id: String(item.id ?? `schedule-${index + 1}`),
    time: item.time?.trim() || "--:--",
    title: item.title?.trim() || "Scheduled event",
    detail:
      item.detail?.trim() || item.description?.trim() || "No location provided",
  };
}

function mapSystemAlert(
  item: StaffOverviewAlertRaw,
  index: number,
): StaffOverviewDisplay["systemAlerts"]["items"][number] {
  return {
    id: String(item.id ?? `alert-${index + 1}`),
    message: item.message?.trim() || item.title?.trim() || "System alert",
    time: item.time?.trim() || item.timeAgo?.trim() || "Just now",
    iconKey: item.icon?.trim() || "alert",
  };
}

function resolveAvatarClass(
  item: StaffOverviewStaffOnDutyRaw,
  index: number,
): string {
  const tone = item.avatarTone?.trim().toLowerCase();

  if (tone === "gold") {
    return avatarClasses[0];
  }

  if (tone === "slate") {
    return avatarClasses[1];
  }

  if (tone === "rose") {
    return avatarClasses[2];
  }

  if (tone === "purple") {
    return avatarClasses[3];
  }

  if (tone === "green") {
    return avatarClasses[4];
  }

  return avatarClasses[index % avatarClasses.length];
}

function mapStaffDutyItem(
  item: StaffOverviewStaffOnDutyRaw,
  index: number,
): StaffOverviewDisplay["staffOnDuty"]["items"][number] {
  const name = item.name?.trim() || "Staff member";
  const initial =
    item.initial?.trim() ||
    name
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 1)
      .toUpperCase();

  const status = item.status?.trim().toLowerCase() ?? "active";

  return {
    id: String(item.id ?? `staff-${index + 1}`),
    initial,
    name,
    role: item.role?.trim() || item.jobTitle?.trim() || "Staff",
    avatarClass: resolveAvatarClass(item, index),
    statusTone: status.includes("away") || status.includes("break") ? "gold" : "green",
    highlight: Boolean(item.isCurrentUser ?? item.highlight),
  };
}

function mapShiftStat(
  item: StaffOverviewShiftStatRaw,
): StaffOverviewDisplay["shiftStats"]["items"][number] {
  return {
    label: item.label?.trim() || "Stat",
    value: formatValue(item.value),
  };
}

function mapAssignment(
  data: StaffOverviewAssignmentRaw | undefined,
): StaffOverviewDisplay["assignment"] {
  if (!data) {
    return null;
  }

  const bay = data.bay?.trim();
  const location = data.location?.trim() || data.workshop?.trim();
  const vehicle = data.vehicle?.trim();
  const shiftStatus = data.shiftStatus?.trim() || data.status?.trim();

  if (!bay && !location && !vehicle && !shiftStatus) {
    return null;
  }

  return {
    bay: bay || "Unassigned",
    location: location || "No location set",
    vehicle: vehicle || "No vehicle assigned",
    shiftStatus: shiftStatus || "Inactive",
  };
}

function applyJobsEnrichment(
  display: StaffOverviewDisplay,
  jobs: StaffOverviewJobsData | undefined,
): StaffOverviewDisplay {
  if (!jobs) {
    return display;
  }

  const next = { ...display };

  next.quickActions = display.quickActions.map((action) => {
    if (action.id !== "bookings") {
      return action;
    }

    const pending = jobs.pendingConfirm ?? 0;
    const signOff = jobs.signOffQueue ?? 0;

    return {
      ...action,
      subtitle:
        signOff > 0
          ? `${pending} await signature · ${signOff} in review`
          : `${pending} await signature`,
    };
  });

  const hasShiftProgress = display.shiftStats.items.some((item) =>
    item.label.toLowerCase().includes("shift progress"),
  );

  if (!hasShiftProgress && jobs.shiftProgress !== undefined) {
    next.shiftStats = {
      ...display.shiftStats,
      items: [
        ...display.shiftStats.items,
        {
          label: "Shift Progress",
          value: `${formatValue(jobs.shiftProgress)}%`,
        },
      ],
    };
  }

  const hasCompletedToday = display.shiftStats.items.some((item) =>
    item.label.toLowerCase().includes("completed today"),
  );

  if (!hasCompletedToday && jobs.completedToday !== undefined) {
    next.shiftStats = {
      ...next.shiftStats,
      items: [
        ...next.shiftStats.items,
        {
          label: "Completed Today",
          value: formatValue(jobs.completedToday),
        },
      ],
    };
  }

  return next;
}

export function createEmptyStaffOverviewDisplay(): StaffOverviewDisplay {
  return {
    greeting: {
      displayDate: "Today",
      shiftLabel: "Shift",
      staffName: "Staff",
    },
    kpis: defaultKpis,
    quickActions: defaultQuickActions,
    priorityTasks: { urgentCount: 0, items: [] },
    schedule: { eventCount: 0, items: [] },
    systemAlerts: { criticalCount: 0, items: [] },
    staffOnDuty: { activeCount: 0, items: [] },
    shiftStats: { shiftLabel: "Shift", items: [] },
    assignment: null,
  };
}

export function mapStaffOverview(
  data: StaffOverviewData | undefined,
  jobs?: StaffOverviewJobsData,
): StaffOverviewDisplay {
  if (!data) {
    return createEmptyStaffOverviewDisplay();
  }

  const priorityTaskItems = extractItems<StaffOverviewTaskRaw>(
    data.priorityTasks,
    ["items", "tasks"],
  );
  const scheduleItems = extractItems<StaffOverviewScheduleEventRaw>(
    data.schedule,
    ["items", "events"],
  );
  const alertItems = extractItems<StaffOverviewAlertRaw>(data.systemAlerts, [
    "items",
    "alerts",
  ]);
  const shiftStatItems = extractItems<StaffOverviewShiftStatRaw>(
    data.shiftStats,
    ["items", "stats"],
  );
  const staffOnDutyItems = extractItems<StaffOverviewStaffOnDutyRaw>(
    data.staffOnDuty,
    ["items", "staff"],
  );

  const display: StaffOverviewDisplay = {
    greeting: {
      displayDate: data.shift?.displayDate?.trim() || "Today",
      shiftLabel: data.shift?.label?.trim() || "Shift",
      staffName: data.staff?.name?.trim() || "Staff",
      timeRemainingLabel: data.shift?.timeRemainingLabel?.trim() || undefined,
    },
    kpis: mapKpis(data.kpis),
    quickActions: mapQuickActions(data.quickActions),
    priorityTasks: {
      urgentCount: extractCount(
        data.priorityTasks,
        priorityTaskItems,
        ["urgentCount", "count"],
      ),
      items: priorityTaskItems.map(mapPriorityTask),
    },
    schedule: {
      eventCount: extractCount(data.schedule, scheduleItems, [
        "count",
        "eventCount",
      ]),
      items: scheduleItems.map(mapScheduleItem),
    },
    systemAlerts: {
      criticalCount: extractCount(data.systemAlerts, alertItems, [
        "criticalCount",
        "count",
      ]),
      items: alertItems.map(mapSystemAlert),
    },
    staffOnDuty: {
      activeCount: staffOnDutyItems.length,
      items: staffOnDutyItems.map(mapStaffDutyItem),
    },
    shiftStats: {
      shiftLabel:
        asRecord(data.shiftStats)?.label?.toString().trim() ||
        data.shift?.label?.trim() ||
        "Shift",
      items: shiftStatItems.map(mapShiftStat),
    },
    assignment: mapAssignment(data.yourAssignment),
  };

  return applyJobsEnrichment(display, jobs);
}
