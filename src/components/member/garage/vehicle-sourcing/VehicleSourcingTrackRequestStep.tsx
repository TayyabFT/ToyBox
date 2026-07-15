"use client";

import { useEffect, useState } from "react";
import { memberSourcingApi } from "@/api/memberSourcing.api";
import { mapSourcingTimeline } from "@/lib/memberSourcing";
import type { UiTimelineStep } from "@/lib/memberSourcing";
import { DotTimeline } from "../shared/requestFormUi";
import { ConciergeCard } from "../shared/ConciergeCard";
import {
  formatSourcingTrackingBudget,
  formatSourcingTrackingTitle,
} from "./sourcingOptions";
import type { VehicleSourcingDetailsFormState } from "./types";

// ── Skeleton loader ───────────────────────────────────────────────────────────

function TimelineSkeleton() {
  return (
    <div className="space-y-7 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
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

// ── Main component ────────────────────────────────────────────────────────────

type VehicleSourcingTrackRequestStepProps = {
  form: VehicleSourcingDetailsFormState;
  /** Null when navigating directly without a just-submitted request */
  requestId: string | null;
  referenceNumber: string;
  submittedDate: string;
};

export function VehicleSourcingTrackRequestStep({
  form,
  requestId,
  referenceNumber,
  submittedDate,
}: VehicleSourcingTrackRequestStepProps) {
  const [steps, setSteps] = useState<UiTimelineStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) {
      // No ID available — show static fallback skeleton steps
      setSteps(mapSourcingTimeline([]));
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setFetchError(null);

    memberSourcingApi
      .getStatus(requestId)
      .then((res) => {
        if (cancelled) return;
        setSteps(mapSourcingTimeline(res.data.timeline ?? []));
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          (err as { message?: string }).message ??
          "Could not load request status.";
        setFetchError(message);
        // Show fallback steps so the UI is never empty
        setSteps(mapSourcingTimeline([]));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [requestId]);

  const displayRef = referenceNumber || "—";
  const displayDate = submittedDate || "—";

  return (
    <div className="space-y-6">
      {/* Request header card */}
      <div className="overflow-hidden rounded-2xl border border-accent/12 garage-review-card px-4 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-roboto text-[12px] font-bold tracking-[0.05em] text-foreground uppercase">
              {formatSourcingTrackingTitle(form.make, form.model)}
            </p>
            <p className="font-roboto mt-1 text-[10px] tracking-[0.08em] text-secondary uppercase">
              {displayRef}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="font-roboto text-[11px] text-secondary">
              {displayDate ? `Submitted ${displayDate}` : ""}
            </p>
            <p className="font-roboto mt-0.5 text-[12px] font-semibold text-primary">
              {formatSourcingTrackingBudget(form.budget)}
            </p>
          </div>
        </div>
      </div>

      {/* Progress timeline */}
      <div>
        <p className="font-roboto mb-3 text-[10px] font-medium tracking-[0.18em] text-section-label uppercase">
          Progress
        </p>

        {isLoading ? (
          <TimelineSkeleton />
        ) : (
          <>
            {fetchError ? (
              <p className="font-roboto mb-3 text-[11px] text-pink">
                {fetchError}
              </p>
            ) : null}
            <DotTimeline steps={steps} />
          </>
        )}
      </div>

      {/* Assigned manager */}
      <ConciergeCard
        sectionLabel="Your Manager"
        name="James Alderton"
        initials="JA"
        subtitle="Acquisition Manager · Available now"
      />
    </div>
  );
}
