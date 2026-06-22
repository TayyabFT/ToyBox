import { AddVehicleFileField } from "./AddVehicleFileField";
import { DOC_FIELDS, type DocsForm } from "./types";
import type { DocsErrors } from "@/lib/addVehicleValidation";

type DocsStepProps = {
  value: DocsForm;
  onChange: (value: DocsForm) => void;
  errors?: DocsErrors;
};

export function DocsStep({ value, onChange, errors }: DocsStepProps) {
  return (
    <div className="space-y-4">
      {DOC_FIELDS.map((field) => (
        <AddVehicleFileField
          key={field.key}
          label={field.label}
          file={value[field.key]}
          error={errors?.[field.key]}
          onChange={(file) => onChange({ ...value, [field.key]: file })}
        />
      ))}
    </div>
  );
}
