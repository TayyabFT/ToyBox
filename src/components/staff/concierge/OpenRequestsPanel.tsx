import { SectionHeader } from "@/components/staff/overview/SectionHeader";
import { OpenRequestRow } from "./OpenRequestRow";
import type { ConciergeOpenRequest } from "./types";

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
    <section className="rounded-2xl border border-[#D4A8471A] bg-[#11100C] overflow-hidden">
      <div className="pt-5 px-5">
        <SectionHeader
          title="Open Requests"
          badge={{ label: `${activeCount} active`, tone: "gold" }}
        />
      </div>

      <div className="overflow-hidden bg-card">
        {loading ? (
          <p className="font-roboto px-4 py-8 text-center text-[11px] tracking-[0.06em] text-secondary uppercase">
            Loading...
          </p>
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
