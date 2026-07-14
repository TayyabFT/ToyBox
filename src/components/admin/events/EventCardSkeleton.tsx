import { ShimmerBlock } from "@/components/common/ShimmerBlock";

const SKELETON_CARD_COUNT = 4;

function EventCardSkeletonItem() {
  return (
    <article className="overflow-hidden rounded-2xl border border-accent/12 bg-card">
      <div className="relative h-48 w-full">
        <ShimmerBlock className="h-full w-full rounded-none" />
        <ShimmerBlock className="absolute top-4 left-4 h-6 w-24 rounded-full" />
        <ShimmerBlock className="absolute right-4 bottom-4 h-6 w-28 rounded-full" />
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <ShimmerBlock className="h-2.5 w-40" />
          <ShimmerBlock className="h-5 w-3/4" />
        </div>

        <ShimmerBlock className="h-1 w-full rounded-full" />

        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-4">
            <ShimmerBlock className="h-3 w-16" />
            <ShimmerBlock className="h-3 w-16" />
          </div>
          <ShimmerBlock className="h-7 w-20 rounded-full" />
        </div>
      </div>
    </article>
  );
}

function FiltersSkeleton() {
  const widths = ["w-14", "w-24", "w-20", "w-16"];

  return (
    <div className="flex flex-wrap gap-2" aria-hidden="true">
      {widths.map((width, index) => (
        <ShimmerBlock key={index} className={`h-8 rounded-full ${width}`} />
      ))}
    </div>
  );
}

export function EventCardSkeletonGrid() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading events">
      <FiltersSkeleton />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
          <EventCardSkeletonItem key={index} />
        ))}
      </div>
    </div>
  );
}
