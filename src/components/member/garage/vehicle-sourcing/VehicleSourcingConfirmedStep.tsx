import { MemberGarageSuccessCheck } from "@/components/common/Svgs";
import { ConfirmedRow } from "../shared/requestFormUi";
import { ConciergeCard } from "../shared/ConciergeCard";
import {
  formatSourcingBudgetConfirmed,
  formatSourcingMakeModel,
  formatSourcingTimelineConfirmed,
} from "./sourcingOptions";
import type { VehicleSourcingDetailsFormState } from "./types";

type VehicleSourcingConfirmedStepProps = {
  form: VehicleSourcingDetailsFormState;
  referenceNumber: string;
  submittedDate?: string;
};

export function VehicleSourcingConfirmedStep({
  form,
  referenceNumber,
  submittedDate,
}: VehicleSourcingConfirmedStepProps) {
  return (
    <div className="flex flex-col items-center py-2 text-center">
      <span className="flex size-[72px] shrink-0 items-center justify-center rounded-full bg-[#96CEB4] shadow-[0_0_28px_rgba(150,206,180,0.28)]">
        <MemberGarageSuccessCheck className="size-7" />
      </span>

      <h3 className="font-roboto mt-5 text-[18px] font-semibold text-foreground">
        Request Submitted
      </h3>
      <p className="font-roboto mt-1.5 max-w-[300px] text-[12px] leading-relaxed text-secondary">
        Your acquisition brief has been received. Your dedicated manager will be
        in touch within 24 hours.
      </p>

      <div className="mt-5 w-full divide-y divide-accent/8 rounded-xl border border-accent/10 garage-review-card px-4 py-1">
        <ConfirmedRow
          label="Vehicle"
          value={formatSourcingMakeModel(form.make, form.model)}
        />
        <ConfirmedRow
          label="Budget"
          value={formatSourcingBudgetConfirmed(form.budget)}
        />
        <ConfirmedRow
          label="Timeline"
          value={formatSourcingTimelineConfirmed(form.timeline)}
        />
        {referenceNumber ? (
          <ConfirmedRow label="Reference" value={referenceNumber} />
        ) : null}
        {submittedDate ? (
          <ConfirmedRow label="Submitted" value={submittedDate} />
        ) : null}
        <div className="flex items-center justify-between gap-4 py-2.5">
          <span className="font-roboto text-[12px] text-secondary">Status</span>
          <span className="font-roboto rounded-full border border-primary/25 bg-primary/12 px-3 py-1 text-[10px] font-semibold tracking-[0.04em] text-primary">
            Under Review
          </span>
        </div>
      </div>

      <div className="mt-5 w-full">
        <ConciergeCard
          name="James Alderton"
          initials="JA"
          subtitle="Acquisition Manager · Available now"
        />
      </div>
    </div>
  );
}
