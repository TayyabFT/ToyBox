import { ConfirmationScrollableList } from "./ConfirmationScrollableList";
import { ConfirmedRequestRow } from "./ConfirmedRequestRow";
import type { ConfirmationRequestItem } from "./types";

type ConfirmedBookingsPanelProps = {
  requests: ConfirmationRequestItem[];
  confirmedCount: number;
  loading?: boolean;
};

export function ConfirmedBookingsPanel({
  requests,
  confirmedCount,
  loading = false,
}: ConfirmedBookingsPanelProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h2 className="font-copperplate text-[18px]">
          <span className="text-foreground">Confirmed</span>{" "}
          <span className="text-primary">Bookings</span>
        </h2>
        <p className="font-roboto text-[10px] tracking-[0.08em] text-secondary uppercase">
          {confirmedCount} Booking{confirmedCount === 1 ? "" : "s"} Ready For
          Member Collection
        </p>
      </div>

      <div className="flex flex-col overflow-hidden rounded-2xl border border-accent/10 bg-card">
        <ConfirmationScrollableList
          items={requests}
          loading={loading}
          emptyText="No confirmed bookings"
          renderItem={(request) => <ConfirmedRequestRow request={request} />}
          getItemKey={(request) => request.id}
        />
      </div>
    </section>
  );
}
