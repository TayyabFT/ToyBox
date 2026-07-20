"use client";

import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import { ActivityCheck } from "@/components/common/Svgs";
import { AssigneeBadge } from "@/components/shared/service-requests/JobActionButton";
import { JobProgressBar } from "@/components/shared/service-requests/JobProgressBar";
import { JobStatusBadge } from "@/components/shared/service-requests/JobStatusBadge";
import type { StaffActiveJobView } from "@/lib/staffJobs";

type AdminJobDetailModalProps = {
  open: boolean;
  job: StaffActiveJobView | null;
  loading?: boolean;
  onClose: () => void;
};

export function AdminJobDetailModal({
  open,
  job,
  loading = false,
  onClose,
}: AdminJobDetailModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="Custom__Scrollbar relative z-10 max-h-[85vh] w-full max-w-[560px] overflow-y-auto rounded-[24px] border border-accent/25 bg-card p-6 shadow-[var(--shadow-modal)]">
        <div className="mb-4 flex items-start justify-between gap-4 border-b border-accent/10 pb-4">
          <div className="space-y-1">
            <h3 className="font-copperplate text-sm font-normal tracking-[0.06em] text-primary uppercase">
              Active Job Detail
            </h3>
            <p className="font-roboto text-[9px] tracking-[0.1em] text-secondary uppercase">
              {job ? `${job.jobId} · ${job.referenceType}` : "Loading..."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close job detail"
            className="font-roboto flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-accent/20 bg-input-muted text-secondary transition-colors hover:border-accent/35 hover:text-foreground"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {loading || !job ? (
          <div className="space-y-4" aria-busy="true" aria-live="polite">
            <ShimmerBlock className="h-5 w-40" />
            <ShimmerBlock className="h-2.5 w-32" />
            <ShimmerBlock className="h-24 w-full rounded-xl" />
            <ShimmerBlock className="h-24 w-full rounded-xl" />
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-3">
              <p className="font-roboto text-[10px] tracking-[0.12em] text-secondary uppercase">
                {job.categoryLabel}
              </p>
              <JobStatusBadge label={job.statusLabel} tone={job.statusTone} />
            </div>

            <div className="space-y-2">
              <h4 className="font-copperplate text-lg leading-tight text-foreground uppercase">
                {job.vehicle}
              </h4>
              <p className="font-roboto text-[10px] tracking-[0.04em] text-secondary">
                {job.subtitle}
              </p>
              <AssigneeBadge label={job.assignee} />
            </div>

            {job.queueStatus === "in_progress" ? (
              <JobProgressBar
                value={job.progressPercent}
                tone="gold"
                note={
                  job.progressNote ??
                  (typeof job.remainingMinutes === "number"
                    ? `${job.remainingMinutes} min remaining`
                    : `${job.progressPercent}% elapsed`)
                }
              />
            ) : null}

            {job.pickup || job.dropoff ? (
              <div className="space-y-3 rounded-xl border border-[#D4A8471A] bg-input-muted p-4">
                {job.pickup ? (
                  <div className="space-y-1">
                    <p className="font-roboto text-[9px] tracking-[0.12em] text-primary uppercase">
                      {job.pickup.label}
                    </p>
                    <p className="font-roboto text-[10px] tracking-[0.03em] text-foreground">
                      {job.pickup.detail}
                    </p>
                  </div>
                ) : null}

                {job.pickup && job.dropoff ? (
                  <div className="flex justify-center py-1">
                    <span className="font-roboto text-[10px] text-secondary">
                      ↓
                    </span>
                  </div>
                ) : null}

                {job.dropoff ? (
                  <div className="space-y-1">
                    <p className="font-roboto text-[9px] tracking-[0.12em] text-primary uppercase">
                      {job.dropoff.label}
                    </p>
                    <p className="font-roboto text-[10px] tracking-[0.03em] text-foreground">
                      {job.dropoff.detail}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}

            {job.steps.length > 0 ? (
              <div className="space-y-3">
                <h5 className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
                  Job Steps
                </h5>
                <div className="space-y-2.5">
                  {job.steps.map((step) => (
                    <div key={step.id} className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border ${
                          step.completed
                            ? "border-teal/40 bg-teal/10"
                            : "border-secondary/30 bg-transparent"
                        }`}
                      >
                        {step.completed && (
                          <ActivityCheck color="var(--teal)" className="size-2.5" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`font-roboto text-[11px] tracking-[0.03em] ${
                            step.completed
                              ? "text-secondary line-through"
                              : "text-foreground"
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                      {step.time ? (
                        <span className="font-roboto shrink-0 text-[9px] tracking-[0.06em] text-teal uppercase">
                          {step.time}
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {job.timeline.length > 0 ? (
              <div className="space-y-2">
                <h5 className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
                  Timeline
                </h5>
                <div className="space-y-2">
                  {job.timeline.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-start justify-between gap-3 rounded-xl border border-accent/12 bg-input-muted px-3 py-2"
                    >
                      <p className="font-roboto text-[11px] text-foreground">
                        {item.label}
                      </p>
                      <span className="font-roboto shrink-0 text-[9px] tracking-[0.06em] text-secondary uppercase">
                        {item.completedAt || item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {job.specialInstructions ? (
              <div className="space-y-2">
                <h5 className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
                  Special Instructions
                </h5>
                <div className="rounded-xl border border-[#D4A8471A] bg-input-muted p-4">
                  <p className="font-roboto text-[11px] leading-relaxed tracking-[0.02em] text-secondary italic">
                    &ldquo;{job.specialInstructions}&rdquo;
                  </p>
                </div>
              </div>
            ) : null}

            {job.notes.length > 0 ? (
              <div className="space-y-2">
                <h5 className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
                  Staff Notes
                </h5>
                <div className="space-y-2">
                  {job.notes.map((note) => (
                    <div
                      key={note.id}
                      className="rounded-xl border border-accent/12 bg-input-muted p-3"
                    >
                      <p className="font-roboto text-[11px] text-foreground">
                        {note.text}
                      </p>
                      {note.createdAt ? (
                        <p className="font-roboto mt-1 text-[9px] text-secondary uppercase">
                          {note.author ? `${note.author} · ` : ""}
                          {note.createdAt}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {job.photos.length > 0 ? (
              <div className="space-y-2">
                <h5 className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
                  Job Photos
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  {job.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="overflow-hidden rounded-xl border border-accent/12 bg-input-muted"
                    >
                      {photo.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photo.url}
                          alt={photo.caption || "Job photo"}
                          className="h-24 w-full object-cover"
                        />
                      ) : null}
                      {photo.caption ? (
                        <p className="font-roboto px-3 py-2 text-[10px] text-secondary">
                          {photo.caption}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
