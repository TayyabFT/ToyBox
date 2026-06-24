import type { InputHTMLAttributes } from "react";

type AddVehicleFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function AddVehicleField({
  label,
  id,
  className = "",
  error,
  ...props
}: AddVehicleFieldProps) {
  const fieldId = id ?? props.name;

  return (
    <div className="space-y-2">
      <label
        htmlFor={fieldId}
        className="font-roboto block text-[11px] tracking-[0.04em] text-foreground"
      >
        {label}
      </label>
      <input
        id={fieldId}
        aria-invalid={Boolean(error)}
        className={`font-roboto w-full rounded-xl border bg-dark px-4 py-3.5 text-sm text-secondary outline-none transition-colors placeholder:text-secondary/80 focus:border-accent/35 ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-accent/15"
        } ${className}`}
        {...props}
      />
      {error ? (
        <p className="font-roboto text-[10px] text-red-500">{error}</p>
      ) : null}
    </div>
  );
}
