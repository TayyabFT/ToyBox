import { ConfirmationsOutsideHeader } from "./ConfirmationsSectionHeader";
import { PendingBookingRow } from "./PendingBookingRow";
import { confirmationInnerClass } from "./panelStyles";
import type { PendingBookingItem } from "./types";

type PendingConfirmationsPanelProps = {
  bookings: PendingBookingItem[];
  pendingCount: number;
  loading?: boolean;
};

export function PendingConfirmationsPanel({
  bookings,
  pendingCount,
  loading = false,
}: PendingConfirmationsPanelProps) {
  return (
    <div>
      <ConfirmationsOutsideHeader
        titleSplit={{ before: "Pending", after: "Booking" }}
        subtitle={`${pendingCount} Booking${pendingCount === 1 ? "" : "s"} Require Your Confirmation Before Close-of-Shift`}
      />

      <section className={confirmationInnerClass}>
        {loading ? (
          <p className="font-roboto py-6 text-center text-[11px] tracking-[0.06em] text-[#8A8378] uppercase">
            Loading...
          </p>
        ) : bookings.length > 0 ? (
          bookings.map((booking) => (
            <PendingBookingRow key={booking.id} booking={booking} />
          ))
        ) : (
          <p className="font-roboto py-6 text-center text-[11px] tracking-[0.06em] text-[#8A8378] uppercase">
            No pending bookings
          </p>
        )}
      </section>
    </div>
  );
}
