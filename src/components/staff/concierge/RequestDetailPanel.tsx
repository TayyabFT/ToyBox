"use client";

import { ActivityCheck, Phone } from "@/components/common/Svgs";
import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import { ArrivalPrepChecklist } from "./ArrivalPrepChecklist";
import { LogisticsSummary } from "./LogisticsSummary";
import type { ConciergeRequestDetail } from "./types";

type RequestDetailPanelProps = {
  detail: ConciergeRequestDetail;
  loading?: boolean;
  onToggleChecklistItem?: (id: string) => void;
};

export function RequestDetailPanel({
  detail,
  loading = false,
  onToggleChecklistItem,
}: RequestDetailPanelProps) {
  if (loading) {
    return (
      <section
        className="rounded-2xl border border-accent/10 bg-surface p-5"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="mb-5 flex items-center gap-4 border-b border-accent/6 pb-5">
          <ShimmerBlock className="size-12 shrink-0 rounded-full" />
          <div className="space-y-2">
            <ShimmerBlock className="h-3.5 w-32" />
            <ShimmerBlock className="h-2.5 w-40" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {Array.from({ length: 2 }, (_, groupIndex) => (
            <div key={groupIndex} className="space-y-3">
              <ShimmerBlock className="h-3 w-28" />
              {Array.from({ length: 3 }, (_, rowIndex) => (
                <ShimmerBlock key={rowIndex} className="h-8 w-full rounded-lg" />
              ))}
            </div>
          ))}
        </div>
      </section>
    );
  }
  return (
    <section className="rounded-2xl border border-accent/10 bg-surface p-5">
      <div className="mb-5 flex flex-col gap-4 border-b border-accent/6 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-gold-bright to-gold-deep font-medium uppercase text-dark">
            {detail.memberInitial}
          </span>

          <div className="space-y-1">
            <h2 className="font-roboto text-[15px] font-medium tracking-[0.02em] text-foreground">
              {detail.memberName}
            </h2>
            <p className="font-roboto text-[10px] tracking-[0.08em] uppercase">
              <span className="text-teal">{detail.memberStatus}</span>
              <span className="text-secondary">
                {" "}
                · {detail.memberTier} · {detail.memberId}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="font-roboto cursor-pointer rounded-lg border border-accent/10 bg-card px-4 py-2 text-[10px] font-medium tracking-[0.1em] text-primary uppercase transition-colors hover:border-primary/35"
          >
            View Profile
          </button>
          <button
            type="button"
            className="font-roboto flex cursor-pointer items-center gap-2 rounded-lg border border-accent/10 bg-card px-4 py-2 text-[10px] font-medium tracking-[0.1em] text-primary uppercase transition-colors hover:border-primary/35"
          >
            <Phone />
            Call Member
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ArrivalPrepChecklist
          items={detail.checklist}
          onToggle={onToggleChecklistItem}
        />
        <LogisticsSummary items={detail.logistics} />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          className="font-roboto flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-gold-bright to-primary px-6 py-3 text-[11px] font-semibold tracking-[0.12em] text-dark uppercase"
        >
          <ActivityCheck color="var(--dark)" />
          Mark Ready
        </button>
      </div>
    </section>
  );
}
