"use client";

import { formatShortDate } from "../shared/dateUtils";
import { ConciergeCard } from "../shared/ConciergeCard";
import type { DetailingTimelineStep, MemberDetailingBookingProgressData } from "@/types/api";
import type { WashDetailsFormState } from "./types";

// ── Timeline helpers ──────────────────────────────────────────────────────────

type TimelineStatus = "completed" | "active" | "pending";

type MappedStep = {
  id: number;
  status: TimelineStatus;
  title: string;
  meta: string;
};

function normaliseStatus(raw?: string): TimelineStatus {
  if (raw === "completed") return "completed";
  if (raw === "active") return "active";
  return "pending";
}

function formatStepMeta(step: DetailingTimelineStep): string {
  if (!step.meta) {
    return step.completedAt
      ? new Date(step.completedAt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "";
  }

  const { estimatedMinutesRemaining, bay, staffName } = step.meta;

  if (estimatedMinutesRemaining != null) {
    const hours = Math.floor(estimatedMinutesRemaining / 60);
    const mins = estimatedMinutesRemaining % 60;
    const timeLabel =
      hours > 0 ? `${hours}h ${mins > 0 ? `${mins}min` : ""}`.trim() : `${mins}min`;
    return `Underway. Est . ${timeLabel} remaining`;
  }

  if (bay) return `Bay ${bay}`;
  if (staffName) return staffName;

  return step.completedAt
    ? new Date(step.completedAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "";
}

function buildStepsFromApi(
  timeline: DetailingTimelineStep[],
  scheduledDateFallback: string,
): MappedStep[] {
  return timeline
    .filter((s) => s.status !== "skipped")
    .map((s, idx) => ({
      id: idx + 1,
      status: normaliseStatus(s.status),
      title: s.label ?? s.key ?? `Step ${idx + 1}`,
      meta: formatStepMeta(s),
    }));
}

function buildFallbackSteps(form: WashDetailsFormState): MappedStep[] {
  return [
    { id: 1, status: "completed", title: "Confirmed by concierge", meta: "08:12" },
    { id: 2, status: "completed", title: "Vehicle prepped & moved", meta: "09:40" },
    { id: 3, status: "active", title: "Detailing in progress", meta: "Underway. Est . 2h remaining" },
    { id: 4, status: "pending", title: "Ready for collection", meta: formatShortDate(form.date) },
  ];
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TimelineCircle({ step, status }: { step: number; status: TimelineStatus }) {
  if (status === "completed") {
    return (
      <span className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#96CEB4] text-[13px] font-semibold text-[#0D0D0D]">
        {step}
      </span>
    );
  }

  if (status === "active") {
    return (
      <span className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-[13px] font-semibold text-[#0D0D0D] shadow-[0_0_16px_rgba(201,168,76,0.35)]">
        {step}
      </span>
    );
  }

  return (
    <span className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border border-accent/20 garage-form-chip text-[13px] font-semibold text-secondary/60">
      {step}
    </span>
  );
}

function BookingTimeline({ steps }: { steps: MappedStep[] }) {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const titleClass =
          step.status === "pending"
            ? "font-roboto text-[13px] font-semibold text-secondary/70"
            : "font-roboto text-[13px] font-semibold text-foreground";

        return (
          <div key={step.id} className={`relative flex gap-4 ${isLast ? "" : "pb-7"}`}>
            {!isLast ? (
              <span className="absolute top-9 left-[17px] h-[calc(100%-12px)] w-px bg-accent/20" />
            ) : null}

            <TimelineCircle step={step.id} status={step.status} />

            <div className="min-w-0 pt-1">
              <p className={titleClass}>{step.title}</p>
              {step.meta ? (
                <p className="font-roboto mt-1 text-[11px] text-secondary">{step.meta}</p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type DetailingWashBookingStatusStepProps = {
  /** Fallback form state (used when no API data is available) */
  form: WashDetailsFormState;
  /** Live progress data from GET /api/v1/detailing/bookings/:id/progress */
  progressData?: MemberDetailingBookingProgressData | null;
};

export function DetailingWashBookingStatusStep({
  form,
  progressData,
}: DetailingWashBookingStatusStepProps) {
  const timeline = progressData?.timeline;

  const steps =
    timeline && timeline.length > 0
      ? buildStepsFromApi(timeline, form.date)
      : buildFallbackSteps(form);

  const concierge = progressData?.concierge;
  const conciergeName = concierge?.name ?? "Sarah Khalid";
  const conciergeInitials = conciergeName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-7">
      <BookingTimeline steps={steps} />

      <ConciergeCard
        sectionLabel="Your Concierge"
        name={conciergeName}
        initials={conciergeInitials}
        subtitle="Available · Responds in <2 min"
      />
    </div>
  );
}
