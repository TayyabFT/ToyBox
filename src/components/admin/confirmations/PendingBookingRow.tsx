import { ActivityCheck, StatCarIcon } from "@/components/common/Svgs";
import { ConfirmationStatusBadge } from "./ConfirmationStatusBadge";
import { confirmationRowMetaClass, confirmationRowTitleClass } from "./panelStyles";
import type { ConfirmationBadgeTone, PendingBookingItem } from "./types";

type PendingBookingRowProps = {
  booking: PendingBookingItem;
};

const iconToneClass: Record<ConfirmationBadgeTone, string> = {
  confirmed: "border-teal/40 text-teal",
  pending: "border-accent/40 text-accent",
  "in-review": "border-info/40 text-info",
  awaiting: "border-accent/40 text-accent",
  "sign-off": "border-accent/40 text-accent",
  done: "border-teal/40 text-teal",
};

function BookingIcon({
  type,
}: {
  type: PendingBookingItem["icon"];
}) {
  if (type === "check") {
    return <ActivityCheck className="size-4" color="currentColor" />;
  }

  if (type === "car") {
    return <StatCarIcon className="size-4" color="currentColor" />;
  }

  return (
    <span
      className="size-3.5 rounded-full border-2 border-current"
      aria-hidden
    />
  );
}

export function PendingBookingRow({ booking }: PendingBookingRowProps) {
  return (
    <div className="flex items-center gap-3 border-b border-accent/8 py-4 last:border-b-0">
      <span className="font-roboto w-4 shrink-0 text-[10px] tracking-[0.04em] text-secondary">
        {booking.index}
      </span>

      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-lg border bg-transparent ${iconToneClass[booking.status]}`}
      >
        <BookingIcon type={booking.icon} />
      </span>

      <div className="min-w-0 flex-1 space-y-1">
        <p className={confirmationRowTitleClass}>{booking.title}</p>
        <p className={confirmationRowMetaClass}>
          {booking.bookingRef} · {booking.staff} · {booking.bay} · {booking.price}
        </p>
      </div>

      <ConfirmationStatusBadge tone={booking.status} />
    </div>
  );
}
