"use client";

import { ActivityCheck } from "@/components/common/Svgs";
import { AssigneeBadge, JobActionButton } from "./JobActionButton";
import { JobStatusBadge } from "./JobStatusBadge";
import type { ActiveJobDetail } from "./types";

type ActiveJobDetailPanelProps = {
  detail: ActiveJobDetail;
};

export function ActiveJobDetailPanel({ detail }: ActiveJobDetailPanelProps) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-[#D4A8471A] bg-surface p-5">
      <div className="-mx-5 mb-4 space-y-1 border-b border-[#D4A8470F] px-5 pb-4">
        <h3 className="font-copperplate text-sm font-normal tracking-[0.06em] text-primary uppercase">
          Active Job Detail
        </h3>
        <p className="font-roboto text-[9px] tracking-[0.1em] text-secondary uppercase">
          {detail.jobId} · My current assignment
        </p>
      </div>

      <div className="flex flex-1 flex-col space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="font-roboto text-[10px] tracking-[0.12em] text-secondary uppercase">
              {detail.categoryLabel}
            </p>
          </div>
          <JobStatusBadge label={detail.statusLabel} tone={detail.statusTone} />
        </div>

        <div className="space-y-2">
          <h4 className="font-copperplate text-lg leading-tight text-foreground uppercase">
            {detail.vehicle}
          </h4>
          <p className="font-roboto text-[10px] tracking-[0.04em] text-secondary">
            {detail.subtitle}
          </p>
          <AssigneeBadge label={detail.assignee} />
        </div>

        <div className="space-y-3 rounded-xl border border-[#D4A8471A] bg-card p-4">
          <div className="space-y-1">
            <p className="font-roboto text-[9px] tracking-[0.12em] text-primary uppercase">
              {detail.pickup.label}
            </p>
            <p className="font-roboto text-[10px] tracking-[0.03em] text-foreground">
              {detail.pickup.detail}
            </p>
          </div>

          <div className="flex justify-center py-1">
            <span className="font-roboto text-[10px] text-secondary">↓</span>
          </div>

          <div className="space-y-1">
            <p className="font-roboto text-[9px] tracking-[0.12em] text-primary uppercase">
              {detail.dropoff.label}
            </p>
            <p className="font-roboto text-[10px] tracking-[0.03em] text-foreground">
              {detail.dropoff.detail}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h5 className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
            Job Steps
          </h5>
          <div className="space-y-2.5">
            {detail.steps.map((step) => (
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
                {step.time && (
                  <span className="font-roboto shrink-0 text-[9px] tracking-[0.06em] text-teal uppercase">
                    {step.time}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h5 className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
            Special Instructions
          </h5>
          <div className="rounded-xl border border-[#D4A8471A] bg-card p-4">
            <p className="font-roboto text-[11px] leading-relaxed tracking-[0.02em] text-secondary italic">
              &ldquo;{detail.specialInstructions}&rdquo;
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          <JobActionButton
            label="Add Photo"
            className="inline-flex items-center gap-2"
          />
          <JobActionButton
            label="Add Note"
            className="inline-flex items-center gap-2"
          />
          <JobActionButton label="Mark Complete" variant="gold" />
        </div>
      </div>
    </section>
  );
}
