import {
  PreferredDatePicker,
  RequestFieldLabel,
  RequestRadioDot,
} from "../shared/requestFormUi";
import { WASH_ADD_ONS, WASH_PACKAGES } from "./washOptions";
import type { WashAddOnKey, WashDetailsFormState } from "./types";

type DetailingWashDetailsFormProps = {
  value: WashDetailsFormState;
  onChange: (patch: Partial<WashDetailsFormState>) => void;
};

export function DetailingWashDetailsForm({
  value,
  onChange,
}: DetailingWashDetailsFormProps) {
  function toggleAddOn(key: WashAddOnKey) {
    const isSelected = value.addOns.includes(key);
    onChange({
      addOns: isSelected
        ? value.addOns.filter((a) => a !== key)
        : [...value.addOns, key],
    });
  }

  return (
    <div className="space-y-6">
      {/* Request / package */}
      <div className="space-y-2.5">
        <RequestFieldLabel>Request</RequestFieldLabel>
        <div className="space-y-2.5">
          {WASH_PACKAGES.map((option) => {
            const selected = value.package === option.key;

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onChange({ package: option.key })}
                className={`flex w-full items-center gap-3 rounded-xl garage-form-row px-4 py-3 text-left transition-colors ${
                  selected
                    ? "border border-primary/60"
                    : "border border-transparent hover:border-accent/15"
                }`}
              >
                <RequestRadioDot selected={selected} />
                <span
                  className={`font-roboto min-w-0 flex-1 text-[13px] ${
                    selected ? "font-semibold text-foreground" : "text-secondary"
                  }`}
                >
                  {option.label}
                </span>
                <span
                  className={`font-roboto shrink-0 text-[12px] font-semibold ${
                    selected ? "text-primary" : "text-secondary"
                  }`}
                >
                  {option.priceLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add-ons */}
      <div className="space-y-2.5">
        <RequestFieldLabel>Add-ons</RequestFieldLabel>
        <div className="flex flex-wrap gap-2.5">
          {WASH_ADD_ONS.map((addOn) => {
            const selected = value.addOns.includes(addOn.key);

            return (
              <button
                key={addOn.key}
                type="button"
                onClick={() => toggleAddOn(addOn.key)}
                className={`font-roboto rounded-full px-4 py-2 text-[12px] font-medium transition-colors ${
                  selected
                    ? "bg-primary text-dark"
                    : "garage-form-chip border border-accent/10 text-foreground-soft hover:border-accent/25"
                }`}
              >
                {addOn.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preferred Date — shared compact picker */}
      <PreferredDatePicker
        value={value.date}
        onChange={(key) => onChange({ date: key })}
        variant="compact"
      />

      {/* Notes */}
      <div className="space-y-2.5">
        <p className="font-roboto text-[10px] font-medium tracking-[0.18em] text-section-label/60 uppercase">
          Notes
        </p>
        <textarea
          value={value.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          rows={3}
          placeholder="Take care around the wrap on rear bumper."
          className="font-roboto w-full resize-none rounded-xl border border-accent/10 bg-input-muted px-4 py-3 text-[13px] text-foreground outline-none transition-colors placeholder:text-secondary/50 focus:border-primary/40"
        />
      </div>
    </div>
  );
}
