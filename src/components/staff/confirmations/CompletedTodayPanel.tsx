import { CompletedRequestRow } from "./CompletedRequestRow";
import { ConfirmationScrollableList } from "./ConfirmationScrollableList";
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
          <span className="text-foreground">Completed</span>{" "}
          <span className="text-primary">Today</span>
        </h2>
        <p className="font-roboto text-[10px] tracking-[0.08em] text-secondary uppercase">
          {completedCount} Job{completedCount === 1 ? "" : "s"} Confirmed This
          Shift
        </p>
      </div>

      <div className="flex flex-col overflow-hidden rounded-2xl border border-accent/10 bg-card">
        <ConfirmationScrollableList
          items={requests}
          loading={loading}
          emptyText="No completed bookings"
          renderItem={(request) => <CompletedRequestRow request={request} />}
          getItemKey={(request) => request.id}
        />
      </div>
    </section>
  );
}
