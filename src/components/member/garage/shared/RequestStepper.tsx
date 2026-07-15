// ── Shared step progress indicator used by all garage request modals ─────────

const DEFAULT_STEPS = [
  { id: 1, label: "Details" },
  { id: 2, label: "Review" },
  { id: 3, label: "Confirmed" },
];

type RequestStepperProps = {
  currentStep: number;
  steps?: { id: number; label: string }[];
  /**
   * Controls the connector line colour for completed steps.
   * "primary" — bright gold line (transport / maintenance / sourcing style)
   * "muted"   — static accent line (detailing style)
   * @default "primary"
   */
  completedLineVariant?: "primary" | "muted";
  /**
   * Controls label typography.
   * "small"  — text-[9px] uppercase (transport style)
   * "normal" — text-[10px] sentence case (detailing style)
   * @default "small"
   */
  labelVariant?: "small" | "normal";
};

export function RequestStepper({
  currentStep,
  steps = DEFAULT_STEPS,
  completedLineVariant = "primary",
  labelVariant = "small",
}: RequestStepperProps) {
  return (
    <div>
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isReached = step.id <= currentStep;
          const isCompleted = step.id < currentStep;

          const lineClass =
            completedLineVariant === "muted"
              ? "bg-accent/25"
              : isCompleted
                ? "bg-primary/70"
                : "bg-accent/20";

          return (
            <div
              key={step.id}
              className={`flex items-center ${isLast ? "" : "min-w-0 flex-1"}`}
            >
              <span
                className={`font-roboto flex size-9 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ${
                  isReached
                    ? "bg-primary text-dark shadow-[0_0_16px_rgba(201,168,76,0.4)]"
                    : "garage-form-chip border border-accent/15 text-foreground-soft/50"
                }`}
              >
                {step.id}
              </span>

              {!isLast && (
                <span className={`mx-2 h-px min-w-0 flex-1 ${lineClass}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex">
        {steps.map((step, index) => {
          const isReached = step.id <= currentStep;

          return (
            <div
              key={step.id}
              className={`flex-1 ${
                index === 0
                  ? "text-left"
                  : index === steps.length - 1
                    ? "text-right"
                    : "text-center"
              }`}
            >
              {labelVariant === "normal" ? (
                <span
                  className={`font-roboto text-[10px] tracking-[0.02em] ${
                    isReached ? "font-semibold text-primary" : "text-secondary"
                  }`}
                >
                  {step.label}
                </span>
              ) : (
                <span
                  className={`font-roboto text-[9px] tracking-[0.04em] uppercase ${
                    isReached ? "text-primary" : "text-foreground-soft/50"
                  }`}
                >
                  {step.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
