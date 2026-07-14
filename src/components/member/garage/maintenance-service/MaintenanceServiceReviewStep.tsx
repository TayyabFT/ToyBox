import { MemberGarageReviewLockIcon } from "@/components/common/Svgs";
import { ReviewRow } from "../shared/requestFormUi";
import {
  formatMaintenanceFullDate,
  formatMaintenanceIssueNote,
  getMaintenanceServiceCentre,
  getMaintenanceServiceType,
  getMaintenanceTimeOption,
  getMaintenanceVehicle,
} from "./maintenanceOptions";
import type { MaintenanceDetailsFormState } from "./types";

function ReviewLockIcon() {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/35 bg-primary/10">
      <MemberGarageReviewLockIcon className="size-[18px]" />
    </span>
  );
}

type MaintenanceServiceReviewStepProps = {
  form: MaintenanceDetailsFormState;
};

export function MaintenanceServiceReviewStep({
  form,
}: MaintenanceServiceReviewStepProps) {
  const vehicle = getMaintenanceVehicle(form.vehicle);
  const serviceType = getMaintenanceServiceType(form.serviceType);
  const serviceCentre = getMaintenanceServiceCentre(form.serviceCentre);
  const timeOption = getMaintenanceTimeOption(form.preferredTime);

  return (
    <div className="overflow-hidden rounded-2xl border border-accent/12 bg-[#141310]">
      <div className="flex items-center gap-3 border-b border-accent/8 px-4 py-3.5">
        <ReviewLockIcon />
        <div className="min-w-0">
          <p className="font-roboto text-[12px] font-semibold tracking-[0.06em] text-foreground uppercase">
            Maintenance &amp; Service
          </p>
          <p className="font-roboto mt-0.5 text-[10px] text-secondary">
            Please review before confirming
          </p>
        </div>
      </div>

      <div className="px-4 py-1">
        <ReviewRow label="Vehicle">
          <span className="font-roboto text-[12px] font-semibold text-foreground">
            {vehicle.reviewLabel}
          </span>
        </ReviewRow>

        <ReviewRow label="Service type">
          <span className="font-roboto text-[12px] font-semibold text-foreground">
            {serviceType.title}
          </span>
        </ReviewRow>

        <ReviewRow label="Service centre">
          <span className="font-roboto text-[12px] font-semibold text-foreground">
            {serviceCentre.title}
          </span>
        </ReviewRow>

        <ReviewRow label="Date">
          <span className="font-roboto text-[12px] font-semibold text-foreground">
            {formatMaintenanceFullDate(form.preferredDate)}
          </span>
        </ReviewRow>

        <ReviewRow label="Time">
          <span className="font-roboto text-[12px] font-semibold text-foreground">
            {timeOption.reviewLabel}
          </span>
        </ReviewRow>

        <ReviewRow label="Issue noted">
          <span className="font-roboto text-[11px] text-secondary italic">
            {formatMaintenanceIssueNote(form.issueDescription)}
          </span>
        </ReviewRow>
      </div>
    </div>
  );
}
