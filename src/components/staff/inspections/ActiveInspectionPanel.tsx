import { FlaggedIssueBox } from "./FlaggedIssueBox";
import { InspectionChecklistSection } from "./InspectionChecklistSection";
import { InspectionProgressStepper } from "./InspectionProgressStepper";
import type { ActiveInspection } from "./types";

type ActiveInspectionPanelProps = {
  inspection: ActiveInspection;
};

function InfoCell({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="font-roboto text-[9px] tracking-[0.12em] text-section-label uppercase">
        {label}
      </p>
      <div className="font-roboto text-[13px] font-medium tracking-[0.02em] text-foreground">
        {value}
      </div>
    </div>
  );
}

export function ActiveInspectionPanel({ inspection }: ActiveInspectionPanelProps) {
  const activeStep = inspection.steps.find(
    (step) => step.id === inspection.activeStepId,
  );

  return (
    <section className="rounded-2xl border border-accent/10 bg-card p-5">
      <div className="mb-5 flex flex-col gap-4 border-b border-accent/6 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="font-copperplate text-[15px] tracking-[0.04em] text-foreground uppercase">
          Active Inspection · {inspection.reference}
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="font-roboto cursor-pointer rounded-lg border border-accent/20 bg-surface px-4 py-2 text-[10px] font-semibold tracking-[0.1em] text-primary uppercase transition-colors hover:border-primary/35 hover:bg-accent/8"
          >
            Save Draft
          </button>
          <button
            type="button"
            className="font-roboto cursor-pointer rounded-lg bg-gradient-to-r from-gold-bright to-primary px-5 py-2 text-[10px] font-semibold tracking-[0.1em] text-dark uppercase transition-opacity hover:opacity-90"
          >
            Submit Report
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 border-b border-accent/6 pb-6 lg:grid-cols-4">
        <InfoCell label="Vehicle" value={inspection.vehicle} />
        <InfoCell label="Bay" value={inspection.bay} />
        <InfoCell label="Mileage" value={inspection.mileage} />
        <InfoCell
          label="Inspection Type"
          value={
            <span className="inline-flex rounded-full border border-primary/35 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.08em] text-primary uppercase">
              {inspection.inspectionType}
            </span>
          }
        />
      </div>

      <div className="mb-6">
        <InspectionProgressStepper steps={inspection.steps} />
      </div>

      <div className="space-y-6">
        <InspectionChecklistSection
          stepLabel={`Step 2 — ${activeStep?.label ?? "Interior"} Checklist`}
          items={inspection.checklist}
        />

        {inspection.flaggedIssue && (
          <FlaggedIssueBox
            tag={inspection.flaggedIssue.tag}
            notes={inspection.flaggedIssue.notes}
          />
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="odometer"
              className="font-roboto block text-[10px] tracking-[0.1em] text-section-label uppercase"
            >
              Odometer Reading (km)
            </label>
            <input
              id="odometer"
              readOnly
              value={inspection.odometer}
              className="font-roboto w-full rounded-xl border border-accent/15 bg-dark px-4 py-3 text-sm text-foreground outline-none"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="fuel-level"
              className="font-roboto block text-[10px] tracking-[0.1em] text-section-label uppercase"
            >
              Fuel Level
            </label>
            <input
              id="fuel-level"
              readOnly
              value={inspection.fuelLevel}
              className="font-roboto w-full rounded-xl border border-accent/15 bg-dark px-4 py-3 text-sm text-foreground outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-accent/6 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          className="font-roboto cursor-pointer rounded-lg border border-accent/20 bg-surface px-4 py-2.5 text-[10px] font-semibold tracking-[0.1em] text-primary uppercase transition-colors hover:border-primary/35"
        >
          Back: Exterior
        </button>

        <button
          type="button"
          className="font-roboto flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-accent/20 bg-surface px-4 py-2.5 text-[10px] font-semibold tracking-[0.1em] text-primary uppercase transition-colors hover:border-primary/35"
        >
          Take Photo
        </button>

        <button
          type="button"
          className="font-roboto cursor-pointer rounded-lg bg-gradient-to-r from-gold-bright to-primary px-5 py-2.5 text-[10px] font-semibold tracking-[0.1em] text-dark uppercase transition-opacity hover:opacity-90"
        >
          Next: Mechanical &gt;
        </button>
      </div>
    </section>
  );
}
