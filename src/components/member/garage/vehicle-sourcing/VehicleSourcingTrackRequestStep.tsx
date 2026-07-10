import { MemberGarageConciergeChatIcon } from "@/components/common/Svgs";
import {
  formatSourcingRequestRef,
  formatSourcingSubmittedDate,
  formatSourcingTrackingBudget,
  formatSourcingTrackingTitle,
} from "./sourcingOptions";
import type { VehicleSourcingDetailsFormState } from "./types";

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

function ProgressTimeline({ steps }: { steps: TimelineStep[] }) {
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

type VehicleSourcingTrackRequestStepProps = {
  form: VehicleSourcingDetailsFormState;
};

export function VehicleSourcingTrackRequestStep({
  form,
}: VehicleSourcingTrackRequestStepProps) {
  const steps: TimelineStep[] = [
    {
      id: 1,
      status: "completed",
      title: "Brief received",
      meta: "Apr 29 · 9:41 AM",
    },
    {
      id: 2,
      status: "completed",
      title: "Assigned to acquisition manager",
      meta: "Apr 29 · 9:55 AM · James A.",
    },
    {
      id: 3,
      status: "active",
      title: "Market search underway",
      meta: "In progress now",
      metaClassName: "text-primary",
    },
    {
      id: 4,
      status: "pending",
      title: "Options presented to member",
      meta: "Est. within 24 hours",
    },
    {
      id: 5,
      status: "pending",
      title: "Vehicle selected & acquired",
      meta: "Pending member approval",
    },
    {
      id: 6,
      status: "pending",
      title: "Delivered to Toybox storage",
      meta: "Final step",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-accent/12 bg-[#141310] px-4 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-roboto text-[12px] font-bold tracking-[0.05em] text-foreground uppercase">
              {formatSourcingTrackingTitle(form.make, form.model)}
            </p>
            <p className="font-roboto mt-1 text-[10px] tracking-[0.08em] text-secondary uppercase">
              {formatSourcingRequestRef()}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="font-roboto text-[11px] text-secondary">
              {formatSourcingSubmittedDate()}
            </p>
            <p className="font-roboto mt-0.5 text-[12px] font-semibold text-primary">
              {formatSourcingTrackingBudget(form.budget)}
            </p>
          </div>
        </div>
      </div>

      <div>
        <p className="font-roboto mb-3 text-[10px] font-medium tracking-[0.18em] text-section-label uppercase">
          Progress
        </p>
        <ProgressTimeline steps={steps} />
      </div>

      <div>
        <p className="font-roboto mb-3 text-[10px] font-medium tracking-[0.18em] text-section-label uppercase">
          Your Manager
        </p>

        <div className="flex items-center gap-3 rounded-2xl border border-accent/12 bg-elevated px-4 py-3.5">
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
