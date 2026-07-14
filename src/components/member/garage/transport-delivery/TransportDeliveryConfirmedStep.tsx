import { MemberGarageTransportSuccessCheck } from "@/components/common/Svgs";
import { ConfirmedRow } from "../shared/requestFormUi";
import { formatShortDate } from "../shared/dateUtils";
import type { TransportDetailsFormState } from "./types";

type TransportDeliveryConfirmedStepProps = {
  requestNumber: string;
  vehicleName: string;
  form: TransportDetailsFormState;
};

export function TransportDeliveryConfirmedStep({
  requestNumber,
  vehicleName,
  form,
}: TransportDeliveryConfirmedStepProps) {
  return (
    <div className="flex flex-col items-center py-3 text-center">
      <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-teal">
        <MemberGarageTransportSuccessCheck />
      </span>

      <h3 className="font-roboto mt-4 text-[17px] font-semibold text-foreground">
        Request Submitted
      </h3>
      <p className="font-roboto mt-1 text-[12px] text-secondary">
        Your concierge team will confirm pickup shortly.
      </p>

      <div className="mt-5 w-full divide-y divide-accent/8 rounded-xl border border-accent/10 bg-elevated px-4 py-1">
        <ConfirmedRow label="Request no." value={requestNumber} />
        <ConfirmedRow label="Vehicle" value={vehicleName} />
        <ConfirmedRow
          label="Pickup"
          value={`${form.address} . ${formatShortDate(form.date)}, ${form.timeWindow}`}
        />
      </div>
    </div>
  );
}
