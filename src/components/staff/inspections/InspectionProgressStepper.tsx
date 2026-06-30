import { ActivityCheck } from "@/components/common/Svgs";
import type { InspectionStep } from "./types";

type InspectionProgressStepperProps = {
  steps: InspectionStep[];
};

export function InspectionProgressStepper({
  steps,
}: InspectionProgressStepperProps) {
  return (
    <div>
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          return (
            <div
              key={step.id}
              className={`flex items-center ${isLast ? "" : "min-w-0 flex-1"}`}
            >
              <div className="flex shrink-0 flex-col items-center">
                <span
                  className={`flex size-8 items-center justify-center rounded-full border text-[11px] font-semibold ${
                    step.state === "complete"
                      ? "border-teal/40 bg-teal/15 text-teal"
                      : step.state === "active"
                        ? "border-primary bg-primary text-dark"
                        : "border-accent/20 bg-elevated text-secondary"
                  }`}
                >
                  {step.state === "complete" ? (
                    <ActivityCheck color="var(--teal)" className="size-3.5" />
                  ) : (
                    index + 1
                  )}
                </span>
              </div>

              {!isLast && (
                <span
                  className={`mx-1 h-px min-w-0 flex-1 ${
                    step.state === "complete" ? "bg-teal/50" : "bg-accent/15"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex-1 text-center ${index === 0 ? "text-left" : ""} ${index === steps.length - 1 ? "text-right" : ""}`}
          >
            <span
              className={`font-roboto text-[9px] tracking-[0.08em] uppercase ${
                step.state === "active"
                  ? "text-primary"
                  : step.state === "complete"
                    ? "text-teal"
                    : "text-secondary"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
