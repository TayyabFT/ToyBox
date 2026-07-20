import { Skeleton } from "@/components/common/Skeleton";

function SectionHeaderSkeleton() {
  return (
    <div className="flex items-end justify-between">
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-8 w-20 rounded-full" />
    </div>
  );
}

export function MemberDashboardSkeleton() {
  return (
    <div
      className="space-y-5 px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      {/* Greeting */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-40 sm:w-56" />
        <Skeleton className="h-7 w-56 sm:h-9 sm:w-80" />
      </div>

      {/* Hero row: membership card + club banner */}
      <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Skeleton className="h-[240px] w-full rounded-[20px] sm:h-[280px]" />
        <Skeleton className="h-[200px] w-full rounded-[20px] sm:h-[240px]" />
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="space-y-3 rounded-xl border border-accent/10 bg-card p-4 sm:p-5"
          >
            <Skeleton className="size-9 rounded-xl sm:size-10" />
            <Skeleton className="h-6 w-14 sm:w-16" />
            <Skeleton className="h-3 w-20 sm:w-24" />
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-2.5 rounded-xl border border-accent/10 bg-card px-3 py-3.5 sm:gap-3 sm:px-4 sm:py-4"
          >
            <Skeleton className="size-10 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-16 sm:w-20" />
              <Skeleton className="h-2.5 w-12 sm:w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Collection + Diary */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <SectionHeaderSkeleton />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-[110px] w-full rounded-2xl sm:h-24" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <SectionHeaderSkeleton />
          <Skeleton className="h-[220px] w-full rounded-[18px] sm:h-[240px]" />
          <div className="space-y-2.5">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>

      {/* The Club venues */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-[240px] w-full rounded-2xl sm:h-[280px] md:h-56" />
        ))}
      </div>

      {/* News + Activity */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          <SectionHeaderSkeleton />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <SectionHeaderSkeleton />
          <div className="space-y-6 pl-0.5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex gap-4">
                <Skeleton className="mt-1 size-3.5 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-2.5 w-24" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-2.5 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
