import type { VehicleSourcingDetailsFormState } from "@/components/member/garage/vehicle-sourcing/types";
import type {
  SourcingBudgetKey,
  SourcingCategoryKey,
  SourcingConditionKey,
  SourcingTimelineKey,
} from "@/components/member/garage/vehicle-sourcing/types";
import type {
  CreateSourcingRequestBody,
  SourcingRequestConfirmationData,
  SourcingRequestStatusData,
  SourcingRequestStatusTimeline,
} from "@/types/api";

// ── Budget → numeric range ────────────────────────────────────────────────────

const BUDGET_RANGE: Record<SourcingBudgetKey, { min: number; max: number | null }> = {
  "under-1m": { min: 0, max: 1_000_000 },
  "1m-2m":   { min: 1_000_000, max: 2_000_000 },
  "2m-3m":   { min: 2_000_000, max: 3_000_000 },
  "3m-plus": { min: 3_000_000, max: null },
};

// ── Category → trim hint ──────────────────────────────────────────────────────

const CATEGORY_TRIM: Record<SourcingCategoryKey, string> = {
  "sports-car":    "Sports Car",
  "suv-crossover": "SUV / Crossover",
  "hypercar":      "Hypercar",
  "classic":       "Classic",
};

// ── Condition → human label for notes ────────────────────────────────────────

const CONDITION_LABEL: Record<SourcingConditionKey, string> = {
  "new-nearly-new": "New or nearly new (0–5,000 km)",
  "lightly-used":   "Lightly used (5,000–20,000 km)",
  "open-any":       "Open to any condition (full history required)",
};

// ── Timeline → timelineNotes ──────────────────────────────────────────────────

const TIMELINE_LABEL: Record<SourcingTimelineKey, string> = {
  "asap":        "ASAP",
  "1-3-months":  "1–3 months",
  "3-6-months":  "3–6 months",
  "flexible":    "Flexible",
};

// ── Main builder ──────────────────────────────────────────────────────────────

export function buildSourcingRequestBody(
  memberId: string,
  form: VehicleSourcingDetailsFormState,
): CreateSourcingRequestBody {
  const budget = BUDGET_RANGE[form.budget];
  const yearMin = form.yearFrom ? parseInt(form.yearFrom, 10) : undefined;
  const yearMax = form.yearTo   ? parseInt(form.yearTo,   10) : undefined;

  // Pack specs, condition and key specs into the specifications object
  const specifications: Record<string, unknown> = {
    category:          CATEGORY_TRIM[form.category] ?? form.category,
    condition:         CONDITION_LABEL[form.condition] ?? form.condition,
    keySpecifications: form.keySpecifications,
  };

  const timelineNotes = TIMELINE_LABEL[form.timeline] ?? form.timeline;

  // Build notes: preferred colour + additional notes
  const notesParts: string[] = [];
  if (form.preferredColour.trim()) {
    notesParts.push(`Preferred colour: ${form.preferredColour.trim()}`);
  }
  if (form.additionalNotes.trim()) {
    notesParts.push(form.additionalNotes.trim());
  }
  const notes = notesParts.join("\n\n") || undefined;

  const body: CreateSourcingRequestBody = {
    memberId,
    make:          form.make.trim(),
    model:         form.model.trim(),
    yearMin:       Number.isFinite(yearMin) ? yearMin : undefined,
    yearMax:       Number.isFinite(yearMax) ? yearMax : undefined,
    colour:        form.preferredColour.trim() || undefined,
    trim:          CATEGORY_TRIM[form.category],
    specifications,
    budgetMin:     budget.min,
    budgetMax:     budget.max ?? undefined,
    currency:      "AED",
    timelineNotes,
    notes,
  };

  return body;
}

// ── Response helpers ──────────────────────────────────────────────────────────

export function resolveSourcingReferenceNumber(
  data: SourcingRequestConfirmationData,
): string {
  if (data.referenceNumber?.trim()) return data.referenceNumber.trim();
  if (data.id?.trim()) return data.id.trim();

  const now = new Date();
  const seq = String(Math.floor(Math.random() * 900) + 100);
  return `SRC-${now.getFullYear()}-${seq}`;
}

export function resolveSourcingRequestId(
  data: SourcingRequestConfirmationData,
): string | null {
  return data.id?.trim() ?? null;
}

export function resolveSourcingSubmittedDate(
  data: SourcingRequestConfirmationData,
): string {
  if (!data.createdAt) return "Just now";
  const d = new Date(data.createdAt);
  if (Number.isNaN(d.getTime())) return "Just now";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ── Timeline mapping ──────────────────────────────────────────────────────────

/**
 * Maps the backend timeline array from GET /sourcing/requests/:id/status
 * into the UI step shape expected by VehicleSourcingTrackRequestStep.
 *
 * Backend keys (from sourcing.timeline.js): request_received | searching |
 * vehicle_found | inspection_in_progress | offer_ready | confirmed | completed
 */
export type UiTimelineStep = {
  id: number;
  status: "completed" | "active" | "pending";
  title: string;
  meta: string;
  metaClassName?: string;
};

const TIMELINE_STEP_LABELS: Record<string, string> = {
  request_received:       "Brief received",
  searching:              "Market search underway",
  vehicle_found:          "Vehicle found",
  inspection_in_progress: "Inspection in progress",
  offer_ready:            "Options presented to member",
  confirmed:              "Vehicle selected & acquired",
  completed:              "Delivered to Toybox storage",
};

function formatTimelineMeta(step: SourcingRequestStatusTimeline): string {
  if (step.completedAt) {
    const d = new Date(step.completedAt);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  }
  if (step.meta) return step.meta;
  return "";
}

export function mapSourcingTimeline(
  timeline: SourcingRequestStatusTimeline[],
): UiTimelineStep[] {
  if (!timeline.length) {
    // Fallback: show static skeleton steps
    return [
      { id: 1, status: "pending", title: "Brief received", meta: "" },
      { id: 2, status: "pending", title: "Assigned to acquisition manager", meta: "" },
      { id: 3, status: "pending", title: "Market search underway", meta: "" },
      { id: 4, status: "pending", title: "Options presented to member", meta: "" },
      { id: 5, status: "pending", title: "Vehicle selected & acquired", meta: "" },
      { id: 6, status: "pending", title: "Delivered to Toybox storage", meta: "" },
    ];
  }

  return timeline.map((step, index) => {
    let uiStatus: "completed" | "active" | "pending";
    if (step.status === "completed") {
      uiStatus = "completed";
    } else if (step.status === "active") {
      uiStatus = "active";
    } else {
      uiStatus = "pending";
    }

    const metaClassName =
      uiStatus === "active" ? "text-primary" : undefined;

    const meta =
      uiStatus === "active"
        ? "In progress now"
        : uiStatus === "completed"
          ? formatTimelineMeta(step)
          : "Pending";

    return {
      id: index + 1,
      status: uiStatus,
      title:
        (step.key ? TIMELINE_STEP_LABELS[step.key] : undefined) ??
        step.label ??
        `Step ${index + 1}`,
      meta,
      metaClassName,
    };
  });
}

export function resolveSourcingRequestStatus(
  data: SourcingRequestStatusData,
): string {
  return data.status ?? "Request received";
}
