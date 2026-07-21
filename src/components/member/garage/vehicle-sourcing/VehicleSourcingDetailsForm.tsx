import { useState } from "react";
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

// ── Required text fields ──────────────────────────────────────────────────────
// make, model, yearFrom, yearTo, preferredColour must be non-empty.
// category, budget, condition, timeline have enum defaults so they are always valid.
// keySpecifications and additionalNotes are optional.

const inputClassName =
  "font-roboto w-full rounded-lg border garage-form-input px-3.5 py-3 sm:py-3.5 text-[12px] sm:text-[13px] font-medium text-foreground outline-none transition-colors placeholder:text-secondary/70 focus:border-primary/45";

function inputClass(touched: boolean, value: string) {
  const empty = touched && value.trim().length === 0;
  return `${inputClassName} ${empty ? "border-pink/60" : "border-accent/15"}`;
}

const chipClassName = (selected: boolean) =>
  `font-roboto rounded-lg border px-3 py-2.5 sm:py-3 text-center text-[11px] font-semibold leading-snug transition-colors ${
    selected
      ? "garage-form-chip border-primary text-primary"
      : "garage-form-chip border-accent/15 text-secondary hover:border-accent/30"
  }`;

// Small asterisk shown beside required field labels
function RequiredMark() {
  return <span className="ml-0.5 text-primary">*</span>;
}

type VehicleSourcingDetailsFormProps = {
  value: VehicleSourcingDetailsFormState;
  onChange: (patch: Partial<VehicleSourcingDetailsFormState>) => void;
};

