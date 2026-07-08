import { ActivityCheck } from "@/components/common/Svgs";
import type { InspectionStep, InspectionStepId } from "./types";

type InspectionProgressStepperProps = {
  steps: InspectionStep[];
  onStepSelect?: (stepId: InspectionStepId) => void;
};

export function InspectionProgressStepper({
  steps,
  onStepSelect,
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
              <button
                type="button"
                onClick={() => onStepSelect?.(step.id)}
                disabled={!onStepSelect}
                className={`flex shrink-0 flex-col items-center ${
                  onStepSelect ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <span
                  className={`flex size-8 items-center justify-center rounded-full border text-[11px] font-semibold transition-opacity ${
                    step.state === "complete"
                      ? "border-teal/40 bg-teal/15 text-teal"
                      : step.state === "active"
                        ? "border-accent bg-accent text-dark"
                        : "border-accent/25 bg-input-muted text-secondary"
                  } ${onStepSelect ? "hover:opacity-85" : ""}`}
                >
                  {step.state === "complete" ? (
                    <ActivityCheck color="var(--teal)" className="size-3.5" />
                  ) : (
                    index + 1
                  )}
                </span>
              </button>

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
          <button
            key={step.id}
            type="button"
            onClick={() => onStepSelect?.(step.id)}
            disabled={!onStepSelect}
            className={`flex-1 text-center ${index === 0 ? "text-left" : ""} ${index === steps.length - 1 ? "text-right" : ""} ${
              onStepSelect ? "cursor-pointer" : "cursor-default"
            }`}
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
          </button>
        ))}
      </div>
    </div>
  );
}
