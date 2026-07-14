import { ShimmerBlock } from "@/components/common/ShimmerBlock";

export function ServiceJobCardSkeleton() {
  return (
    <div className="rounded-xl border border-accent/10 bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <ShimmerBlock className="h-3.5 w-40" />
          <ShimmerBlock className="h-2.5 w-56" />
        </div>
        <ShimmerBlock className="h-6 w-16 rounded-full" />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <ShimmerBlock className="h-2.5 w-28" />
        <ShimmerBlock className="h-7 w-20 rounded-full" />
      </div>
    </div>
  );
}

type ServiceJobListSkeletonProps = {
  count?: number;
};

export function ServiceJobListSkeleton({
  count = 3,
}: ServiceJobListSkeletonProps) {
  return (
    <div className="mt-4 space-y-3" aria-busy="true" aria-live="polite">
      {Array.from({ length: count }, (_, index) => (
        <ServiceJobCardSkeleton key={index} />
      ))}
    </div>
  );
}
