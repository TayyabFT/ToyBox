import {
  DOC_FIELDS,
  HEALTH_CATEGORIES,
  type AddVehicleFormState,
} from "@/components/staff/vehicles/add-vehicle/types";
import type { AddVehicleInventoryRequest } from "@/types/api";
function parsePurchasedAt(value: string): string {
  const trimmed = value.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const parsed = Date.parse(trimmed);

  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toISOString().slice(0, 10);
  }

  const monthYear = trimmed.match(/^([A-Za-z]+)\s+(\d{4})$/);

  if (monthYear) {
    const date = new Date(`${monthYear[1]} 1, ${monthYear[2]}`);

    if (!Number.isNaN(date.getTime())) {
      return date.toISOString().slice(0, 10);
    }
  }

  return trimmed;
}

export { validateAddVehicleForm } from "@/lib/addVehicleValidation";

export function hasDocumentFiles(form: AddVehicleFormState): boolean {
  return Object.values(form.docs).some((file) => file !== null);
}

export function buildAddVehicleJsonPayload(
  form: AddVehicleFormState,
): AddVehicleInventoryRequest {
  const { vehicleInfo, ownershipInfo, health } = form;
  const make = vehicleInfo.name.trim() || vehicleInfo.model.trim();

  return {
    vehicleInfo: {
      name: make,
      make,
      model: vehicleInfo.model.trim(),
      year: Number.parseInt(vehicleInfo.year, 10),
      engine: vehicleInfo.engine.trim(),
      power: vehicleInfo.power.trim(),
      transmission: vehicleInfo.transmission.trim(),
      drive: vehicleInfo.drive.trim(),
      zeroToHundred: vehicleInfo.zeroToHundred.trim(),
      topSpeed: vehicleInfo.topSpeed.trim(),
    },
    ownershipInfo: {
      colour: ownershipInfo.colour.trim(),
      chassisNo: ownershipInfo.chassisNo.trim(),
      plate: ownershipInfo.plate.trim(),
      purchasedAt: parsePurchasedAt(ownershipInfo.purchased),
      storageBay: ownershipInfo.storageBay.trim(),
      mileage: ownershipInfo.mileage.trim(),
    },
    health: HEALTH_CATEGORIES.map(({ key }) => ({
      category: key,
      percentage: health[key].percentage,
      ...(health[key].note.trim() ? { note: health[key].note.trim() } : {}),
    })),
    status: "Stored",
    isPriority: false,
  };
}

export function buildAddVehicleFormData(form: AddVehicleFormState): FormData {
  const payload = buildAddVehicleJsonPayload(form);
  const formData = new FormData();
  const { vehicleInfo, ownershipInfo } = payload;

  formData.append("name", vehicleInfo.name ?? "");
  formData.append("make", vehicleInfo.make ?? "");
  formData.append("model", vehicleInfo.model);
  formData.append("year", String(vehicleInfo.year));
  formData.append("engine", vehicleInfo.engine);
  formData.append("power", vehicleInfo.power);
  formData.append("transmission", vehicleInfo.transmission);
  formData.append("drive", vehicleInfo.drive);
  formData.append("zeroToHundred", vehicleInfo.zeroToHundred);
  formData.append("topSpeed", vehicleInfo.topSpeed);
  formData.append("colour", ownershipInfo.colour);
  formData.append("chassisNo", ownershipInfo.chassisNo);
  formData.append("plate", ownershipInfo.plate);
  formData.append("purchasedAt", ownershipInfo.purchasedAt);
  formData.append("storageBay", ownershipInfo.storageBay);
  formData.append("mileage", ownershipInfo.mileage);
  formData.append("health", JSON.stringify(payload.health));
  formData.append("status", payload.status ?? "Stored");
  formData.append("isPriority", String(payload.isPriority ?? false));

  for (const field of DOC_FIELDS) {
    const file = form.docs[field.key];

    if (file) {
      formData.append(field.key, file);
    }
  }

  return formData;
}
