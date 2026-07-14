import { ShimmerBlock } from "./ShimmerBlock";

type PageLoadingShimmerProps = {
  /** Tailwind height utility for the container, e.g. "min-h-[40vh]". */
  minHeightClassName?: string;
};

/** Shared full-page/section loading placeholder — compose with ShimmerBlock, don't reimplement it. */
export function PageLoadingShimmer({
  minHeightClassName = "min-h-[40vh]",
}: PageLoadingShimmerProps) {
  return (
    <div
      className={`flex ${minHeightClassName} flex-col items-center justify-center gap-3`}
      aria-busy="true"
      aria-live="polite"
    >
      <ShimmerBlock className="h-3 w-40 rounded-full" />
      <ShimmerBlock className="h-2.5 w-28 rounded-full" />
    </div>
  );
}
