import { AddVehicleHealthField } from "./AddVehicleHealthField";
import { HEALTH_CATEGORIES, type HealthForm } from "./types";
import type { HealthErrors } from "@/lib/addVehicleValidation";

type HealthStepProps = {
  value: HealthForm;
  onChange: (value: HealthForm) => void;
  errors?: HealthErrors;
};

export function HealthStep({ value, onChange, errors }: HealthStepProps) {
  return (
    <div className="space-y-6">
      {HEALTH_CATEGORIES.map((category) => (
        <AddVehicleHealthField
          key={category.key}
          label={category.label}
          value={value[category.key]}
          error={errors?.[category.key]}
          onChange={(item) =>
            onChange({ ...value, [category.key]: item })
          }
        />
      ))}
    </div>
  );
}
