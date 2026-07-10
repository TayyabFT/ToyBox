import {
  MemberGarageConciergeChatIcon,
  MemberGarageSuccessCheck,
} from "@/components/common/Svgs";
import {
  formatSourcingBudgetConfirmed,
  formatSourcingMakeModel,
  formatSourcingTimelineConfirmed,
} from "./sourcingOptions";
import type { VehicleSourcingDetailsFormState } from "./types";

function ConfirmedRow({
  label,
  value,
  valueClassName = "text-foreground",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="font-roboto text-[12px] text-secondary">{label}</span>
      <span
        className={`font-roboto max-w-[62%] text-right text-[12px] font-medium ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  );
}

type VehicleSourcingConfirmedStepProps = {
  form: VehicleSourcingDetailsFormState;
};

export function VehicleSourcingConfirmedStep({
  form,
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

      <div className="mt-5 w-full divide-y divide-accent/8 rounded-xl border border-accent/10 bg-[#141310] px-4 py-1">
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
        <div className="flex items-center justify-between gap-4 py-2.5">
          <span className="font-roboto text-[12px] text-secondary">Status</span>
          <span className="font-roboto rounded-full border border-primary/25 bg-primary/12 px-3 py-1 text-[10px] font-semibold tracking-[0.04em] text-primary">
            Under Review
          </span>
        </div>
      </div>

      <div className="mt-5 w-full">
        <div className="flex items-center gap-3 rounded-xl border border-accent/12 bg-elevated px-4 py-3.5 text-left">
          <span className="font-roboto flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/8 text-[13px] font-semibold text-primary">
            JA
          </span>

          <div className="min-w-0 flex-1">
            <p className="font-roboto text-[13px] font-semibold text-foreground">
              James Alderton
            </p>
            <p className="font-roboto mt-0.5 text-[11px] text-secondary">
              Acquisition Manager · Available now
            </p>
          </div>

          <button
            type="button"
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary transition-colors hover:border-primary/60 hover:bg-primary/15"
            aria-label="Message acquisition manager"
          >
            <MemberGarageConciergeChatIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
