/**
 * Skeleton placeholder shown while an active-request check is in flight.
 * Mirrors the approximate shape of a Details form so the modal doesn't jump
 * when the real content arrives.
 */
export function ModalLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-hidden="true">
      {/* Field block × 3 */}
      {[80, 100, 72].map((labelW, i) => (
        <div key={i} className="space-y-2.5">
          {/* Label */}
          <div
            className="h-2.5 rounded-full bg-accent/15"
            style={{ width: `${labelW}px` }}
          />
          {/* Row cards */}
          <div className="space-y-2">
            <div className="h-[52px] rounded-xl bg-accent/10" />
            <div className="h-[52px] rounded-xl bg-accent/10" />
          </div>
        </div>
      ))}

      {/* Date picker placeholder */}
      <div className="space-y-2.5">
        <div className="h-2.5 w-24 rounded-full bg-accent/15" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[56px] flex-1 rounded-xl bg-accent/10" />
          ))}
        </div>
      </div>

      {/* Textarea placeholder */}
      <div className="space-y-2.5">
        <div className="h-2.5 w-16 rounded-full bg-accent/15" />
        <div className="h-[86px] rounded-xl bg-accent/10" />
      </div>
    </div>
  );
}
