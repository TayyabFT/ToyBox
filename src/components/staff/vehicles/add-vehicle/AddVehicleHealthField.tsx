import type { HealthItemForm } from "./types";

type AddVehicleHealthFieldProps = {
  label: string;
  value: HealthItemForm;
  onChange: (value: HealthItemForm) => void;
  error?: string;
};

export function AddVehicleHealthField({
  label,
  value,
  onChange,
  error,
}: AddVehicleHealthFieldProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="font-roboto text-[11px] tracking-[0.04em] text-foreground">
          {label}
        </span>
        <button
          type="button"
          onClick={() =>
            onChange({ ...value, noteOpen: !value.noteOpen })
          }
          className="font-roboto cursor-pointer text-[10px] tracking-[0.06em] text-primary uppercase"
        >
          + Add Note
        </button>
      </div>

      <div className="space-y-2">
        <div className="relative h-8 w-full">
          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-accent/15">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${value.percentage}%` }}
            />
          </div>

          <span
            className="pointer-events-none absolute top-1/2 z-20 size-3 -translate-y-1/2 rounded-full border-2 border-primary bg-primary"
            style={{ left: `calc(${value.percentage}% - 6px)` }}
          />

          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={value.percentage}
            onChange={(event) =>
              onChange({
                ...value,
                percentage: Number(event.target.value),
              })
            }
            onInput={(event) =>
              onChange({
                ...value,
                percentage: Number(event.currentTarget.value),
              })
            }
            className="add-vehicle-range absolute inset-0 z-10 m-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>
        <p className="text-center font-roboto text-[10px] text-secondary">
          {value.percentage}%
        </p>
      </div>

      {value.noteOpen && (
        <div className="space-y-2">
          <textarea
            rows={3}
            value={value.note}
            placeholder="Enter Note"
            aria-invalid={Boolean(error)}
            onChange={(event) =>
              onChange({ ...value, note: event.target.value })
            }
            className={`font-roboto w-full resize-none rounded-xl border bg-dark px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-secondary/70 focus:border-accent/35 ${
              error
                ? "border-red-500 focus:border-red-500"
                : "border-accent/15"
            }`}
          />
          {error ? (
            <p className="font-roboto text-[10px] text-red-500">
              {error}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
