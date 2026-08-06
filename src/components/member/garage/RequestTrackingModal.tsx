"use client";

import { useEffect, useState } from "react";
import { ModalPortal } from "@/components/common/ModalPortal";
import { DotTimeline, type DotTimelineStep } from "./shared/requestFormUi";
import { memberTransportApi } from "@/api/memberTransport.api";
import { memberDetailingApi } from "@/api/memberDetailing.api";
import { memberMaintenanceApi } from "@/api/memberMaintenance.api";
import { memberSourcingApi } from "@/api/memberSourcing.api";
import { mapSourcingTimeline } from "@/lib/memberSourcing";
import type { MemberVehicleRecentRequest } from "./types";
import type {
  DetailingTimelineStep,
  MaintenanceTimelineStep,
  MemberTransportTimelineStep,
} from "@/types/api";

// ─── Timeline mappers ────────────────────────────────────────────────────────

function normaliseStatus(raw?: string): DotTimelineStep["status"] {
  const s = (raw ?? "").toLowerCase();
  if (s === "completed") return "completed";
  if (s === "active") return "active";
  return "pending";
}

function formatCompletedAt(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const month = d.toLocaleString("en-US", { month: "short" });
  const day = d.getDate();
  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${month} ${day} · ${time}`;
}

function mapTransportTimeline(items: MemberTransportTimelineStep[]): DotTimelineStep[] {
  return items
    .filter((s) => s.status !== "skipped")
    .map((s, idx) => {
      const status = normaliseStatus(s.status);
      let meta = "";
      if (status === "active") meta = "In progress";
      else if (status === "completed") meta = formatCompletedAt(s.completedAt);
      return { id: idx + 1, status, title: s.label ?? s.key ?? `Step ${idx + 1}`, meta };
    });
}

function mapDetailingTimeline(items: DetailingTimelineStep[]): DotTimelineStep[] {
  return items
    .filter((s) => s.status !== "skipped")
    .map((s, idx) => {
      const status = normaliseStatus(s.status);
      let meta = "";
      if (status === "active") {
        const rem = (s.meta as any)?.estimatedMinutesRemaining;
        meta =
          typeof rem === "number"
            ? `Underway · Est. ${Math.floor(rem / 60) > 0 ? `${Math.floor(rem / 60)}h ` : ""}${rem % 60 > 0 ? `${rem % 60}min` : ""} remaining`.trim()
            : "Underway";
      } else if (status === "completed") {
        meta = formatCompletedAt(s.completedAt);
      }
      return { id: idx + 1, status, title: s.label ?? s.key ?? `Step ${idx + 1}`, meta };
    });
}

function mapMaintenanceTimeline(items: MaintenanceTimelineStep[]): DotTimelineStep[] {
  const LABEL_MAP: Record<string, string> = {
    request_sent:        "Request received",
    vehicle_picked_up:   "Vehicle transport arranged",
    service_in_progress: "Vehicle at service centre",
    awaiting_approval:   "Service report & sign-off",
    ready_for_delivery:  "Vehicle returned to Toybox",
    completed:           "Completed",
  };
  return items
    .filter((s) => s.status !== "skipped")
    .map((s, idx) => {
      const status = normaliseStatus(s.status);
      let meta = "";
      let metaClassName: string | undefined;
      if (status === "active") {
        meta = "In progress · Service underway";
        metaClassName = "text-primary";
      } else if (status === "completed") {
        meta = formatCompletedAt(s.completedAt);
      } else {
        meta = "Pending";
      }
      return {
        id: idx + 1,
        status,
        title: LABEL_MAP[s.key ?? ""] ?? s.label ?? `Step ${idx + 1}`,
        meta,
        metaClassName,
      };
    });
}

// ─── Full completed fallback timelines (when API returns empty on completed) ──

function getCompletedFullTimeline(type: MemberVehicleRecentRequest["type"]): DotTimelineStep[] {
  if (type === "transport" || type === "garage_request") {
    return [
      { id: 1, status: "completed", title: "Request received",          meta: "" },
      { id: 2, status: "completed", title: "Concierge confirmed",        meta: "" },
      { id: 3, status: "completed", title: "Vehicle dispatched",         meta: "" },
      { id: 4, status: "completed", title: "Delivered",                  meta: "Completed" },
    ];
  }
  if (type === "detailing") {
    return [
      { id: 1, status: "completed", title: "Booking received",           meta: "" },
      { id: 2, status: "completed", title: "Confirmed by workshop",      meta: "" },
      { id: 3, status: "completed", title: "Vehicle picked & moved",     meta: "" },
      { id: 4, status: "completed", title: "Detailing completed",        meta: "" },
      { id: 5, status: "completed", title: "Ready for collection",       meta: "Completed" },
    ];
  }
  if (type === "maintenance") {
    return [
      { id: 1, status: "completed", title: "Request received",           meta: "" },
      { id: 2, status: "completed", title: "Vehicle transport arranged", meta: "" },
      { id: 3, status: "completed", title: "Vehicle at service centre",  meta: "" },
      { id: 4, status: "completed", title: "Service report & sign-off",  meta: "" },
      { id: 5, status: "completed", title: "Vehicle returned to Toybox", meta: "Completed" },
    ];
  }
  if (type === "sourcing") {
    return [
      { id: 1, status: "completed", title: "Request received",           meta: "" },
      { id: 2, status: "completed", title: "Sourcing completed",         meta: "" },
      { id: 3, status: "completed", title: "Vehicle approved",           meta: "" },
      { id: 4, status: "completed", title: "Transferred to garage",      meta: "Completed" },
    ];
  }
  // parking
  return [
    { id: 1, status: "completed", title: "Session requested",            meta: "" },
    { id: 2, status: "completed", title: "Slot confirmed",               meta: "" },
    { id: 3, status: "completed", title: "Session ended",                meta: "Completed" },
  ];
}

// ─── Cancelled fallback ───────────────────────────────────────────────────────

function getCancelledTimeline(): DotTimelineStep[] {
  return [
    { id: 1, status: "completed", title: "Request received",   meta: "" },
    { id: 2, status: "completed", title: "Request cancelled",  meta: "No further action required" },
  ];
}

// ─── Active fallback (best-guess when API fails) ──────────────────────────────

function getActiveFallbackTimeline(type: MemberVehicleRecentRequest["type"]): DotTimelineStep[] {
  if (type === "transport" || type === "garage_request") {
    return [
      { id: 1, status: "completed", title: "Request received",             meta: "" },
      { id: 2, status: "active",    title: "Concierge confirming details", meta: "In progress" },
      { id: 3, status: "pending",   title: "Vehicle dispatched",           meta: "Pending" },
      { id: 4, status: "pending",   title: "Delivered",                    meta: "Pending" },
    ];
  }
  if (type === "detailing") {
    return [
      { id: 1, status: "completed", title: "Booking confirmed",            meta: "" },
      { id: 2, status: "active",    title: "Detailing in progress",        meta: "Underway" },
      { id: 3, status: "pending",   title: "Ready for collection",         meta: "Pending" },
    ];
  }
  if (type === "maintenance") {
    return [
      { id: 1, status: "completed", title: "Request received",             meta: "" },
      { id: 2, status: "active",    title: "Vehicle at service centre",    meta: "In progress · Service underway", metaClassName: "text-primary" },
      { id: 3, status: "pending",   title: "Service report & sign-off",    meta: "Pending" },
      { id: 4, status: "pending",   title: "Vehicle returned to Toybox",   meta: "Pending" },
    ];
  }
  if (type === "sourcing") {
    return [
      { id: 1, status: "completed", title: "Request received",             meta: "" },
      { id: 2, status: "active",    title: "Sourcing in progress",         meta: "In progress" },
      { id: 3, status: "pending",   title: "Vehicle proposed",             meta: "Pending" },
      { id: 4, status: "pending",   title: "Approved & transferred",       meta: "Pending" },
    ];
  }
  return [
    { id: 1, status: "completed", title: "Session requested",              meta: "" },
    { id: 2, status: "active",    title: "Slot confirmed",                 meta: "Active" },
    { id: 3, status: "pending",   title: "Session ended",                  meta: "Pending" },
  ];
}

/**
 * Offline fallback — picks the right timeline based on known status.
 * Never shows fake "in-progress" steps for terminal states.
 */
function getOfflineFallback(
  type: MemberVehicleRecentRequest["type"],
  statusTone: MemberVehicleRecentRequest["statusTone"],
): DotTimelineStep[] {
  if (statusTone === "cancelled") return getCancelledTimeline();
  if (statusTone === "completed") return getCompletedFullTimeline(type);
  return getActiveFallbackTimeline(type);
}

// ─── Category label helper ────────────────────────────────────────────────────

function getCategoryLabel(type: MemberVehicleRecentRequest["type"]): string {
  const MAP: Record<MemberVehicleRecentRequest["type"], string> = {
    transport:      "Transport & Delivery",
    detailing:      "Detailing & Wash",
    maintenance:    "Maintenance & Service",
    sourcing:       "Vehicle Sourcing",
    parking:        "Vehicle Parking",
    garage_request: "Vehicle Request",
  };
  return MAP[type] ?? "Service Request";
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function TimelineSkeleton() {
  return (
    <div className="space-y-7 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-4">
          <span className="relative z-10 flex size-9 shrink-0 items-center justify-center">
            <span className="size-2.5 rounded-full bg-accent/20" />
          </span>
          <div className="min-w-0 pt-1.5 space-y-2">
            <div className="h-3 w-36 rounded bg-accent/20" />
            <div className="h-2.5 w-24 rounded bg-accent/12" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Status badge colours ─────────────────────────────────────────────────────

function StatusBadge({ label, tone }: { label: string; tone: MemberVehicleRecentRequest["statusTone"] }) {
  const cls =
    tone === "cancelled"
      ? "border-pink/35 bg-pink/8 text-pink"
      : tone === "completed"
        ? "border-teal/35 bg-teal/8 text-teal"
        : "border-primary/35 bg-primary/8 text-primary";
  return (
    <span className={`font-roboto inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${cls}`}>
      {label}
    </span>
  );
}

// ─── Completed banner ─────────────────────────────────────────────────────────

function CompletedBanner() {
  return (
    <div className="mb-5 flex items-center gap-3 rounded-xl border border-teal/20 bg-teal/6 px-4 py-3">
      {/* checkmark circle */}
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-teal/15">
        <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden>
          <path d="M3 8l3.5 3.5L13 4.5" stroke="var(--teal)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <div>
        <p className="font-roboto text-[12px] font-semibold text-teal">Request Completed</p>
        <p className="font-roboto text-[10px] text-teal/70">All steps have been fulfilled.</p>
      </div>
    </div>
  );
}

// ─── Cancelled banner ─────────────────────────────────────────────────────────

function CancelledBanner() {
  return (
    <div className="mb-5 flex items-center gap-3 rounded-xl border border-pink/20 bg-pink/5 px-4 py-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-pink/12">
        <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden>
          <path d="M4 4l8 8M12 4l-8 8" stroke="var(--pink)" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      <div>
        <p className="font-roboto text-[12px] font-semibold text-pink">Request Cancelled</p>
        <p className="font-roboto text-[10px] text-pink/70">This request is no longer active.</p>
      </div>
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

type RequestTrackingModalProps = {
  open: boolean;
  request: MemberVehicleRecentRequest | null;
  onClose: () => void;
};

export function RequestTrackingModal({ open, request, onClose }: RequestTrackingModalProps) {
  const [steps, setSteps] = useState<DotTimelineStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [liveStatus, setLiveStatus] = useState<string | null>(null);
  const [liveFrom, setLiveFrom] = useState<string | null>(null);
  const [liveTo, setLiveTo] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !request) return;

    setSteps([]);
    setFetchError(null);
    setLiveStatus(null);
    setLiveFrom(null);
    setLiveTo(null);

    const { id: requestId, type, statusTone } = request;
    let aborted = false;
    setIsLoading(true);

    async function load() {
      try {
        if (type === "transport" || type === "garage_request") {
          const res = await memberTransportApi.getStatus(requestId);
          if (aborted) return;
          const data = res.data;
          setLiveStatus(data.status ?? null);
          if (data.pickupLocation) setLiveFrom(data.pickupLocation);
          if (data.dropoffLocation) setLiveTo(data.dropoffLocation);
          const timeline = data.timeline ?? [];
          setSteps(
            timeline.length > 0
              ? mapTransportTimeline(timeline)
              : getOfflineFallback(type, statusTone),
          );
        } else if (type === "detailing") {
          const res = await memberDetailingApi.getProgress(requestId);
          if (aborted) return;
          const timeline = res.data.timeline ?? [];
          setLiveStatus(res.data.status ?? null);
          setSteps(
            timeline.length > 0
              ? mapDetailingTimeline(timeline)
              : getOfflineFallback(type, statusTone),
          );
        } else if (type === "maintenance") {
          const res = await memberMaintenanceApi.getStatus(requestId);
          if (aborted) return;
          const timeline = res.data.timeline ?? [];
          setLiveStatus(res.data.status ?? null);
          setSteps(
            timeline.length > 0
              ? mapMaintenanceTimeline(timeline)
              : getOfflineFallback(type, statusTone),
          );
        } else if (type === "sourcing") {
          const res = await memberSourcingApi.getStatus(requestId);
          if (aborted) return;
          const timeline = res.data.timeline ?? [];
          setLiveStatus(res.data.status ?? null);
          const mapped = mapSourcingTimeline(timeline);
          setSteps(mapped.length > 0 ? mapped : getOfflineFallback(type, statusTone));
        } else {
          // parking — no dedicated timeline endpoint
          setSteps(getOfflineFallback(type, statusTone));
        }
      } catch {
        if (!aborted) {
          setSteps(getOfflineFallback(type, statusTone));
          if (statusTone !== "cancelled" && statusTone !== "completed") {
            setFetchError("Could not load live status. Showing last known state.");
          }
        }
      } finally {
        if (!aborted) setIsLoading(false);
      }
    }

    void load();
    return () => { aborted = true; };
  }, [open, request]);

  if (!open || !request) return null;

  const categoryLabel = getCategoryLabel(request.type);
  const [titleFirst, ...titleRest] = categoryLabel.split(" ");
  const refDisplay = request.referenceNumber ?? request.subtitle?.split(" · ")[0] ?? "—";
  const dateDisplay = request.dateLabel ?? "";
  const statusDisplay = liveStatus ?? request.status ?? "—";
  const isCompleted = request.statusTone === "completed";
  const isCancelled = request.statusTone === "cancelled";
  const sectionLabel = isCancelled ? "Request History" : "Progress";

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        {/* Panel */}
        <div className="Custom__Scrollbar relative z-10 max-h-[90vh] sm:max-h-[85vh] w-full sm:max-w-[480px] overflow-y-auto rounded-t-[28px] sm:rounded-[24px] border border-accent/20 bg-card shadow-[var(--shadow-modal)]">
          {/* Mobile drag handle */}
          <div className="flex sm:hidden justify-center pt-3 pb-0">
            <span className="h-1 w-9 rounded-full bg-accent/30" />
          </div>

          {/* Header bar */}
          <div className="flex items-start justify-between gap-4 px-5 sm:px-6 pt-5 pb-4 border-b border-accent/10">
            <div className="space-y-0.5">
              <p className="font-roboto text-[9px] tracking-[0.2em] text-primary uppercase">
                Track Request
              </p>
              <h3 className="font-copperplate text-[22px] leading-tight tracking-[0.04em] uppercase">
                <span className="text-foreground-soft">{titleFirst} </span>
                <span className="text-primary">{titleRest.join(" ")}</span>
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="mt-0.5 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-accent/20 bg-input-muted text-secondary transition-colors hover:border-accent/35 hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-5 sm:px-6 py-5 space-y-5">
            {/* Reference info card */}
            <div className="rounded-xl border border-accent/12 bg-input-muted px-4 py-3 space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-roboto text-[11px] font-medium tracking-[0.06em] text-foreground">
                  {refDisplay}
                </p>
                {dateDisplay ? (
                  <p className="font-roboto text-[10px] text-secondary shrink-0">{dateDisplay}</p>
                ) : null}
              </div>

              <StatusBadge label={statusDisplay} tone={request.statusTone} />

              {/* Route info for transport */}
              {(liveFrom || liveTo) ? (
                <div className="space-y-1.5 border-t border-accent/10 pt-2.5">
                  {liveFrom ? (
                    <div className="flex items-start gap-2">
                      <span className="font-roboto text-[9px] tracking-[0.1em] text-primary uppercase shrink-0 mt-0.5 w-7">From</span>
                      <span className="font-roboto text-[11px] text-foreground">{liveFrom}</span>
                    </div>
                  ) : null}
                  {liveTo ? (
                    <div className="flex items-start gap-2">
                      <span className="font-roboto text-[9px] tracking-[0.1em] text-primary uppercase shrink-0 mt-0.5 w-7">To</span>
                      <span className="font-roboto text-[11px] text-foreground">{liveTo}</span>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            {/* Terminal state banners */}
            {isCompleted ? <CompletedBanner /> : null}
            {isCancelled ? <CancelledBanner /> : null}

            {/* Active request error notice */}
            {fetchError ? (
              <p className="font-roboto text-[11px] text-secondary/70 italic">{fetchError}</p>
            ) : null}

            {/* Timeline */}
            <div>
              <p className="font-roboto mb-4 text-[10px] font-medium tracking-[0.18em] text-section-label uppercase">
                {sectionLabel}
              </p>
              {isLoading ? <TimelineSkeleton /> : <DotTimeline steps={steps} />}
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
