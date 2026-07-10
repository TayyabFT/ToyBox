import type {
  TransportDetailsFormState,
  TransportRequestKey,
  TransportServiceTypeKey,
} from "./types";

const SERVICE_TYPES: { key: TransportServiceTypeKey; label: string }[] = [
  { key: "roadside", label: "Roadside" },
  { key: "delivery", label: "Delivery" },
  { key: "transport", label: "Transport" },
];

export const REQUEST_OPTIONS: { key: TransportRequestKey; label: string }[] = [
  { key: "pickup", label: "Pickup from storage" },
  { key: "return", label: "Return to storage" },
  { key: "custom", label: "Custom transfer" },
];

const DATE_OPTIONS = ["30", "1", "2", "3"];

const TIME_WINDOWS = ["13:00 - 15:00", "15:00 - 17:00"];

const NOTES_MAX_LENGTH = 250;

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

type TransportDeliveryDetailsFormProps = {
  value: TransportDetailsFormState;
  onChange: (patch: Partial<TransportDetailsFormState>) => void;
};

export function TransportDeliveryDetailsForm({
  value,
  onChange,
}: TransportDeliveryDetailsFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2.5">
        <FieldLabel>Service Type</FieldLabel>
        <div className="flex flex-wrap gap-2.5">
          {SERVICE_TYPES.map((type) => {
            const selected = value.serviceType === type.key;

            return (
              <button
                key={type.key}
                type="button"
                onClick={() => onChange({ serviceType: type.key })}
                className={`font-roboto rounded-lg px-4 py-2 text-[12px] font-medium transition-colors ${
                  selected
                    ? "bg-primary text-dark"
                    : "border border-accent/10 bg-dark text-foreground-soft hover:border-accent/25"
                }`}
              >
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2.5">
        <FieldLabel>Request</FieldLabel>
        <div className="space-y-2.5">
          {REQUEST_OPTIONS.map((option) => {
            const selected = value.request === option.key;

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onChange({ request: option.key })}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
                  selected
                    ? "border border-primary/50 bg-dark"
                    : "border border-transparent bg-dark hover:border-accent/15"
                }`}
              >
                <RadioDot selected={selected} />
                <span
                  className={`font-roboto text-[13px] ${
                    selected ? "font-semibold text-foreground" : "text-secondary"
                  }`}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2.5">
        <FieldLabel>Delivery Address</FieldLabel>
        <input
          value={value.address}
          onChange={(event) => onChange({ address: event.target.value })}
          className="font-roboto w-full rounded-xl border border-accent/10 bg-input-muted px-4 py-3 text-[13px] font-medium text-foreground outline-none transition-colors focus:border-primary/40"
        />
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
        <FieldLabel>Time Window</FieldLabel>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {TIME_WINDOWS.map((window) => {
            const selected = value.timeWindow === window;

            return (
              <button
                key={window}
                type="button"
                onClick={() => onChange({ timeWindow: window })}
                className={`font-roboto rounded-lg px-4 py-3 text-[12px] font-semibold transition-colors ${
                  selected
                    ? "bg-primary text-dark"
                    : "border border-accent/10 bg-dark text-foreground-soft hover:border-accent/25"
                }`}
              >
                {window}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2.5">
        <p className="font-roboto text-[10px] font-medium tracking-[0.18em] text-section-label/60 uppercase">
          Notes
        </p>
        <div className="relative">
          <textarea
            value={value.notes}
            onChange={(event) =>
              onChange({ notes: event.target.value.slice(0, NOTES_MAX_LENGTH) })
            }
            maxLength={NOTES_MAX_LENGTH}
            rows={3}
            placeholder="Please warm up the car before arrival."
            className="font-roboto w-full resize-none rounded-xl border border-accent/10 bg-input-muted px-4 py-3 text-[13px] text-foreground outline-none transition-colors placeholder:text-secondary/50 focus:border-primary/40"
          />
          <span className="font-roboto pointer-events-none absolute right-4 bottom-3 text-[10px] text-secondary/50">
            {value.notes.length}/{NOTES_MAX_LENGTH}
          </span>
        </div>
      </div>
    </div>
  );
}
