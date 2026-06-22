import { BookingRow } from "./BookingRow";
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
          <p className="font-roboto py-6 text-center text-[11px] tracking-[0.06em] text-[#8A8378] uppercase">
            Loading...
          </p>
        ) : bookings.length > 0 ? (
          bookings.map((booking) => (
            <BookingRow key={booking.id} booking={booking} />
          ))
        ) : (
          <p className="font-roboto py-6 text-center text-[11px] tracking-[0.06em] text-[#8A8378] uppercase">
            No confirmed bookings
          </p>
        )}
      </section>
    </div>
  );
}
