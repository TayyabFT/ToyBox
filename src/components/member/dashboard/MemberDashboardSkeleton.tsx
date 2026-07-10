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
      className="space-y-6 p-8"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      {/* Greeting */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-56" />
        <Skeleton className="h-9 w-80" />
      </div>

      {/* Hero row: membership card + club banner */}
      <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-2">
        <Skeleton className="h-[280px] w-full rounded-[20px]" />
        <Skeleton className="h-[280px] w-full rounded-[20px]" />
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="space-y-3 rounded-xl border border-accent/10 bg-card p-5"
          >
            <Skeleton className="size-10 rounded-xl" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-xl border border-accent/10 bg-card px-4 py-4"
          >
            <Skeleton className="size-10 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Collection + Diary */}
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
          <Skeleton className="h-[240px] w-full rounded-[18px]" />
          <div className="space-y-2.5">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>

      {/* The Club venues */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-56 w-full rounded-2xl" />
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
