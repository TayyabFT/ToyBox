import type { ReactNode } from "react";
import { formatFullDate } from "./dateFormat";
import type { TransportDetailsFormState } from "./types";

function ReviewField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <p className="font-roboto text-[10px] font-medium tracking-[0.18em] text-section-label uppercase">
        {label}
      </p>
      <div className="font-roboto text-[14px] leading-snug text-foreground">
        {children}
      </div>
    </div>
  );
}

type TransportDeliveryReviewStepProps = {
  vehicleName: string;
  requestLabel: string;
  form: TransportDetailsFormState;
};

export function TransportDeliveryReviewStep({
  vehicleName,
  requestLabel,
  form,
}: TransportDeliveryReviewStepProps) {
  return (
    <div className="grid grid-cols-1 gap-y-6">
      <ReviewField label="Vehicle">{vehicleName}</ReviewField>
      <ReviewField label="Service">{requestLabel}</ReviewField>
      <ReviewField label="Address">{form.address}</ReviewField>
      <ReviewField label="Date & Time">
        <p>{formatFullDate(form.date)}</p>
        <p>. {form.timeWindow}</p>
      </ReviewField>
    </div>
  );
}
