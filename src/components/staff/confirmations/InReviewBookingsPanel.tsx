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
    <section className="rounded-2xl border border-accent/12 bg-card p-5">
      <div className="mb-5 flex items-center gap-3">
        <h2 className="text-[13px] uppercase text-secondary">
          In Review Bookings
        </h2>
        <span className="font-roboto rounded-full border border-badge-warm/28 bg-badge-warm/10 px-2.5 py-1 text-[10px] font-medium tracking-[0.08em] text-badge-warm uppercase">
          {pendingCount} Pending
        </span>
      </div>

      <div className="rounded-2xl space-y-3">
        {loading ? (
          <p className="font-roboto py-6 text-center text-[11px] tracking-[0.06em] text-secondary uppercase">
            Loading...
          </p>
        ) : requests.length > 0 ? (
          requests.map((request) => (
            <InReviewRequestRow key={request.id} request={request} />
          ))
        ) : (
          <p className="font-roboto py-6 text-center text-[11px] tracking-[0.06em] text-secondary uppercase">
            No in-review bookings
          </p>
        )}
      </div>
    </section>
  );
}
