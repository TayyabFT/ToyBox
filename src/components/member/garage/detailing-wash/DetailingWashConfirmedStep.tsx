import { MemberGarageSuccessCheck } from "@/components/common/Svgs";
import { ConfirmedRow } from "../shared/requestFormUi";
import { formatShortDate } from "../shared/dateUtils";
import {
  calculateWashTotal,
  formatWashTotal,
  getWashPackage,
} from "./washOptions";
import type { WashDetailsFormState } from "./types";

type DetailingWashConfirmedStepProps = {
  vehicleName: string;
  form: WashDetailsFormState;
  referenceNumber?: string;
};

export function DetailingWashConfirmedStep({
  vehicleName,
  form,
  referenceNumber,
}: DetailingWashConfirmedStepProps) {
  const selectedPackage = getWashPackage(form.package);
  const total = calculateWashTotal(form);

  return (
    <div className="flex flex-col items-center py-2 text-center">
      <span className="flex size-[72px] shrink-0 items-center justify-center rounded-full bg-[#96CEB4] shadow-[0_0_28px_rgba(150,206,180,0.28)]">
        <MemberGarageSuccessCheck className="size-7" />
      </span>

      <h3 className="font-roboto mt-5 text-[18px] font-semibold text-foreground">
        Booking Confirmed
      </h3>
      <p className="font-roboto mt-1.5 max-w-[280px] text-[12px] leading-relaxed text-secondary">
        Concierge will notify you when the vehicle enters service.
      </p>

      <div className="mt-5 w-full divide-y divide-accent/8 rounded-xl border border-accent/10 garage-review-card px-4 py-1">
        {referenceNumber ? (
          <ConfirmedRow
            label="Reference"
            value={referenceNumber}
            valueClassName="text-primary"
          />
        ) : null}
        <ConfirmedRow label="Vehicle" value={vehicleName} />
        <ConfirmedRow label="Package" value={selectedPackage.label} />
        <ConfirmedRow
          label="Cost"
          value={formatWashTotal(total)}
          valueClassName="text-primary"
        />
        <ConfirmedRow label="Date" value={formatShortDate(form.date)} />
      </div>
    </div>
  );
}