export function VehicleSourcingDetailsForm({
  value,
  onChange,
}: VehicleSourcingDetailsFormProps) {
  // Track which required fields have been touched (blurred at least once)
  const [touched, setTouched] = useState({
    make: false,
    model: false,
    yearFrom: false,
    yearTo: false,
    preferredColour: false,
  });

  function touch(field: keyof typeof touched) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function toggleSpec(key: SourcingSpecKey) {
    const isSelected = value.keySpecifications.includes(key);
    onChange({
      keySpecifications: isSelected
        ? value.keySpecifications.filter((spec) => spec !== key)
        : [...value.keySpecifications, key],
    });
  }

  return (
    <div className="space-y-5 sm:space-y-6">

      {/* Make & Model ─────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <RequestFieldLabel>
          Make &amp; Model<RequiredMark />
        </RequestFieldLabel>
        <div className="grid grid-cols-2 gap-2">
          <input
            value={value.make}
            onChange={(e) => onChange({ make: e.target.value })}
            onBlur={() => touch("make")}
            className={inputClass(touched.make, value.make)}
            placeholder="Make"
          />
          <input
            value={value.model}
            onChange={(e) => onChange({ model: e.target.value })}
            onBlur={() => touch("model")}
            className={inputClass(touched.model, value.model)}
            placeholder="Model"
          />
        </div>
        {(touched.make && !value.make.trim()) || (touched.model && !value.model.trim()) ? (
          <p className="font-roboto text-[10px] text-pink/80">
            {touched.make && !value.make.trim() && touched.model && !value.model.trim()
              ? "Make and model are required."
              : touched.make && !value.make.trim()
                ? "Make is required."
                : "Model is required."}
          </p>
        ) : null}
      </div>

      {/* Category ─────────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <RequestFieldLabel>Category</RequestFieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {SOURCING_CATEGORIES.map((option) => {
            const selected = value.category === option.key;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onChange({ category: option.key })}
                className={`${chipClassName(selected)} px-3.5 py-3 sm:py-3.5 text-[11px] sm:text-[12px]`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Year Range ───────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <RequestFieldLabel>
          Year Range<RequiredMark />
        </RequestFieldLabel>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <span className="font-roboto pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[12px] text-secondary">
              From:
            </span>
            <input
              value={value.yearFrom}
              onChange={(e) => onChange({ yearFrom: e.target.value })}
              onBlur={() => touch("yearFrom")}
              className={`${inputClass(touched.yearFrom, value.yearFrom)} pl-[3.5rem]`}
              placeholder="2021"
            />
          </div>
          <div className="relative">
            <span className="font-roboto pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[12px] text-secondary">
              To:
            </span>
            <input
              value={value.yearTo}
              onChange={(e) => onChange({ yearTo: e.target.value })}
              onBlur={() => touch("yearTo")}
              className={`${inputClass(touched.yearTo, value.yearTo)} pl-[2.25rem]`}
              placeholder="2024"
            />
          </div>
        </div>
        {(touched.yearFrom && !value.yearFrom.trim()) ||
        (touched.yearTo && !value.yearTo.trim()) ? (
          <p className="font-roboto text-[10px] text-pink/80">
            {touched.yearFrom && !value.yearFrom.trim() && touched.yearTo && !value.yearTo.trim()
              ? "Year range is required."
              : touched.yearFrom && !value.yearFrom.trim()
                ? "From year is required."
                : "To year is required."}
          </p>
        ) : null}
      </div>

      {/* Budget ───────────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <RequestFieldLabel>Budget (AED)</RequestFieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {SOURCING_BUDGET_OPTIONS.map((option) => {
            const selected = value.budget === option.key;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onChange({ budget: option.key })}
                className={`${chipClassName(selected)} px-3.5 py-3 sm:py-3.5 text-[11px] sm:text-[12px]`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preferred Colour ─────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <RequestFieldLabel>
          Preferred Colour<RequiredMark />
        </RequestFieldLabel>
        <input
          value={value.preferredColour}
          onChange={(e) => onChange({ preferredColour: e.target.value })}
          onBlur={() => touch("preferredColour")}
          className={inputClass(touched.preferredColour, value.preferredColour)}
          placeholder="Guards Red or Arctic Silver"
        />
        {touched.preferredColour && !value.preferredColour.trim() ? (
          <p className="font-roboto text-[10px] text-pink/80">
            Preferred colour is required.
          </p>
        ) : null}
      </div>

      {/* Key Specifications ───────────────────────────────────────────────── */}
      <div className="space-y-2">
        <RequestFieldLabel>Key Specifications</RequestFieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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

      {/* Condition ────────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <RequestFieldLabel>Condition</RequestFieldLabel>
        <div className="space-y-2">
          {SOURCING_CONDITION_OPTIONS.map((option) => {
            const selected = value.condition === option.key;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onChange({ condition: option.key })}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 sm:py-3.5 text-left transition-colors ${
                  selected
                    ? "garage-form-row border border-primary/50"
                    : "garage-form-row border border-accent/12 hover:border-accent/20"
                }`}
              >
                <RequestRadioDot selected={selected} />
                <span className="min-w-0 flex-1">
                  <span
                    className={`font-roboto block text-[12px] sm:text-[13px] ${
                      selected ? "font-semibold text-foreground" : "font-medium text-foreground"
                    }`}
                  >
                    {option.title}
                  </span>
                  <span className="font-roboto mt-0.5 block text-[10px] sm:text-[11px] text-secondary">
                    {option.subtitle}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline ─────────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <RequestFieldLabel>Timeline</RequestFieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {SOURCING_TIMELINE_OPTIONS.map((option) => {
            const selected = value.timeline === option.key;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onChange({ timeline: option.key })}
                className={`${chipClassName(selected)} px-3.5 py-3 sm:py-3.5 text-[11px] sm:text-[12px]`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional Notes ─────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <RequestFieldLabel>Additional Notes</RequestFieldLabel>
        <textarea
          value={value.additionalNotes}
          onChange={(e) => onChange({ additionalNotes: e.target.value })}
          rows={3}
          className="font-roboto min-h-[88px] sm:min-h-[100px] w-full resize-none rounded-lg border border-accent/15 garage-form-input px-3.5 py-3 sm:py-4 text-[12px] sm:text-[13px] leading-relaxed text-foreground outline-none transition-colors placeholder:text-secondary/50 focus:border-primary/45"
          placeholder="Add any sourcing preferences or requirements."
        />
      </div>

    </div>
  );
}
