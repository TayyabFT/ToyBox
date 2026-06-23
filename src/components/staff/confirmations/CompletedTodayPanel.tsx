import { CompletedRequestRow } from "./CompletedRequestRow";
import type { ConfirmationRequestItem } from "./types";

type CompletedTodayPanelProps = {
  requests: ConfirmationRequestItem[];
  completedCount: number;
  loading?: boolean;
};

export function CompletedTodayPanel({
  requests,
  completedCount,
  loading = false,
}: CompletedTodayPanelProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h2 className="font-copperplate text-[18px]">
          <span className="text-[#F2EAD5]">Completed</span>{" "}
          <span className="text-primary">Today</span>
        </h2>
        <p className="font-roboto text-[10px] tracking-[0.08em] text-secondary uppercase">
          {completedCount} Job{completedCount === 1 ? "" : "s"} Confirmed This
          Shift
        </p>
      </div>

      <div className="rounded-2xl border border-[#D4A8471A] bg-[#11100C]">
        {loading ? (
          <p className="font-roboto py-6 text-center text-[11px] tracking-[0.06em] text-secondary uppercase">
            Loading...
          </p>
        ) : requests.length > 0 ? (
          requests.map((request) => (
            <CompletedRequestRow key={request.id} request={request} />
          ))
        ) : (
          <p className="font-roboto py-6 text-center text-[11px] tracking-[0.06em] text-secondary uppercase">
            No completed bookings
          </p>
        )}
      </div>
    </section>
  );
}
