type ShimmerBlockProps = {
  /** Sizing/shape utilities (height, width, rounding, etc). May also override the base background. */
  className?: string;
  /** Overrides the moving highlight color of the sweep, e.g. "via-zinc-600/30". Defaults to the theme-aware shimmer tone (visible in both dark and light mode). */
  sweepClassName?: string;
};

/**
 * The single shared shimmer primitive for skeleton/loading placeholders.
 * Compose it (don't reimplement the shimmer animation) wherever a page or
 * popup needs a loading placeholder — pass sizing via `className`.
 *
 * The base/sweep tones come from --shimmer-base/--shimmer-sweep (globals.css),
 * which are tuned per theme — a low accent tint reads fine on the near-black
 * dark surfaces, but needs a stronger, foreground-tinted mix to stay visible
 * on the light theme's pale cream surfaces.
 */
export function ShimmerBlock({
  className = "",
  sweepClassName = "via-[var(--shimmer-sweep)]",
}: ShimmerBlockProps) {
  return (
    <span
      className={`relative block overflow-hidden rounded bg-[var(--shimmer-base)] ${className}`}
      aria-hidden="true"
    >
      <span
        className={`absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent to-transparent ${sweepClassName}`}
      />
    </span>
  );
}
