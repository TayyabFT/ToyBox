type AddVehicleFileFieldProps = {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
};

export function AddVehicleFileField({
  label,
  file,
  onChange,
  error,
}: AddVehicleFileFieldProps) {
  const inputId = `file-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="font-roboto block text-[11px] tracking-[0.04em] text-foreground"
      >
        {label}
      </label>

      <div
        className={`flex overflow-hidden rounded-xl border bg-input-muted ${
          error ? "border-red-500" : "border-accent/15"
        }`}
      >
        <label
          htmlFor={inputId}
          className="font-roboto shrink-0 cursor-pointer border-r border-accent/15 bg-elevated px-4 py-3.5 text-[11px] text-secondary"
        >
          Choose File
        </label>
        <span className="font-roboto flex min-w-0 flex-1 items-center px-4 py-3.5 text-sm text-secondary/70">
          {file?.name ?? "No file chosen"}
        </span>
        <input
          id={inputId}
          type="file"
          className="hidden"
          aria-invalid={Boolean(error)}
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        />
      </div>
      {error ? (
        <p className="font-roboto text-[10px] text-red-500">{error}</p>
      ) : null}
    </div>
  );
}
