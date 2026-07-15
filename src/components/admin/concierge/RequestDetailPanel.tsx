"use client";

import { ActivityCheck, Edit, Phone } from "@/components/common/Svgs";
import { ArrivalPrepChecklist } from "./ArrivalPrepChecklist";
import { LogisticsSummary } from "./LogisticsSummary";
import {
  conciergeAddNoteButtonClass,
  conciergeDetailNameClass,
  conciergeDetailStatusClass,
  conciergeHeaderOutlineButtonClass,
  conciergeHeaderTealButtonClass,
  conciergeMarkReadyButtonClass,
  conciergePanelClass,
} from "./panelStyles";
import type { ConciergeRequestDetail } from "./types";

type RequestDetailPanelProps = {
  detail: ConciergeRequestDetail;
  onToggleChecklistItem?: (id: string) => void;
};

export function RequestDetailPanel({
  detail,
  onToggleChecklistItem,
}: RequestDetailPanelProps) {
  return (
    <section className={conciergePanelClass}>
      <div className="mb-7 flex flex-col gap-5 border-b border-accent/8 pb-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <span className="admin-gold-avatar flex size-[52px] shrink-0 items-center justify-center rounded-full font-roboto text-[20px] font-semibold uppercase">
            {detail.memberInitial}
          </span>

          <div className="space-y-1.5">
            <h2 className={conciergeDetailNameClass}>{detail.memberName}</h2>
            <p className={conciergeDetailStatusClass}>
              <span className="text-teal">{detail.memberStatus}</span>
              <span className="text-secondary">
                {" "}
                · {detail.memberTier} · {detail.memberId}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button type="button" className={conciergeHeaderOutlineButtonClass}>
            View Profile
          </button>
          <button type="button" className={conciergeHeaderTealButtonClass}>
            <Phone color="currentColor" className="size-3.5" />
            Call Member
          </button>
        </div>
      </div>

      <div className="mb-7 grid grid-cols-1 gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:gap-10">
        <ArrivalPrepChecklist
          items={detail.checklist}
          onToggle={onToggleChecklistItem}
        />

        <LogisticsSummary items={detail.logistics} />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 ">
        <button type="button" className={conciergeAddNoteButtonClass}>
          <Edit active className="size-3.5" />
          Add Note
        </button>
        <button type="button" className={conciergeMarkReadyButtonClass}>
          <ActivityCheck color="currentColor" className="size-4" />
          Mark Ready
        </button>
      </div>
    </section>
  );
}
