import { CircleCheck, FaintCheck } from "@/components/common/Svgs";
import { DoneStatusBadge } from "./ConfirmationStatusBadge";
import {
  confirmationDoneIconBoxClass,
  confirmationRowMetaClass,
  confirmationRowTitleClass,
} from "./panelStyles";
import type { CompletedTodayItem } from "./types";

type CompletedTodayRowProps = {
  item: CompletedTodayItem;
};

export function CompletedTodayRow({ item }: CompletedTodayRowProps) {
  return (
    <div className="flex items-center gap-4 border-b border-[#1E1A14] py-4 last:border-b-0">
      <FaintCheck className="shrink-0" />

      <span className={confirmationDoneIconBoxClass}>
        <CircleCheck active className="size-4 [&_*]:stroke-[#7DBFA0]" />
      </span>

      <div className="min-w-0 flex-1 space-y-1">
        <p className={confirmationRowTitleClass}>{item.title}</p>
        <p className={confirmationRowMetaClass}>
          {item.bookingRef} · Confirmed {item.confirmedAt} · {item.assignee}
        </p>
      </div>

      <DoneStatusBadge />
    </div>
  );
}
