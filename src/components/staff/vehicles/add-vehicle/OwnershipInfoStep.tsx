import { AddVehicleField } from "./AddVehicleField";
import type { OwnershipInfoForm } from "./types";
import type { OwnershipInfoErrors } from "@/lib/addVehicleValidation";

type OwnershipInfoStepProps = {
  value: OwnershipInfoForm;
  onChange: (value: OwnershipInfoForm) => void;
  errors?: OwnershipInfoErrors;
};

export function OwnershipInfoStep({
  value,
  onChange,
  errors,
}: OwnershipInfoStepProps) {
  function updateField<K extends keyof OwnershipInfoForm>(
    field: K,
    fieldValue: OwnershipInfoForm[K],
  ) {
    onChange({ ...value, [field]: fieldValue });
  }

  return (
    <div className="space-y-4">
      <AddVehicleField
        label="Colour"
        name="colour"
        placeholder="Nero Assassino"
        value={value.colour}
        error={errors?.colour}
        onChange={(event) => updateField("colour", event.target.value)}
      />
      <AddVehicleField
        label="Chassis No."
        name="chassisNo"
        placeholder="ZHWEC2ZF0NLA14901"
        value={value.chassisNo}
        error={errors?.chassisNo}
        onChange={(event) => updateField("chassisNo", event.target.value)}
      />
      <AddVehicleField
        label="Plate"
        name="plate"
        placeholder="Dubai - A 12345"
        value={value.plate}
        error={errors?.plate}
        onChange={(event) => updateField("plate", event.target.value)}
      />
      <AddVehicleField
        label="Purchased"
        name="purchased"
        placeholder="Jan 2022"
        value={value.purchased}
        error={errors?.purchased}
        onChange={(event) => updateField("purchased", event.target.value)}
      />
      <AddVehicleField
        label="Storage bay"
        name="storageBay"
        placeholder="Bay A-04, Level 1"
        value={value.storageBay}
        error={errors?.storageBay}
        onChange={(event) => updateField("storageBay", event.target.value)}
      />
      <AddVehicleField
        label="Mileage"
        name="mileage"
        placeholder="12,450 km"
        value={value.mileage}
        error={errors?.mileage}
        onChange={(event) => updateField("mileage", event.target.value)}
      />
    </div>
  );
}
