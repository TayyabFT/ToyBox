const SKELETON_CARD_COUNT = 4;

function EventCardSkeletonItem() {
  return (
    <div
      className="flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-900 bg-[#121314]"
      aria-hidden="true"
    >
      <div className="relative h-48 w-full animate-pulse bg-zinc-800/70">
        <div className="absolute top-4 left-4 h-6 w-24 rounded-full bg-zinc-700/80" />
        <div className="absolute right-4 bottom-4 h-6 w-32 rounded-full bg-zinc-700/80" />
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="h-2.5 w-36 animate-pulse rounded bg-zinc-800" />
          <div className="h-5 w-4/5 animate-pulse rounded bg-zinc-800" />
        </div>

        <div className="h-1 w-full animate-pulse rounded-full bg-zinc-900" />

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-4">
            <div className="h-3 w-14 animate-pulse rounded bg-zinc-800" />
            <div className="h-3 w-14 animate-pulse rounded bg-zinc-800" />
          </div>
          <div className="h-7 w-20 animate-pulse rounded-full bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}

export function EventCardSkeletonGrid() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading events">
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-8 w-[88px] animate-pulse rounded-full bg-zinc-800"
            aria-hidden="true"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
          <EventCardSkeletonItem key={index} />
        ))}
      </div>
    </div>
  );
}
