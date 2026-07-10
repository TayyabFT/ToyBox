import type { ReactNode } from "react";
import { MemberGarageReviewTargetIcon } from "@/components/common/Svgs";
import { formatFullDate } from "../transport-delivery/dateFormat";
import {
  calculateWashTotal,
  formatWashEstimateSummary,
  formatWashNotes,
  formatWashTotal,
  getWashAddOn,
  getWashPackage,
} from "./washOptions";
import type { WashDetailsFormState } from "./types";

function ReviewTargetIcon() {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/35 bg-primary/10">
      <MemberGarageReviewTargetIcon className="size-[22px]" />
    </span>
  );
}

function ReviewRow({
  label,
  children,
  align = "end",
}: {
  label: string;
  children: ReactNode;
  align?: "end" | "center";
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-accent/8 py-3 last:border-b-0">
      <span className="font-roboto shrink-0 text-[11px] text-secondary">{label}</span>
      <div
        className={`min-w-0 flex-1 ${align === "center"
            ? "text-center"
            : "text-right"
          }`}
      >
        {children}
      </div>
    </div>
  );
}

type DetailingWashReviewStepProps = {
  vehicleName: string;
  form: WashDetailsFormState;
};

export function DetailingWashReviewStep({
  vehicleName,
  form,
}: DetailingWashReviewStepProps) {
  const selectedPackage = getWashPackage(form.package);
  const selectedAddOns = form.addOns.map((key) => getWashAddOn(key));
  const total = calculateWashTotal(form);
  const estimateSummary = formatWashEstimateSummary(form);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-accent/12 bg-[#141310 ]">
        <div className="flex items-center gap-3 border-b border-accent/8 px-4 py-3.5">
          <ReviewTargetIcon />
          <div className="min-w-0">
            <p className="font-roboto text-[12px] font-semibold tracking-[0.06em] text-foreground uppercase">
              Detailing &amp; Wash
            </p>
            <p className="font-roboto mt-0.5 text-[10px] text-secondary">
              Please review before confirming
            </p>
          </div>
        </div>

        <div className="px-4 py-1">
          <ReviewRow label="Vehicle">
            <span className="font-roboto text-[12px] font-semibold text-foreground">
              {vehicleName}
            </span>
          </ReviewRow>

          <ReviewRow label="Package">
            <span className="font-roboto text-[12px] font-semibold text-foreground">
              {selectedPackage.reviewLabel}
            </span>
          </ReviewRow>

          {selectedPackage.includes ? (
            <ReviewRow label="Includes" align="center">
              <span className="font-roboto text-[10px] text-secondary">
                {selectedPackage.includes}
              </span>
            </ReviewRow>
          ) : null}

          {selectedAddOns.length > 0 ? (
            <ReviewRow label="Add-on">
              <span className="font-roboto text-[12px] font-semibold text-foreground">
                {selectedAddOns.map((addOn) => addOn.reviewLabel).join(", ")}
              </span>
            </ReviewRow>
          ) : null}

          <ReviewRow label="Date">
            <span className="font-roboto text-[12px] font-semibold text-foreground">
              {formatFullDate(form.date)}
            </span>
          </ReviewRow>

          <ReviewRow label="Notes">
            <span className="font-roboto text-[11px] text-secondary italic">
              {formatWashNotes(form.notes)}
            </span>
          </ReviewRow>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-2xl border border-accent/12 bg-[#141310] px-4 py-3.5">
        <div className="min-w-0">
          <p className="font-roboto text-[12px] font-semibold text-foreground">
            Total Estimate
          </p>
          <p className="font-roboto mt-0.5 text-[10px] text-secondary">
            {estimateSummary}
          </p>
        </div>
        <p className="font-copperplate shrink-0 text-[24px] leading-none text-primary">
          {formatWashTotal(total)}
        </p>
      </div>
    </div>
  );
}
