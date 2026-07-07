"use client";

import { useRef } from "react";
import { InspectionChecklistSection } from "./InspectionChecklistSection";
import { InspectionPhotoEvidence } from "./InspectionPhotoEvidence";
import { InspectionProgressStepper } from "./InspectionProgressStepper";
// import { FlaggedIssueBox } from "./FlaggedIssueBox";
import {
  filterChecklistForStep,
  getAdjacentStepId,
} from "@/lib/staffInspections";
import type { ActiveInspection, InspectionStepId } from "./types";

type ActiveInspectionPanelProps = {
  inspection: ActiveInspection;
  actionLoading?: boolean;
  canEditInspection?: boolean;
  onSaveDraft: () => void;
  onSubmit: () => void;
  onUploadPhoto: (file: File, itemKey?: string) => Promise<boolean>;
  onToggleChecklistItem: (itemId: string) => void;
  onStepBack: () => void;
  onStepNext: () => void;
  onStepSelect: (stepId: InspectionStepId) => void;
  onOdometerChange: (value: string) => void;
  onFuelLevelChange: (value: string) => void;
  onNotesChange: (value: string) => void;
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

export function ActiveInspectionPanel({
  inspection,
  actionLoading = false,
  canEditInspection = true,
  onSaveDraft,
  onSubmit,
  onUploadPhoto,
  onToggleChecklistItem,
  onStepBack,
  onStepNext,
  onStepSelect,
  onOdometerChange,
  onFuelLevelChange,
  onNotesChange,
}: ActiveInspectionPanelProps) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const pendingItemKeyRef = useRef<string | undefined>(undefined);
  const activeStep = inspection.steps.find(
    (step) => step.id === inspection.activeStepId,
  );
  const visibleChecklist = filterChecklistForStep(
    inspection.checklist,
    inspection.activeStepId,
  );
  const previousStep = getAdjacentStepId(inspection.activeStepId, "back");
  const nextStep = getAdjacentStepId(inspection.activeStepId, "next");

  return (
    <section className="h-fit w-full self-start rounded-2xl border border-accent/10 bg-card p-5">
      <div className="mb-5 flex flex-col gap-4 border-b border-accent/6 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="font-copperplate text-[15px] tracking-[0.04em] text-foreground uppercase">
          Active Inspection · {inspection.reference}
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          {canEditInspection ? (
            <button
              type="button"
              disabled={actionLoading}
              onClick={onSaveDraft}
              className="font-roboto cursor-pointer rounded-lg border border-accent/20 bg-surface px-4 py-2 text-[10px] font-semibold tracking-[0.1em] text-primary uppercase transition-colors hover:border-primary/35 hover:bg-accent/8 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Save Draft
            </button>
          ) : null}
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
        <InspectionProgressStepper
          steps={inspection.steps}
          onStepSelect={onStepSelect}
        />
      </div>

      <div className="space-y-6">
        <InspectionChecklistSection
          stepLabel={`Step — ${activeStep?.label ?? "Inspection"} Checklist`}
          items={visibleChecklist}
          onToggleItem={canEditInspection ? onToggleChecklistItem : undefined}
        />

        {/* Flagged issue box — hidden; Take Photo + Photo Evidence below cover the same flow.
        {inspection.flaggedIssue && (
          <FlaggedIssueBox
            tag={inspection.flaggedIssue.tag}
            notes={inspection.notes ?? inspection.flaggedIssue.notes}
            onNotesChange={canEditInspection ? onNotesChange : undefined}
            onAddPhoto={
              canEditInspection
                ? () => {
                    pendingItemKeyRef.current =
                      inspection.flaggedIssue?.itemKey ?? undefined;
                    photoInputRef.current?.click();
                  }
                : undefined
            }
          />
        )}
        */}

        <InspectionPhotoEvidence photos={inspection.photos} />

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
              value={inspection.odometer}
              onChange={(event) => onOdometerChange(event.target.value)}
              readOnly={!canEditInspection}
              disabled={!canEditInspection}
              className="font-roboto w-full rounded-xl border border-accent/15 bg-input-muted px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent/35 disabled:cursor-default disabled:opacity-80"
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
              value={inspection.fuelLevel}
              onChange={(event) => onFuelLevelChange(event.target.value)}
              readOnly={!canEditInspection}
              disabled={!canEditInspection}
              className="font-roboto w-full rounded-xl border border-accent/15 bg-input-muted px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent/35 disabled:cursor-default disabled:opacity-80"
            />
          </div>
        </div>
      </div>

      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            void onUploadPhoto(file, pendingItemKeyRef.current);
            pendingItemKeyRef.current = undefined;
          }

          event.target.value = "";
        }}
      />

      <div className="mt-6 flex flex-col gap-3 border-t border-accent/6 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          disabled={!previousStep || actionLoading}
          onClick={onStepBack}
          className="font-roboto cursor-pointer rounded-lg border border-accent/20 bg-surface px-4 py-2.5 text-[10px] font-semibold tracking-[0.1em] text-primary uppercase transition-colors hover:border-primary/35 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {previousStep
            ? `Back: ${inspection.steps.find((step) => step.id === previousStep)?.label ?? previousStep}`
            : "Back"}
        </button>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            disabled={actionLoading || !canEditInspection}
            onClick={() => {
              pendingItemKeyRef.current = undefined;
              photoInputRef.current?.click();
            }}
            className="font-roboto flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-accent/20 bg-surface px-4 py-2.5 text-[10px] font-semibold tracking-[0.1em] text-primary uppercase transition-colors hover:border-primary/35 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Take Photo
          </button>

          {nextStep ? (
            <button
              type="button"
              disabled={actionLoading}
              onClick={onStepNext}
              className="font-roboto cursor-pointer rounded-lg bg-gradient-to-r from-gold-bright to-primary px-5 py-2.5 text-[10px] font-semibold tracking-[0.1em] text-dark uppercase transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {`Next: ${inspection.steps.find((step) => step.id === nextStep)?.label ?? nextStep} >`}
            </button>
          ) : canEditInspection ? (
            <button
              type="button"
              disabled={actionLoading}
              onClick={onSubmit}
              className="font-roboto cursor-pointer rounded-lg bg-gradient-to-r from-gold-bright to-primary px-5 py-2.5 text-[10px] font-semibold tracking-[0.1em] text-dark uppercase transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Submit Report
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
