import { formatShortDate } from "../shared/dateUtils";
import { ConciergeCard } from "../shared/ConciergeCard";
import type { WashDetailsFormState } from "./types";

type TimelineStatus = "completed" | "active" | "pending";

type TimelineStep = {
  id: number;
  status: TimelineStatus;
  title: string;
  meta: string;
};

function TimelineCircle({
  step,
  status,
}: {
  step: number;
  status: TimelineStatus;
}) {
  if (status === "completed") {
    return (
      <span className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#96CEB4] text-[13px] font-semibold text-[#0D0D0D]">
        {step}
      </span>
    );
  }

  if (status === "active") {
    return (
      <span className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-[13px] font-semibold text-[#0D0D0D] shadow-[0_0_16px_rgba(201,168,76,0.35)]">
        {step}
      </span>
    );
  }

  return (
    <span className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border border-accent/20 bg-dark text-[13px] font-semibold text-secondary/60">
      {step}
    </span>
  );
}

function BookingTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const titleClass =
          step.status === "pending"
            ? "font-roboto text-[13px] font-semibold text-secondary/70"
            : "font-roboto text-[13px] font-semibold text-foreground";

        return (
          <div key={step.id} className={`relative flex gap-4 ${isLast ? "" : "pb-7"}`}>
            {!isLast ? (
              <span className="absolute top-9 left-[17px] h-[calc(100%-12px)] w-px bg-accent/20" />
            ) : null}

            <TimelineCircle step={step.id} status={step.status} />

            <div className="min-w-0 pt-1">
              <p className={titleClass}>{step.title}</p>
              <p className="font-roboto mt-1 text-[11px] text-secondary">{step.meta}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

type DetailingWashBookingStatusStepProps = {
  form: WashDetailsFormState;
};

export function DetailingWashBookingStatusStep({
  form,
}: DetailingWashBookingStatusStepProps) {
  const steps: TimelineStep[] = [
    {
      id: 1,
      status: "completed",
      title: "Confirmed by concierge",
      meta: "08:12",
    },
    {
      id: 2,
      status: "completed",
      title: "Vehicle prepped & moved",
      meta: "09:40",
    },
    {
      id: 3,
      status: "active",
      title: "Detailing in progress",
      meta: "Underway. Est . 2h remaining",
    },
    {
      id: 4,
      status: "pending",
      title: "Ready for collection",
      meta: formatShortDate(form.date),
    },
  ];

  return (
    <div className="space-y-7">
      <BookingTimeline steps={steps} />

      <ConciergeCard
        sectionLabel="Your Concierge"
        name="Sarah Khalid"
        initials="SK"
        subtitle="Available · Responds in <2 min"
      />
    </div>
  );
}
