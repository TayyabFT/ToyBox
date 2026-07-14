import {
  MemberGarageChevronRight,
  MemberServiceCentreStarIcon,
  MemberServiceCentreWorkshopIcon,
} from "@/components/common/Svgs";
import { DotTimeline, type DotTimelineStep } from "../shared/requestFormUi";
import { ConciergeCard } from "../shared/ConciergeCard";
import {
  formatMaintenanceShortDate,
  formatMaintenanceTrackingTime,
  formatMaintenanceTrackingTitle,
  getMaintenanceServiceCentre,
} from "./maintenanceOptions";
import type { MaintenanceDetailsFormState } from "./types";

function ServiceCentreIcon({ type }: { type: "star" | "workshop" }) {
  const shellClass =
    "flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/35 bg-primary/8";

  if (type === "star") {
    return (
      <span className={shellClass}>
        <MemberServiceCentreStarIcon className="size-[16px]" />
      </span>
    );
  }

  return (
    <span className={`${shellClass} border-accent/20 bg-accent/5`}>
      <MemberServiceCentreWorkshopIcon className="size-[16px]" />
    </span>
  );
}

type MaintenanceServiceTrackRequestStepProps = {
  form: MaintenanceDetailsFormState;
};

export function MaintenanceServiceTrackRequestStep({
  form,
}: MaintenanceServiceTrackRequestStepProps) {
  const serviceCentre = getMaintenanceServiceCentre(form.serviceCentre);

  const steps: DotTimelineStep[] = [
    {
      id: 1,
      status: "completed",
      title: "Request received",
      meta: "Apr 29 · 9:41 AM",
    },
    {
      id: 2,
      status: "completed",
      title: "Booking confirmed with centre",
      meta: "Apr 30 · 11:20 AM · Sarah K.",
    },
    {
      id: 3,
      status: "completed",
      title: "Vehicle transport arranged",
      meta: "Pickup scheduled",
    },
    {
      id: 4,
      status: "active",
      title: "Vehicle at service centre",
      meta: "In progress · Service underway",
      metaClassName: "text-primary",
    },
    {
      id: 5,
      status: "pending",
      title: "Service report & sign-off",
      meta: "Pending",
    },
    {
      id: 6,
      status: "pending",
      title: "Vehicle returned to Toybox",
      meta: "Est. 1 May · 5:00 PM",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-accent/12 bg-[#141310]">
        <div className="flex items-start justify-between gap-4 px-4 py-4">
          <div className="min-w-0">
            <p className="font-roboto text-[12px] font-bold tracking-[0.05em] text-foreground uppercase">
              {formatMaintenanceTrackingTitle(form.vehicle, form.serviceType)}
            </p>
            <p className="font-roboto mt-1 text-[10px] tracking-[0.08em] text-secondary uppercase">
              REF {form.preferredDate}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="font-roboto text-[11px] text-secondary">
              {formatMaintenanceShortDate(form.preferredDate)}
            </p>
            <p className="font-roboto mt-0.5 text-[12px] font-semibold text-primary">
              {formatMaintenanceTrackingTime(form.preferredTime)}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="flex w-full items-center gap-3 border-t border-accent/8 px-4 py-3.5 text-left transition-colors hover:bg-accent/5"
        >
          <ServiceCentreIcon type={serviceCentre.icon} />
          <span className="min-w-0 flex-1">
            <span className="font-roboto block text-[12px] font-semibold text-foreground">
              {serviceCentre.trackingLocation}
            </span>
            <span className="font-roboto mt-0.5 block text-[10px] text-secondary">
              {serviceCentre.trackingDetail}
            </span>
          </span>
          <MemberGarageChevronRight className="size-[10px] shrink-0 text-secondary" />
        </button>
      </div>

      <DotTimeline steps={steps} />

      <ConciergeCard
        sectionLabel="Your Concierge"
        name="Sarah Khalid"
        initials="SK"
        subtitle="Available · Responds in <2 min"
      />
    </div>
  );
}
