import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import { SectionHeader } from "@/components/staff/overview/SectionHeader";
import { OpenRequestRow } from "./OpenRequestRow";
import type { ConciergeOpenRequest } from "./types";

function OpenRequestRowSkeleton() {
  return (
    <div className="flex items-center gap-3 border-b border-accent/6 px-4 py-3 last:border-b-0">
      <ShimmerBlock className="size-12 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <ShimmerBlock className="h-3 w-28" />
        <ShimmerBlock className="h-2.5 w-36" />
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <ShimmerBlock className="h-2.5 w-10" />
        <ShimmerBlock className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}

type OpenRequestsPanelProps = {
  requests: ConciergeOpenRequest[];
  activeCount: number;
  selectedId: string;
  loading?: boolean;
  onSelect: (id: string) => void;
};

export function OpenRequestsPanel({
  requests,
  activeCount,
  selectedId,
  loading = false,
  onSelect,
}: OpenRequestsPanelProps) {
  return (
    <section className="rounded-2xl border border-accent/10 bg-card overflow-hidden">
      <div className="pt-5 px-5">
        <SectionHeader
          title="Open Requests"
          badge={{ label: `${activeCount} active`, tone: "gold" }}
        />
      </div>

      <div className="overflow-hidden bg-card">
        {loading ? (
          <div aria-busy="true" aria-live="polite">
            {Array.from({ length: 4 }, (_, index) => (
              <OpenRequestRowSkeleton key={index} />
            ))}
          </div>
        ) : requests.length > 0 ? (
          requests.map((request) => (
            <OpenRequestRow
              key={request.id}
              request={request}
              selected={request.id === selectedId}
              onSelect={() => onSelect(request.id)}
            />
          ))
        ) : (
          <p className="font-roboto px-4 py-8 text-center text-[11px] tracking-[0.06em] text-secondary uppercase">
            No requests found
          </p>
        )}
      </div>
    </section>
  );
}
