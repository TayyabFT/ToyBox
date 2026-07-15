import { ConfirmationRowSkeletonList } from "./ConfirmationRowSkeleton";
import { ConfirmationsOutsideHeader } from "./ConfirmationsSectionHeader";
import { CompletedTodayRow } from "./CompletedTodayRow";
import { confirmationInnerClass } from "./panelStyles";
import type { CompletedTodayItem } from "./types";

type CompletedTodayPanelProps = {
  items: CompletedTodayItem[];
  completedCount: number;
  loading?: boolean;
};

export function CompletedTodayPanel({
  items,
  completedCount,
  loading = false,
}: CompletedTodayPanelProps) {
  return (
    <div>
      <ConfirmationsOutsideHeader
        titleSplit={{ before: "Completed", after: "Today" }}
        subtitle={`${completedCount} Booking${completedCount === 1 ? "" : "s"} Confirmed This Shift`}
      />

      <section className={confirmationInnerClass}>
        {loading ? (
          <ConfirmationRowSkeletonList />
        ) : items.length > 0 ? (
          items.map((item) => <CompletedTodayRow key={item.id} item={item} />)
        ) : (
          <p className="font-roboto py-6 text-center text-[11px] tracking-[0.06em] text-section-label uppercase">
            No completed bookings today
          </p>
        )}
      </section>
    </div>
  );
}
