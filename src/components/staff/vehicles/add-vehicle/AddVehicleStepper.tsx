import { ADD_VEHICLE_STEPS } from "./types";

type AddVehicleStepperProps = {
  currentStep: number;
};

export function AddVehicleStepper({ currentStep }: AddVehicleStepperProps) {
  return (
    <div>
      {/* Circles + connector row */}
      <div className="flex items-center">
        {ADD_VEHICLE_STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isReached = stepNumber <= currentStep;
          const isLast = index === ADD_VEHICLE_STEPS.length - 1;

          return (
            <div
              key={step.id}
              className={`flex items-center ${isLast ? "" : "min-w-0 flex-1"}`}
            >
              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  isReached
                    ? "staff-add-cta bg-primary text-white"
                    : "border border-primary/70 bg-transparent text-primary"
                }`}
              >
                {stepNumber}
              </span>

              {!isLast && (
                <span
                  className={`h-px min-w-0 flex-1 ${
                    stepNumber < currentStep
                      ? "bg-primary"
                      : "bg-stepper-inactive"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Labels row — each label centered under its circle using the same flex layout */}
      <div className="mt-2 flex items-start">
        {ADD_VEHICLE_STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isReached = stepNumber <= currentStep;
          const isLast = index === ADD_VEHICLE_STEPS.length - 1;

          return (
            <div
              key={step.id}
              className={`flex ${isLast ? "" : "min-w-0 flex-1"} items-start`}
            >
              {/* Label centered under the 40px (size-10) circle */}
              <div className="relative w-10 shrink-0 flex justify-center">
                <span
                  className={`font-roboto absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] tracking-[0.04em] text-center uppercase ${
                    isReached ? "text-primary" : "text-foreground-soft/50"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Spacer matching the connector line */}
              {!isLast && <span className="min-w-0 flex-1" />}
            </div>
          );
        })}
      </div>

      {/* Reserve space for the absolutely-positioned labels */}
      <div className="h-4" />
    </div>
  );
}
