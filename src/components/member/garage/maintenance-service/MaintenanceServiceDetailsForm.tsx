import {
  MemberServiceCentreStarIcon,
  MemberServiceCentreWorkshopIcon,
} from "@/components/common/Svgs";
import {
  PreferredDatePicker,
  RequestFieldLabel,
  RequestRadioDot,
} from "../shared/requestFormUi";
import {
  MAINTENANCE_SERVICE_CENTRES,
  MAINTENANCE_SERVICE_TYPES,
  MAINTENANCE_TIME_OPTIONS,
  MAINTENANCE_VEHICLES,
} from "./maintenanceOptions";
import type { MaintenanceDetailsFormState } from "./types";

type MaintenanceServiceDetailsFormProps = {
  value: MaintenanceDetailsFormState;
  onChange: (patch: Partial<MaintenanceDetailsFormState>) => void;
};

function ServiceCentreIcon({ type }: { type: "star" | "workshop" }) {
  const base =
    "flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/35 bg-primary/8";

  if (type === "star") {
    return (
      <span className={base}>
        <MemberServiceCentreStarIcon className="size-[18px]" />
      </span>
    );
  }

  return (
    <span className={`${base} border-accent/20 bg-accent/5`}>
      <MemberServiceCentreWorkshopIcon className="size-[18px]" />
    </span>
  );
}

export function MaintenanceServiceDetailsForm({
  value,
  onChange,
}: MaintenanceServiceDetailsFormProps) {
  return (
    <div className="space-y-6">
      {/* Vehicle */}
      <div className="space-y-2.5">
        <RequestFieldLabel>Vehicle</RequestFieldLabel>
        <div className="flex flex-wrap gap-2.5">
          {MAINTENANCE_VEHICLES.map((vehicle) => {
            const selected = value.vehicle === vehicle.key;

            return (
              <button
                key={vehicle.key}
                type="button"
                onClick={() => onChange({ vehicle: vehicle.key })}
                className={`font-roboto rounded-full px-4 py-2 text-[12px] font-medium transition-colors ${
                  selected
                    ? "bg-primary text-dark"
                    : "garage-form-chip border border-accent/15 text-secondary hover:border-accent/30"
                }`}
              >
                {vehicle.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Service Type */}
      <div className="space-y-2.5">
        <RequestFieldLabel>Service Type</RequestFieldLabel>
        <div className="space-y-2.5">
          {MAINTENANCE_SERVICE_TYPES.map((option) => {
            const selected = value.serviceType === option.key;

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onChange({ serviceType: option.key })}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-colors ${
                  selected
                    ? "garage-form-row border border-primary/50"
                    : "garage-form-row border border-accent/12 hover:border-accent/20"
                }`}
              >
                <RequestRadioDot selected={selected} />
                <span className="min-w-0 flex-1">
                  <span
                    className={`font-roboto block text-[13px] ${
                      selected
                        ? "font-semibold text-foreground"
                        : "font-medium text-foreground"
                    }`}
                  >
                    {option.title}
                  </span>
                  <span className="font-roboto mt-0.5 block text-[11px] text-secondary">
                    {option.subtitle}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Service Centre */}
      <div className="space-y-2.5">
        <RequestFieldLabel>Preferred Service Centre</RequestFieldLabel>
        <div className="space-y-2.5">
          {MAINTENANCE_SERVICE_CENTRES.map((centre) => {
            const selected = value.serviceCentre === centre.key;

            return (
              <button
                key={centre.key}
                type="button"
                onClick={() => onChange({ serviceCentre: centre.key })}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-colors ${
                  selected
                    ? "garage-form-row border border-primary/50"
                    : "garage-form-row border border-accent/12 hover:border-accent/20"
                }`}
              >
                <ServiceCentreIcon type={centre.icon} />
                <span className="min-w-0 flex-1">
                  <span
                    className={`font-roboto block text-[13px] ${
                      selected
                        ? "font-semibold text-foreground"
                        : "font-medium text-foreground"
                    }`}
                  >
                    {centre.title}
                  </span>
                  <span className="font-roboto mt-0.5 block text-[11px] text-secondary">
                    {centre.subtitle}
                  </span>
                </span>
                <RequestRadioDot selected={selected} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Issue description */}
      <div className="space-y-2.5">
        <RequestFieldLabel>Describe the Issue</RequestFieldLabel>
        <textarea
          value={value.issueDescription}
          onChange={(e) => onChange({ issueDescription: e.target.value })}
          rows={3}
          placeholder="Tell us what needs attention."
          className="font-roboto min-h-[86px] w-full resize-none rounded-lg border border-accent/15 garage-form-input px-4 py-4 text-[14px] leading-relaxed text-foreground outline-none transition-colors placeholder:text-secondary/50 focus:border-primary/45"
        />
      </div>

      {/* Preferred Date — shared tall picker */}
      <PreferredDatePicker
        value={value.preferredDate}
        onChange={(key) => onChange({ preferredDate: key })}
        variant="tall"
      />

      {/* Preferred Time */}
      <div className="space-y-2.5">
        <RequestFieldLabel>Preferred Time</RequestFieldLabel>
        <div className="grid grid-cols-2 gap-2.5">
          {MAINTENANCE_TIME_OPTIONS.map((option) => {
            const selected = value.preferredTime === option.key;

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onChange({ preferredTime: option.key })}
                className={`font-roboto rounded-lg border px-4 py-3.5 text-[13px] font-semibold transition-colors ${
                  selected
                    ? "border-primary bg-primary/6 text-primary"
                    : "garage-form-chip border-accent/15 text-secondary hover:border-accent/30"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
