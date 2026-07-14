type ShimmerBlockProps = {
  /** Sizing/shape utilities (height, width, rounding, etc). May also override the base background. */
  className?: string;
  /** Overrides the moving highlight color of the sweep, e.g. "via-zinc-600/30". Defaults to the accent tone. */
  sweepClassName?: string;
};

/**
 * The single shared shimmer primitive for skeleton/loading placeholders.
 * Compose it (don't reimplement the shimmer animation) wherever a page or
 * popup needs a loading placeholder — pass sizing via `className`.
 */
export function ShimmerBlock({
  className = "",
  sweepClassName = "via-accent/14",
}: ShimmerBlockProps) {
  return (
    <span
      className={`relative block overflow-hidden rounded bg-accent/8 ${className}`}
      aria-hidden="true"
    >
      <span
        className={`absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent to-transparent ${sweepClassName}`}
      />
    </span>
  );
}
