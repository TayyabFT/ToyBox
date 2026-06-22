import { InReviewBookingRow } from "./InReviewBookingRow";
import {
  confirmationInReviewPanelClass,
  confirmationInReviewTitleClass,
  confirmationPendingBadgeClass,
} from "./panelStyles";
import type { InReviewBooking } from "./types";

type InReviewBookingsPanelProps = {
  bookings: InReviewBooking[];
  pendingCount: number;
  loading?: boolean;
};

export function InReviewBookingsPanel({
  bookings,
  pendingCount,
  loading = false,
}: InReviewBookingsPanelProps) {
  return (
    <section className={confirmationInReviewPanelClass}>
      <div className="mb-4 flex items-center gap-3 border-b border-[#1E1A14] pb-4">
        <h2 className={confirmationInReviewTitleClass}>In Review Bookings</h2>
        <span className={confirmationPendingBadgeClass}>{pendingCount} Pending</span>
      </div>

      <div className="space-y-3">
        {loading ? (
          <p className="font-roboto py-6 text-center text-[11px] tracking-[0.06em] text-[#8A8378] uppercase">
            Loading...
          </p>
        ) : bookings.length > 0 ? (
          bookings.map((booking) => (
            <InReviewBookingRow key={booking.id} booking={booking} />
          ))
        ) : (
          <p className="font-roboto py-6 text-center text-[11px] tracking-[0.06em] text-[#8A8378] uppercase">
            No in-review bookings
          </p>
        )}
      </div>
    </section>
  );
}
