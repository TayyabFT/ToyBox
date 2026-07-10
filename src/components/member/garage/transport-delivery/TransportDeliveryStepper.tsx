const STEPS = [
  { id: 1, label: "Details" },
  { id: 2, label: "Review" },
  { id: 3, label: "Confirmed" },
];

type TransportDeliveryStepperProps = {
  currentStep: number;
};

export function TransportDeliveryStepper({
  currentStep,
}: TransportDeliveryStepperProps) {
  return (
    <div>
      <div className="flex items-center">
        {STEPS.map((step, index) => {
          const isLast = index === STEPS.length - 1;
          const isReached = step.id <= currentStep;

          return (
            <div
              key={step.id}
              className={`flex items-center ${isLast ? "" : "min-w-0 flex-1"}`}
            >
              <span
                className={`font-roboto flex size-9 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ${
                  isReached
                    ? "bg-primary text-dark shadow-[0_0_16px_rgba(201,168,76,0.4)]"
                    : "border border-accent/15 bg-dark text-foreground-soft/50"
                }`}
              >
                {step.id}
              </span>

              {!isLast && (
                <span
                  className={`mx-2 h-px min-w-0 flex-1 ${
                    step.id < currentStep ? "bg-primary/70" : "bg-accent/20"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex">
        {STEPS.map((step, index) => {
          const isReached = step.id <= currentStep;

          return (
            <div
              key={step.id}
              className={`flex-1 ${
                index === 0
                  ? "text-left"
                  : index === STEPS.length - 1
                    ? "text-right"
                    : "text-center"
              }`}
            >
              <span
                className={`font-roboto text-[9px] tracking-[0.04em] uppercase ${
                  isReached ? "text-primary" : "text-foreground-soft/50"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
