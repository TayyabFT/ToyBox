import { ConfirmationRequestRow } from "./ConfirmationRequestRow";
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

      <div className="rounded-2xl border border-accent/10 bg-card">
        <p className="font-roboto text-xs tracking-[0.14em] text-secondary uppercase p-5 border-b border-accent/6">
          Bookings
        </p>
        <div>
          {loading ? (
            <p className="font-roboto py-6 text-center text-[11px] tracking-[0.06em] text-secondary uppercase">
              Loading...
            </p>
          ) : requests.length > 0 ? (
            requests.map((request) => (
              <ConfirmationRequestRow
                key={request.id}
                request={request}
                onOfferVehicle={onOfferVehicle}
              />
            ))
          ) : (
            <p className="font-roboto py-6 text-center text-[11px] tracking-[0.06em] text-secondary uppercase">
              No pending bookings
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
