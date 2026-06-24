export function StatValueShimmer() {
  return (
    <div className="relative h-[42px] w-16 overflow-hidden rounded bg-accent/8">
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-accent/14 to-transparent" />
    </div>
  );
}
