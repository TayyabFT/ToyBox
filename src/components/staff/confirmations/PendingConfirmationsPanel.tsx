import { ConfirmationRequestRow } from "./ConfirmationRequestRow";
import { ConfirmationScrollableList } from "./ConfirmationScrollableList";
import type { ConfirmationRequestItem } from "./types";

type PendingConfirmationsPanelProps = {
  requests: ConfirmationRequestItem[];
  pendingCount: number;
  loading?: boolean;
  onOfferVehicle?: (request: ConfirmationRequestItem) => void;
};

export function PendingConfirmationsPanel({
  requests,
  pendingCount,
  loading = false,
  onOfferVehicle,
}: PendingConfirmationsPanelProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h2 className="font-copperplate text-[18px]">
          <span className="text-foreground">Pending</span>{" "}
          <span className="text-primary">Bookings</span>
        </h2>
        <p className="font-roboto text-[10px] tracking-[0.08em] text-secondary uppercase">
          {pendingCount} Job{pendingCount === 1 ? "" : "s"} Require Your
          Sign-Off Before Close-of-Shift
        </p>
      </div>

      <div className="flex flex-col overflow-hidden rounded-2xl border border-accent/10 bg-card">
        <ConfirmationScrollableList
          items={requests}
          loading={loading}
          emptyText="No pending bookings"
          renderItem={(request) => (
            <ConfirmationRequestRow
              request={request}
              onOfferVehicle={onOfferVehicle}
            />
          )}
          getItemKey={(request) => request.id}
        />
      </div>
    </section>
  );
}
