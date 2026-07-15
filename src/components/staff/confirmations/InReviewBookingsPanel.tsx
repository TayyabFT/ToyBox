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
    <section className="space-y-4">
      <div className="space-y-2">
        <h2 className="font-copperplate text-[18px]">
          <span className="text-foreground">In Review</span>{" "}
          <span className="text-primary">Bookings</span>
        </h2>
        <p className="font-roboto text-[10px] tracking-[0.08em] text-secondary uppercase">
          {pendingCount} Booking{pendingCount === 1 ? "" : "s"} Pending Review
        </p>
      </div>

      <div className="flex flex-col overflow-hidden rounded-2xl border border-accent/10 bg-card p-5">
        <ConfirmationScrollableList
          items={requests}
          loading={loading}
          emptyText="No in-review bookings"
          listClassName="space-y-3 pr-1"
          renderItem={(request) => <InReviewRequestRow request={request} />}
          getItemKey={(request) => request.id}
        />
      </div>
    </section>
  );
}
