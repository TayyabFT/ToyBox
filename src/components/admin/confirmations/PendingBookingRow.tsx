import { ActivityCheck, StatCarIcon } from "@/components/common/Svgs";
import { ConfirmationStatusBadge } from "./ConfirmationStatusBadge";
import { confirmationRowMetaClass, confirmationRowTitleClass } from "./panelStyles";
import type { ConfirmationBadgeTone, PendingBookingItem } from "./types";

type PendingBookingRowProps = {
  booking: PendingBookingItem;
};

const iconToneClass: Record<ConfirmationBadgeTone, string> = {
  confirmed: "border-teal/40 text-teal",
  pending: "border-[#C5A059]/40 text-[#C5A059]",
  "in-review": "border-[#6B8FA8]/40 text-[#8BB4D4]",
  awaiting: "border-[#C5A059]/40 text-[#C5A059]",
  "sign-off": "border-[#C5A059]/40 text-[#C5A059]",
  done: "border-teal/40 text-teal",
};

function BookingIcon({
  type,
  tone,
}: {
  type: PendingBookingItem["icon"];
  tone: ConfirmationBadgeTone;
}) {
  const color =
    tone === "in-review"
      ? "#8BB4D4"
      : tone === "confirmed" || tone === "done"
        ? "#7DBFA0"
        : "#C5A059";

  if (type === "check") {
    return <ActivityCheck className="size-4" color={color} />;
  }

  if (type === "car") {
    return <StatCarIcon className="size-4" color={color} />;
  }

  return (
    <span
      className="size-3.5 rounded-full border-2 border-current"
      style={{ borderColor: color }}
      aria-hidden
    />
  );
}

export function PendingBookingRow({ booking }: PendingBookingRowProps) {
  return (
    <div className="flex items-center gap-3 border-b border-[#1E1A14] py-4 last:border-b-0">
      <span className="font-roboto w-4 shrink-0 text-[10px] tracking-[0.04em] text-[#6B665E]">
        {booking.index}
      </span>

      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-lg border bg-transparent ${iconToneClass[booking.status]}`}
      >
        <BookingIcon type={booking.icon} tone={booking.status} />
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
