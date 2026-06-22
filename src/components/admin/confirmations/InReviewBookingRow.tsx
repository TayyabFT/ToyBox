import { ConfirmationStatusBadge } from "./ConfirmationStatusBadge";
import {
  confirmationCardClass,
  confirmationInReviewRowTitleClass,
  confirmationRowMetaClass,
} from "./panelStyles";
import type { InReviewBooking } from "./types";

type InReviewBookingRowProps = {
  booking: InReviewBooking;
};

export function InReviewBookingRow({ booking }: InReviewBookingRowProps) {
  return (
    <div className={`${confirmationCardClass} flex items-center gap-4`}>
      <div className="min-w-0 flex-1 space-y-1">
        <p className={confirmationInReviewRowTitleClass}>{booking.vehicle}</p>
        <p className={confirmationRowMetaClass}>
          {booking.member} · {booking.schedule}
        </p>
      </div>

      <ConfirmationStatusBadge tone="in-review" />
    </div>
  );
}
