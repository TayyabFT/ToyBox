import { MemberGarageSuccessCheck } from "@/components/common/Svgs";
import {
  formatMaintenanceShortDate,
  getMaintenanceServiceCentre,
  getMaintenanceServiceType,
  getMaintenanceVehicle,
} from "./maintenanceOptions";
import type { MaintenanceDetailsFormState } from "./types";

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

type MaintenanceServiceConfirmedStepProps = {
  form: MaintenanceDetailsFormState;
};

export function MaintenanceServiceConfirmedStep({
  form,
}: MaintenanceServiceConfirmedStepProps) {
  const vehicle = getMaintenanceVehicle(form.vehicle);
  const serviceType = getMaintenanceServiceType(form.serviceType);
  const serviceCentre = getMaintenanceServiceCentre(form.serviceCentre);

  return (
    <div className="flex flex-col items-center py-2 text-center">
      <span className="flex size-[72px] shrink-0 items-center justify-center rounded-full bg-[#96CEB4] shadow-[0_0_28px_rgba(150,206,180,0.28)]">
        <MemberGarageSuccessCheck className="size-7" />
      </span>

      <h3 className="font-roboto mt-5 text-[18px] font-semibold text-foreground">
        Request Submitted
      </h3>
      <p className="font-roboto mt-1.5 max-w-[300px] text-[12px] leading-relaxed text-secondary">
        Your service request has been received. Concierge will confirm the booking
        with the service centre within 2 hours.
      </p>

      <div className="mt-5 w-full divide-y divide-accent/8 rounded-xl border border-accent/10 bg-[#141310] px-4 py-1">
        <ConfirmedRow label="Vehicle" value={vehicle.reviewLabel} />
        <ConfirmedRow label="Service" value={serviceType.confirmedLabel} />
        <ConfirmedRow label="Centre" value={serviceCentre.title} />
        <ConfirmedRow
          label="Date"
          value={formatMaintenanceShortDate(form.preferredDate)}
        />
        <div className="flex items-center justify-between gap-4 py-2.5">
          <span className="font-roboto text-[12px] text-secondary">Status</span>
          <span className="font-roboto rounded-full border border-primary/25 bg-primary/12 px-3 py-1 text-[10px] font-semibold tracking-[0.04em] text-primary">
            Awaiting confirmation
          </span>
        </div>
      </div>
    </div>
  );
}
