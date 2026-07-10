import {
  MemberGarageChevronRight,
  MemberGarageConciergeChatIcon,
  MemberServiceCentreStarIcon,
  MemberServiceCentreWorkshopIcon,
} from "@/components/common/Svgs";
import {
  formatMaintenanceRequestRef,
  formatMaintenanceShortDate,
  formatMaintenanceTrackingTime,
  formatMaintenanceTrackingTitle,
  getMaintenanceServiceCentre,
} from "./maintenanceOptions";
import type { MaintenanceDetailsFormState } from "./types";

type TimelineStatus = "completed" | "active" | "pending";

type TimelineStep = {
  id: number;
  status: TimelineStatus;
  title: string;
  meta: string;
  metaClassName?: string;
};

function TimelineNode({ status }: { status: TimelineStatus }) {
  if (status === "completed") {
    return (
      <span className="relative z-10 flex size-9 shrink-0 items-center justify-center">
        <span className="size-2.5 rounded-full bg-primary" />
      </span>
    );
  }

  if (status === "active") {
    return (
      <span className="relative z-10 flex size-9 shrink-0 items-center justify-center">
        <span className="size-4 rounded-full bg-primary shadow-[0_0_0_4px_rgba(201,168,76,0.22)]" />
      </span>
    );
  }

  return (
    <span className="relative z-10 flex size-9 shrink-0 items-center justify-center">
      <span className="size-2.5 rounded-full border border-accent/25 bg-dark" />
    </span>
  );
}

function ServiceTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const lineTone =
          step.status === "pending" ? "bg-accent/15" : "bg-primary/45";
        const titleClass =
          step.status === "pending"
            ? "font-roboto text-[13px] font-semibold text-secondary/55"
            : "font-roboto text-[13px] font-semibold text-foreground";

        return (
          <div key={step.id} className={`relative flex gap-4 ${isLast ? "" : "pb-7"}`}>
            {!isLast ? (
              <span
                className={`absolute top-9 left-[17px] h-[calc(100%-12px)] w-px ${lineTone}`}
              />
            ) : null}

            <TimelineNode status={step.status} />

            <div className="min-w-0 pt-1.5">
              <p className={titleClass}>{step.title}</p>
              <p
                className={`font-roboto mt-1 text-[11px] ${
                  step.metaClassName ?? "text-secondary"
                }`}
              >
                {step.meta}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

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
  const requestRef = formatMaintenanceRequestRef(form.preferredDate);

  const steps: TimelineStep[] = [
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
              REF {requestRef}
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

      <ServiceTimeline steps={steps} />

      <div>
        <p className="font-roboto mb-3 text-[10px] font-medium tracking-[0.18em] text-section-label uppercase">
          Your Concierge
        </p>

        <div className="flex items-center gap-3 rounded-2xl border border-accent/12 bg-elevated px-4 py-3.5">
          <span className="font-roboto flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/8 text-[13px] font-semibold text-primary">
            SK
          </span>

          <div className="min-w-0 flex-1">
            <p className="font-roboto text-[13px] font-semibold text-foreground">
              Sarah Khalid
            </p>
            <p className="font-roboto mt-0.5 text-[11px] text-secondary">
              Available · Responds in &lt;2 min
            </p>
          </div>

          <button
            type="button"
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary transition-colors hover:border-primary/60 hover:bg-primary/15"
            aria-label="Message concierge"
          >
            <MemberGarageConciergeChatIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
