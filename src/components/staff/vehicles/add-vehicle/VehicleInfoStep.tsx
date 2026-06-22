import { AddVehicleField } from "./AddVehicleField";
import type { VehicleInfoForm } from "./types";
import type { VehicleInfoErrors } from "@/lib/addVehicleValidation";

type VehicleInfoStepProps = {
  value: VehicleInfoForm;
  onChange: (value: VehicleInfoForm) => void;
  errors?: VehicleInfoErrors;
};

export function VehicleInfoStep({
  value,
  onChange,
  errors,
}: VehicleInfoStepProps) {
  function updateField<K extends keyof VehicleInfoForm>(
    field: K,
    fieldValue: VehicleInfoForm[K],
  ) {
    onChange({ ...value, [field]: fieldValue });
  }

  return (
    <div className="space-y-4">
      <AddVehicleField
        label="Name"
        name="name"
        placeholder="Lamborghini"
        value={value.name}
        error={errors?.name}
        onChange={(event) => updateField("name", event.target.value)}
      />
      <AddVehicleField
        label="Model"
        name="model"
        placeholder="Huracan STO"
        value={value.model}
        error={errors?.model}
        onChange={(event) => updateField("model", event.target.value)}
      />
      <AddVehicleField
        label="Year"
        name="year"
        placeholder="2022"
        inputMode="numeric"
        value={value.year}
        error={errors?.year}
        onChange={(event) => updateField("year", event.target.value)}
      />
      <AddVehicleField
        label="Engine"
        name="engine"
        placeholder="5.2L Naturally Aspirated V10"
        value={value.engine}
        error={errors?.engine}
        onChange={(event) => updateField("engine", event.target.value)}
      />
      <AddVehicleField
        label="Power"
        name="power"
        placeholder="640 hp . 565 Nm"
        value={value.power}
        error={errors?.power}
        onChange={(event) => updateField("power", event.target.value)}
      />
      <AddVehicleField
        label="Transmission"
        name="transmission"
        placeholder="7-speed LDF dual-clutch"
        value={value.transmission}
        error={errors?.transmission}
        onChange={(event) => updateField("transmission", event.target.value)}
      />
      <AddVehicleField
        label="Drive"
        name="drive"
        placeholder="Rear-wheel drive"
        value={value.drive}
        error={errors?.drive}
        onChange={(event) => updateField("drive", event.target.value)}
      />
      <AddVehicleField
        label="0-100 km/h"
        name="zeroToHundred"
        placeholder="3.0 seconds"
        value={value.zeroToHundred}
        error={errors?.zeroToHundred}
        onChange={(event) => updateField("zeroToHundred", event.target.value)}
      />
      <AddVehicleField
        label="Top Speed"
        name="topSpeed"
        placeholder="310 km/h"
        value={value.topSpeed}
        error={errors?.topSpeed}
        onChange={(event) => updateField("topSpeed", event.target.value)}
      />
    </div>
  );
}
