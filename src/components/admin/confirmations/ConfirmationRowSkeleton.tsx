import { ShimmerBlock } from "@/components/common/ShimmerBlock";

type ConfirmationRowSkeletonProps = {
  withIcon?: boolean;
};

export function ConfirmationRowSkeleton({
  withIcon = true,
}: ConfirmationRowSkeletonProps) {
  return (
    <div className="flex items-center gap-4 border-b border-accent/8 py-4 last:border-b-0">
      {withIcon ? <ShimmerBlock className="size-9 shrink-0 rounded-lg" /> : null}
      <div className="min-w-0 flex-1 space-y-2">
        <ShimmerBlock className="h-3 w-32" />
        <ShimmerBlock className="h-2.5 w-48" />
      </div>
      <ShimmerBlock className="h-6 w-20 shrink-0 rounded-full" />
    </div>
  );
}

export function ConfirmationRowSkeletonList({
  count = 3,
  withIcon = true,
}: {
  count?: number;
  withIcon?: boolean;
}) {
  return (
    <div aria-busy="true" aria-live="polite">
      {Array.from({ length: count }, (_, index) => (
        <ConfirmationRowSkeleton key={index} withIcon={withIcon} />
      ))}
    </div>
  );
}
