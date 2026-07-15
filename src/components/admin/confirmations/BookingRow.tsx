import { ConfirmationStatusBadge } from "./ConfirmationStatusBadge";
import { confirmationRowMetaClass, confirmationRowTitleClass } from "./panelStyles";
import type { BookingItem } from "./types";

type BookingRowProps = {
  booking: BookingItem;
};

export function BookingRow({ booking }: BookingRowProps) {
  return (
    <div className="flex items-center gap-4 border-b border-accent/8 py-4 last:border-b-0">
      <div className="min-w-0 flex-1 space-y-1">
        <p className={confirmationRowTitleClass}>{booking.vehicle}</p>
        <p className={confirmationRowMetaClass}>
          {booking.reference} · {booking.member} · {booking.schedule}
        </p>
      </div>

      <div className="shrink-0">
        <ConfirmationStatusBadge tone={booking.status} />
      </div>
    </div>
  );
}
