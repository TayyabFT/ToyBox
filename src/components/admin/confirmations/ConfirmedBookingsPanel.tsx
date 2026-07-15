import { BookingRow } from "./BookingRow";
import { ConfirmationRowSkeletonList } from "./ConfirmationRowSkeleton";
import { ConfirmationsOutsideHeader } from "./ConfirmationsSectionHeader";
import { confirmationInnerClass } from "./panelStyles";
import type { BookingItem } from "./types";

type ConfirmedBookingsPanelProps = {
  bookings: BookingItem[];
  loading?: boolean;
};

export function ConfirmedBookingsPanel({
  bookings,
  loading = false,
}: ConfirmedBookingsPanelProps) {
  return (
    <div>
      <ConfirmationsOutsideHeader
        titleSplit={{ before: "Confirmed", after: "Booking" }}
        subtitle="Vehicles Ready For Member Collection"
      />

      <section className={confirmationInnerClass}>
        {loading ? (
          <ConfirmationRowSkeletonList withIcon={false} />
        ) : bookings.length > 0 ? (
          bookings.map((booking) => (
            <BookingRow key={booking.id} booking={booking} />
          ))
        ) : (
          <p className="font-roboto py-6 text-center text-[11px] tracking-[0.06em] text-section-label uppercase">
            No confirmed bookings
          </p>
        )}
      </section>
    </div>
  );
}
