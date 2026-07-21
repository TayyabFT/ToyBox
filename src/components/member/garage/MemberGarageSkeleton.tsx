import { Skeleton } from "@/components/common/Skeleton";

// ─── Garage Card Skeleton (single card) ───────────────────────────────────────

function GarageCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-accent/10 bg-card">
      {/* Image area */}
      <Skeleton className="h-[180px] sm:h-[220px] w-full rounded-none" />

      <div className="space-y-3 sm:space-y-4 p-4 sm:p-5">
        {/* Title + detail */}
        <div className="space-y-2">
          <Skeleton className="h-4 sm:h-5 w-40 sm:w-48" />
          <Skeleton className="h-3 w-28 sm:w-32" />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-1.5 sm:space-y-2">
              <Skeleton className="h-5 sm:h-6 w-10 sm:w-12" />
              <Skeleton className="h-2 sm:h-2.5 w-12 sm:w-16" />
            </div>
          ))}
        </div>

        {/* Footer: last inspected + details button */}
        <div className="flex items-end justify-between gap-3 border-t border-accent/10 pt-3 sm:pt-4">
          <div className="space-y-1.5">
            <Skeleton className="h-2.5 w-20 sm:w-24" />
            <Skeleton className="h-3 sm:h-3.5 w-28 sm:w-32" />
          </div>
          <Skeleton className="h-8 w-16 sm:w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ─── Cards-only skeleton (used when switching filters) ────────────────────────

export function MemberGarageCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <GarageCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Full Garage List Page Skeleton ───────────────────────────────────────────

export function MemberGarageSkeleton() {
  return (
    <div
      className="space-y-5 sm:space-y-6 p-4 sm:p-6 lg:p-8 animate-pulse"
      aria-busy="true"
      aria-label="Loading garage"
    >
      {/* Header: eyebrow + title + button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-7 sm:h-9 w-24 sm:w-32" />
        </div>
        <Skeleton className="h-10 w-full sm:w-36 rounded-full" />
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-16 sm:w-20 rounded-full" />
        ))}
      </div>

      {/* Vehicle cards grid */}
      <MemberGarageCardsSkeleton />
    </div>
  );
}

// ─── Vehicle Detail Page Skeleton ─────────────────────────────────────────────

function VehicleHeroCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-accent/10 bg-card">
      <Skeleton className="h-[200px] sm:h-[240px] w-full rounded-none" />

      <div className="space-y-3 sm:space-y-4 p-4 sm:p-5">
        {/* Name + detail */}
        <div className="space-y-2">
          <Skeleton className="h-4 sm:h-5 w-44 sm:w-52" />
          <Skeleton className="h-3 w-28 sm:w-36" />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 rounded-lg bg-accent/10 p-3 sm:p-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-1.5 sm:space-y-2">
              <Skeleton className="h-5 sm:h-6 w-8 sm:w-10" />
              <Skeleton className="h-2 sm:h-2.5 w-10 sm:w-12" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between gap-3 border-t border-accent/10 pt-3 sm:pt-4">
          <div className="space-y-1.5">
            <Skeleton className="h-2.5 w-20 sm:w-24" />
            <Skeleton className="h-3 sm:h-3.5 w-28 sm:w-32" />
          </div>
          <Skeleton className="h-8 w-28 sm:w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function VehicleRequestsCardSkeleton() {
  return (
    <div className="rounded-2xl border border-accent/10 bg-card p-5">
      <Skeleton className="h-5 w-40" />

      <div className="mt-4 space-y-2.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl bg-dark px-4 py-3.5"
          >
            <Skeleton className="size-9 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-36" />
              <Skeleton className="h-2.5 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VehicleSpecsCardSkeleton() {
  return (
    <div className="rounded-2xl border border-accent/10 bg-card p-5">
      <Skeleton className="h-5 w-36" />

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, col) => (
          <div key={col} className="rounded-lg border border-accent/10 p-4">
            <Skeleton className="mb-3 h-2.5 w-24" />
            <div className="divide-y divide-accent/8">
              {Array.from({ length: col === 0 ? 9 : 6 }).map((_, row) => (
                <div
                  key={row}
                  className="flex items-center justify-between gap-4 py-2.5"
                >
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VehicleHealthCardSkeleton() {
  return (
    <div className="rounded-2xl border border-accent/10 bg-card p-5">
      <Skeleton className="h-5 w-36" />

      <div className="mt-5 space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3.5 w-10" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>

      <Skeleton className="mt-6 h-12 w-full rounded-xl" />
    </div>
  );
}

export function MemberVehicleDetailSkeleton() {
  return (
    <div
      className="space-y-5 sm:space-y-6 p-4 sm:p-6 lg:p-8 animate-pulse"
      aria-busy="true"
      aria-label="Loading vehicle details"
    >
      {/* Detail page header: back link + title + button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-3 w-12" />
          <div className="space-y-1.5">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-6 sm:h-7 w-32 sm:w-48" />
          </div>
        </div>
        <Skeleton className="h-10 w-full sm:w-36 rounded-full" />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-5 sm:gap-6 xl:grid-cols-2">
        {/* Left column */}
        <div className="space-y-5 sm:space-y-6">
          <VehicleHeroCardSkeleton />
          <VehicleRequestsCardSkeleton />
        </div>

        {/* Right column */}
        <div className="space-y-5 sm:space-y-6">
          <VehicleSpecsCardSkeleton />
          <VehicleHealthCardSkeleton />
        </div>
      </div>
    </div>
  );
}
