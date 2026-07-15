import { OpenRequestRow } from "./OpenRequestRow";
import {
  conciergeActiveBadgeClass,
  conciergeListPanelClass,
  conciergeSectionLabelClass,
} from "./panelStyles";
import type { ConciergeOpenRequest } from "./types";

type OpenRequestsPanelProps = {
  requests: ConciergeOpenRequest[];
  activeCount: number;
  selectedId: string;
  onSelect: (id: string) => void;
};

export function OpenRequestsPanel({
  requests,
  activeCount,
  selectedId,
  onSelect,
}: OpenRequestsPanelProps) {
  return (
    <section className={conciergeListPanelClass}>
      <div className="flex items-center justify-between border-b border-accent/8 px-5 py-4">
        <h2 className={conciergeSectionLabelClass}>Open Requests</h2>
        <span className={conciergeActiveBadgeClass}>{activeCount} Active</span>
      </div>

      <div>
        {requests.length > 0 ? (
          requests.map((request) => (
            <OpenRequestRow
              key={request.id}
              request={request}
              selected={request.id === selectedId}
              onSelect={() => onSelect(request.id)}
            />
          ))
        ) : (
          <p className="font-roboto px-5 py-10 text-center text-[10px] tracking-[0.06em] text-secondary uppercase">
            No requests found
          </p>
        )}
      </div>
    </section>
  );
}
