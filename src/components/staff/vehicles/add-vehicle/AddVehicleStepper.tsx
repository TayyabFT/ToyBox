import { ADD_VEHICLE_STEPS } from "./types";

type AddVehicleStepperProps = {
  currentStep: number;
};

export function AddVehicleStepper({ currentStep }: AddVehicleStepperProps) {
  return (
    <div>
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
              <div className="flex shrink-0 flex-col items-center">
                <span
                  className={`flex size-10 items-center justify-center rounded-full text-xs font-semibold ${
                    isReached
                      ? "bg-primary text-white"
                      : "border border-primary/70 bg-transparent text-primary"
                  }`}
                >
                  {stepNumber}
                </span>
              </div>

              {!isLast && (
                <span
                  className={`h-px min-w-0 flex-1 ${
                    stepNumber < currentStep ||
                    (currentStep === 1 && stepNumber === 1)
                      ? "bg-primary"
                      : "bg-[#1A1A1E]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex">
        {ADD_VEHICLE_STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isReached = stepNumber <= currentStep;

          return (
            <div
              key={step.id}
              className={`flex-1 text-center ${index === 0 ? "text-left" : ""} ${index === ADD_VEHICLE_STEPS.length - 1 ? "text-right" : ""}`}
            >
              <span
                className={`font-roboto text-[9px] tracking-[0.04em] uppercase ${
                  isReached ? "text-primary" : "text-[#F0EBDB80]"
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
