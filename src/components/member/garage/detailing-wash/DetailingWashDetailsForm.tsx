import type {
  WashAddOnKey,
  WashDetailsFormState,
  WashPackageKey,
} from "./types";
import { WASH_ADD_ONS, WASH_PACKAGES } from "./washOptions";

const DATE_OPTIONS = ["30", "1", "2", "3"];

function FieldLabel({ children }: { children: string }) {
  return (
    <p className="font-roboto text-[10px] font-medium tracking-[0.18em] text-section-label uppercase">
      {children}
    </p>
  );
}

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <span
      className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
        selected ? "border-primary" : "border-secondary/40"
      }`}
    >
      {selected ? <span className="size-2.5 rounded-full bg-primary" /> : null}
    </span>
  );
}

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
        ? value.addOns.filter((addOn) => addOn !== key)
        : [...value.addOns, key],
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2.5">
        <FieldLabel>Request</FieldLabel>
        <div className="space-y-2.5">
          {WASH_PACKAGES.map((option) => {
            const selected = value.package === option.key;

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onChange({ package: option.key })}
                className={`flex w-full items-center gap-3 rounded-xl bg-dark px-4 py-3 text-left transition-colors ${
                  selected
                    ? "border border-primary/60"
                    : "border border-transparent hover:border-accent/15"
                }`}
              >
                <RadioDot selected={selected} />
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

      <div className="space-y-2.5">
        <FieldLabel>Add-ons</FieldLabel>
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
                    : "border border-accent/10 bg-dark text-foreground-soft hover:border-accent/25"
                }`}
              >
                {addOn.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2.5">
        <FieldLabel>Preferred Date</FieldLabel>
        <div className="grid grid-cols-4 gap-2.5">
          {DATE_OPTIONS.map((day) => {
            const selected = value.date === day;

            return (
              <button
                key={day}
                type="button"
                onClick={() => onChange({ date: day })}
                className={`font-roboto flex h-11 items-center justify-center rounded-lg text-[12px] font-semibold transition-colors ${
                  selected
                    ? "bg-primary text-dark"
                    : "border border-accent/10 bg-dark text-foreground-soft hover:border-accent/25"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2.5">
        <p className="font-roboto text-[10px] font-medium tracking-[0.18em] text-section-label/60 uppercase">
          Notes
        </p>
        <textarea
          value={value.notes}
          onChange={(event) => onChange({ notes: event.target.value })}
          rows={3}
          placeholder="Take care around the wrap on rear bumper."
          className="font-roboto w-full resize-none rounded-xl border border-accent/10 bg-input-muted px-4 py-3 text-[13px] text-foreground outline-none transition-colors placeholder:text-secondary/50 focus:border-primary/40"
        />
      </div>
    </div>
  );
}
