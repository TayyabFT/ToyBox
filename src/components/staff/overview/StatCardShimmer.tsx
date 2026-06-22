export function StatValueShimmer() {
  return (
    <div className="relative h-[42px] w-16 overflow-hidden rounded bg-[#D4A84714]">
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-[#D4A84724] to-transparent" />
    </div>
  );
}
