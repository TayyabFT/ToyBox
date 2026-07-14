import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import { overviewPanelClass } from "./panelStyles";

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-[var(--overview-border)] bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-3">
          <ShimmerBlock className="h-2.5 w-24" />
          <ShimmerBlock className="h-9 w-16 rounded" />
          <ShimmerBlock className="h-2.5 w-20" />
        </div>
        <ShimmerBlock className="size-10 rounded-xl" />
      </div>
    </div>
  );
}

function PanelRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-accent/8 py-4 last:border-b-0">
      <div className="min-w-0 flex-1 space-y-2">
        <ShimmerBlock className="h-3 w-28" />
        <ShimmerBlock className="h-2.5 w-40" />
      </div>
      <ShimmerBlock className="h-7 w-16 rounded-full" />
    </div>
  );
}

function SectionSkeleton({
  rows = 4,
  heightClass = "h-95",
  withOutsideHeader = true,
}: {
  rows?: number;
  heightClass?: string;
  withOutsideHeader?: boolean;
}) {
  return (
    <div>
      {withOutsideHeader ? (
        <div className="mb-3 space-y-2">
          <ShimmerBlock className="h-4 w-40" />
          <ShimmerBlock className="h-2.5 w-28" />
        </div>
      ) : null}
      <section className={`${overviewPanelClass} flex flex-col ${heightClass}`}>
        {!withOutsideHeader ? (
          <div className="mb-4 flex items-center justify-between border-b border-accent/8 pb-3">
            <ShimmerBlock className="h-4 w-36" />
            <ShimmerBlock className="h-3 w-8" />
          </div>
        ) : null}
        <div className="flex-1">
          {Array.from({ length: rows }, (_, index) => (
            <PanelRowSkeleton key={index} />
          ))}
        </div>
      </section>
    </div>
  );
}

export function OverviewPageSkeleton() {
  return (
    <div className="space-y-7 p-8" aria-busy="true" aria-live="polite">
      <div className="space-y-2">
        <ShimmerBlock className="h-3 w-40" />
        <ShimmerBlock className="h-8 w-64" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <div className="flex w-full min-w-0 flex-col gap-6 xl:flex-[1.7]">
          <SectionSkeleton rows={4} heightClass="h-95" />
          <SectionSkeleton rows={5} heightClass="h-110" />
          <SectionSkeleton rows={5} heightClass="h-110" />
        </div>

        <div className="flex w-full min-w-0 flex-col gap-6 xl:flex-1">
          <SectionSkeleton
            rows={4}
            heightClass="h-105"
            withOutsideHeader={false}
          />
          <SectionSkeleton
            rows={5}
            heightClass="h-110"
            withOutsideHeader={false}
          />
          <SectionSkeleton
            rows={5}
            heightClass="h-110"
            withOutsideHeader={false}
          />
        </div>
      </div>
    </div>
  );
}
