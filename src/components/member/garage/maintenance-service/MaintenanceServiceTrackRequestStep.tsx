"use client";

import {
  MemberGarageChevronRight,
  MemberServiceCentreStarIcon,
  MemberServiceCentreWorkshopIcon,
} from "@/components/common/Svgs";
import { DotTimeline, type DotTimelineStep } from "../shared/requestFormUi";
import { ConciergeCard } from "../shared/ConciergeCard";
import {
  formatMaintenanceShortDate,
  formatMaintenanceTrackingTime,
  formatMaintenanceTrackingTitle,
  getMaintenanceServiceCentre,
} from "./maintenanceOptions";
import type { MaintenanceDetailsFormState } from "./types";
import type {
  MaintenanceTimelineStep,
  MemberMaintenanceRequestStatusData,
} from "@/types/api";

// ── Timeline mapping ──────────────────────────────────────────────────────────

/**
 * Maps backend timeline step keys to the display labels shown in the design.
 * Falls back to the label from the API if the key is not listed here.
 */
const STEP_LABEL_MAP: Record<string, string> = {
  request_sent:        "Request received",
  vehicle_picked_up:   "Vehicle transport arranged",
  service_in_progress: "Vehicle at service centre",
  awaiting_approval:   "Service report & sign-off",
  ready_for_delivery:  "Vehicle returned to Toybox",
  completed:           "Completed",
};

/**
 * Meta text shown below each timeline step when completed/active.
 * Active steps show a highlighted "In progress" label; pending shows "Pending".
 */
function resolveStepMeta(
  step: MaintenanceTimelineStep,
  index: number,
  allSteps: MaintenanceTimelineStep[],
): { text: string; className?: string } {
  const norm = (step.status ?? "").toLowerCase();

  if (norm === "active") {
    // The active step always shows the "In progress" meta in primary colour
    return { text: "In progress · Service underway", className: "text-primary" };
  }

  if (norm === "pending" || norm === "skipped") {
    // Last pending step shows an estimated return date placeholder
    const isLastPending =
      allSteps.slice(index + 1).every((s) => (s.status ?? "") === "pending");
    return { text: isLastPending ? "Pending" : "Pending" };
  }

  // Completed — show a formatted timestamp when available
  if (step.completedAt) {
    const d = new Date(step.completedAt);
    const month = d.toLocaleString("en-US", { month: "short" });
    const day = d.getDate();
    const time = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return { text: `${month} ${day} · ${time}` };
  }

  return { text: "" };
}

function mapApiTimeline(timeline: MaintenanceTimelineStep[]): DotTimelineStep[] {
  const visible = timeline.filter((s) => s.status !== "skipped");

  return visible.map((step, idx) => {
    const rawStatus = (step.status ?? "pending").toLowerCase();
    const status: DotTimelineStep["status"] =
      rawStatus === "completed" ? "completed"
      : rawStatus === "active"    ? "active"
      : "pending";

    const label =
      STEP_LABEL_MAP[step.key ?? ""] || step.label || `Step ${idx + 1}`;

    const { text, className } = resolveStepMeta(step, idx, visible);

    return {
      id: idx + 1,
      status,
      title: label,
      meta: text,
      ...(className ? { metaClassName: className } : {}),
    };
  });
}

/** Hardcoded fallback used before the API responds */
function buildFallbackSteps(): DotTimelineStep[] {
  return [
    { id: 1, status: "completed", title: "Request received",            meta: "" },
    { id: 2, status: "completed", title: "Booking confirmed with centre", meta: "" },
    { id: 3, status: "completed", title: "Vehicle transport arranged",   meta: "Pickup scheduled" },
    { id: 4, status: "active",    title: "Vehicle at service centre",    meta: "In progress · Service underway", metaClassName: "text-primary" },
    { id: 5, status: "pending",   title: "Service report & sign-off",    meta: "Pending" },
    { id: 6, status: "pending",   title: "Vehicle returned to Toybox",   meta: "Pending" },
  ];
}

// ── Service centre card ───────────────────────────────────────────────────────

function ServiceCentreIcon({ type }: { type: "star" | "workshop" }) {
  const shellClass =
    "flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/35 bg-primary/8";

  if (type === "star") {
    return (
      <span className={shellClass}>
        <MemberServiceCentreStarIcon className="size-[16px]" />
      </span>
    );
  }

  return (
    <span className={`${shellClass} border-accent/20 bg-accent/5`}>
      <MemberServiceCentreWorkshopIcon className="size-[16px]" />
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type MaintenanceServiceTrackRequestStepProps = {
  form: MaintenanceDetailsFormState;
  /** Live status data from GET /api/v1/maintenance/requests/:id/status */
  statusData?: MemberMaintenanceRequestStatusData | null;
};

export function MaintenanceServiceTrackRequestStep({
  form,
  statusData,
}: MaintenanceServiceTrackRequestStepProps) {
  const serviceCentre = getMaintenanceServiceCentre(form.serviceCentre);

  const steps =
    statusData?.timeline && statusData.timeline.length > 0
      ? mapApiTimeline(statusData.timeline)
      : buildFallbackSteps();

  // Use real reference number when available, fall back to date-based one
  const referenceDisplay = statusData?.referenceNumber ?? form.preferredDate;

  return (
    <div className="space-y-6">
      {/* Summary card */}
      <div className="overflow-hidden rounded-2xl border border-accent/12 garage-review-card">
        <div className="flex items-start justify-between gap-4 px-4 py-4">
          <div className="min-w-0">
            <p className="font-roboto text-[12px] font-bold tracking-[0.05em] text-foreground uppercase">
              {formatMaintenanceTrackingTitle(form.vehicle, form.serviceType)}
            </p>
            <p className="font-roboto mt-1 text-[10px] tracking-[0.08em] text-secondary uppercase">
              REF {referenceDisplay}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="font-roboto text-[11px] text-secondary">
              {formatMaintenanceShortDate(form.preferredDate)}
            </p>
            <p className="font-roboto mt-0.5 text-[12px] font-semibold text-primary">
              {formatMaintenanceTrackingTime(form.preferredTime)}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="flex w-full items-center gap-3 border-t border-accent/8 px-4 py-3.5 text-left transition-colors hover:bg-accent/5"
        >
          <ServiceCentreIcon type={serviceCentre.icon} />
          <span className="min-w-0 flex-1">
            <span className="font-roboto block text-[12px] font-semibold text-foreground">
              {serviceCentre.trackingLocation}
            </span>
            <span className="font-roboto mt-0.5 block text-[10px] text-secondary">
              {serviceCentre.trackingDetail}
            </span>
          </span>
          <MemberGarageChevronRight className="size-[10px] shrink-0 text-secondary" />
        </button>
      </div>

      {/* Live timeline */}
      <DotTimeline steps={steps} />

      {/* Concierge card */}
      <ConciergeCard
        sectionLabel="Your Concierge"
        name="Sarah Khalid"
        initials="SK"
        subtitle="Available · Responds in <2 min"
      />
    </div>
  );
}
