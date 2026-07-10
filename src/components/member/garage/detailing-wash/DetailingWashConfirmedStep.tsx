import { MemberGarageSuccessCheck } from "@/components/common/Svgs";
import { formatShortDate } from "../transport-delivery/dateFormat";
import {
  calculateWashTotal,
  formatWashTotal,
  getWashPackage,
} from "./washOptions";
import type { WashDetailsFormState } from "./types";

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

type DetailingWashConfirmedStepProps = {
  vehicleName: string;
  form: WashDetailsFormState;
};

export function DetailingWashConfirmedStep({
  vehicleName,
  form,
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

      <div className="mt-5 w-full divide-y divide-accent/8 rounded-xl border border-accent/10 bg-[#141310] px-4 py-1">
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
