import { MemberGarageConciergeChatIcon } from "@/components/common/Svgs";
import {
  RequestFieldLabel,
  RequestRadioDot,
} from "../shared/requestFormUi";
import {
  SOURCING_BUDGET_OPTIONS,
  SOURCING_CATEGORIES,
  SOURCING_CONDITION_OPTIONS,
  SOURCING_SPEC_OPTIONS,
  SOURCING_TIMELINE_OPTIONS,
} from "./sourcingOptions";
import type { SourcingSpecKey, VehicleSourcingDetailsFormState } from "./types";

const inputClassName =
  "font-roboto w-full rounded-lg border border-accent/15 garage-form-input px-4 py-3.5 text-[13px] font-medium text-foreground outline-none transition-colors placeholder:text-secondary/70 focus:border-primary/45";

const chipClassName = (selected: boolean) =>
  `font-roboto rounded-lg border px-3 py-3 text-center text-[11px] font-semibold leading-snug transition-colors ${
    selected
      ? "garage-form-chip border-primary text-primary"
      : "garage-form-chip border-accent/15 text-secondary hover:border-accent/30"
  }`;

type VehicleSourcingDetailsFormProps = {
  value: VehicleSourcingDetailsFormState;
  onChange: (patch: Partial<VehicleSourcingDetailsFormState>) => void;
};

export function VehicleSourcingDetailsForm({
  value,
  onChange,
}: VehicleSourcingDetailsFormProps) {
  function toggleSpec(key: SourcingSpecKey) {
    const isSelected = value.keySpecifications.includes(key);
    onChange({
      keySpecifications: isSelected
        ? value.keySpecifications.filter((spec) => spec !== key)
        : [...value.keySpecifications, key],
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2.5">
        <RequestFieldLabel>Make &amp; Model</RequestFieldLabel>
        <div className="grid grid-cols-2 gap-2.5">
          <input
            value={value.make}
            onChange={(event) => onChange({ make: event.target.value })}
            className={inputClassName}
            placeholder="Make"
          />
          <input
            value={value.model}
            onChange={(event) => onChange({ model: event.target.value })}
            className={inputClassName}
            placeholder="Model"
          />
        </div>
      </div>

      <div className="space-y-2.5">
        <RequestFieldLabel>Category</RequestFieldLabel>
        <div className="grid grid-cols-2 gap-2.5">
          {SOURCING_CATEGORIES.map((option) => {
            const selected = value.category === option.key;

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onChange({ category: option.key })}
                className={`${chipClassName(selected)} px-4 py-3.5 text-[12px]`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2.5">
        <RequestFieldLabel>Year Range</RequestFieldLabel>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="relative">
            <span className="font-roboto pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[13px] text-secondary">
              From:
            </span>
            <input
              value={value.yearFrom}
              onChange={(event) => onChange({ yearFrom: event.target.value })}
              className={`${inputClassName} pl-[3.75rem]`}
              placeholder="2021"
            />
          </div>
          <div className="relative">
            <span className="font-roboto pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[13px] text-secondary">
              To:
            </span>
            <input
              value={value.yearTo}
              onChange={(event) => onChange({ yearTo: event.target.value })}
              className={`${inputClassName} pl-[2.35rem]`}
              placeholder="2024"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        <RequestFieldLabel>Budget (AED)</RequestFieldLabel>
        <div className="grid grid-cols-2 gap-2.5">
          {SOURCING_BUDGET_OPTIONS.map((option) => {
            const selected = value.budget === option.key;

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onChange({ budget: option.key })}
                className={`${chipClassName(selected)} px-4 py-3.5 text-[12px]`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2.5">
        <RequestFieldLabel>Preferred Colour</RequestFieldLabel>
        <input
          value={value.preferredColour}
          onChange={(event) => onChange({ preferredColour: event.target.value })}
          className={inputClassName}
          placeholder="Guards Red or Arctic Silver"
        />
      </div>

      <div className="space-y-2.5">
        <RequestFieldLabel>Key Specifications</RequestFieldLabel>
        <div className="grid grid-cols-3 gap-2.5">
          {SOURCING_SPEC_OPTIONS.map((option) => {
            const selected = value.keySpecifications.includes(option.key);

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => toggleSpec(option.key)}
                className={chipClassName(selected)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2.5">
        <RequestFieldLabel>Condition</RequestFieldLabel>
        <div className="space-y-2.5">
          {SOURCING_CONDITION_OPTIONS.map((option) => {
            const selected = value.condition === option.key;

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onChange({ condition: option.key })}
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

      <div className="space-y-2.5">
        <RequestFieldLabel>Timeline</RequestFieldLabel>
        <div className="grid grid-cols-2 gap-2.5">
          {SOURCING_TIMELINE_OPTIONS.map((option) => {
            const selected = value.timeline === option.key;

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onChange({ timeline: option.key })}
                className={`${chipClassName(selected)} px-4 py-3.5 text-[12px]`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2.5">
        <RequestFieldLabel>Additional Notes</RequestFieldLabel>
        <textarea
          value={value.additionalNotes}
          onChange={(event) => onChange({ additionalNotes: event.target.value })}
          rows={4}
          className="font-roboto min-h-[100px] w-full resize-none rounded-lg border border-accent/15 garage-form-input px-4 py-4 text-[13px] leading-relaxed text-foreground outline-none transition-colors placeholder:text-secondary/50 focus:border-primary/45"
          placeholder="Add any sourcing preferences or requirements."
        />
      </div>

      <div className="space-y-2.5">
        <RequestFieldLabel>Assigned To</RequestFieldLabel>
        <div className="flex items-center gap-3 rounded-xl border border-accent/12 garage-form-row px-4 py-3.5">
          <span className="font-roboto flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/8 text-[13px] font-semibold text-primary">
            JA
          </span>

          <div className="min-w-0 flex-1">
            <p className="font-roboto text-[13px] font-semibold text-foreground">
              James Alderton
            </p>
            <p className="font-roboto mt-0.5 text-[11px] text-secondary">
              2 options ready to review
            </p>
          </div>

          <button
            type="button"
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary transition-colors hover:border-primary/60 hover:bg-primary/15"
            aria-label="Message sourcing specialist"
          >
            <MemberGarageConciergeChatIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
