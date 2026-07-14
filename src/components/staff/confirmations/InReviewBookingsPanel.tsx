import { ConfirmationScrollableList } from "./ConfirmationScrollableList";
import { InReviewRequestRow } from "./InReviewRequestRow";
import type { ConfirmationRequestItem } from "./types";

type InReviewBookingsPanelProps = {
  requests: ConfirmationRequestItem[];
  pendingCount: number;
  loading?: boolean;
};

export function InReviewBookingsPanel({
  requests,
  pendingCount,
  loading = false,
}: InReviewBookingsPanelProps) {
  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-accent/12 bg-card p-5">
      <div className="mb-5 flex shrink-0 items-center gap-3">
        <h2 className="text-[13px] uppercase text-secondary">
          In Review Bookings
        </h2>
        <span className="font-roboto rounded-full border border-badge-warm/28 bg-badge-warm/10 px-2.5 py-1 text-[10px] font-medium tracking-[0.08em] text-badge-warm uppercase">
          {pendingCount} Pending
        </span>
      </div>

      <ConfirmationScrollableList
        items={requests}
        loading={loading}
        emptyText="No in-review bookings"
        listClassName="space-y-3 pr-1"
        renderItem={(request) => <InReviewRequestRow request={request} />}
        getItemKey={(request) => request.id}
      />
    </section>
  );
}
