import type { VehicleDetailsScreenDisplay } from "@/components/admin/vehicles/types";
import type {
  AdminVehicleDetailsActivityRaw,
  AdminVehicleDetailsScreenRaw,
} from "@/types/api";

function displayValue(value?: string | number | null): string {
  if (value === null || value === undefined) return "—";
  const text = String(value).trim();
  return text || "—";
}

function activityTone(
  dotColor?: string,
  legacyTone?: string,
): VehicleDetailsScreenDisplay["activityHistory"][number]["tone"] {
  const color = (dotColor ?? legacyTone ?? "").toLowerCase();

  if (color === "green" || color === "teal" || color === "blue") {
    return "teal";
  }

  if (color === "red") {
    return "red";
  }

  return "gold";
}

function splitActivityTitle(title: string): { label: string; value: string } {
  const trimmed = title.trim();
  const splitIndex = trimmed.indexOf(" - ");

  if (splitIndex === -1) {
    return { label: trimmed, value: "" };
  }

  return {
    label: `${trimmed.slice(0, splitIndex)} -`,
    value: trimmed.slice(splitIndex + 3).trim(),
  };
}

function mapActivityHistory(
  items: AdminVehicleDetailsActivityRaw[] | undefined,
): VehicleDetailsScreenDisplay["activityHistory"] {
  return (items ?? []).map((item, index) => {
    const title = item.title?.trim() || item.label?.trim() || "Activity";
    const { label, value } = splitActivityTitle(title);

    return {
      id: item.id ?? `activity-${index}`,
      label,
      value: value || item.value?.trim() || item.detail?.trim() || "",
      meta:
        item.description?.trim() ||
        item.meta?.trim() ||
        item.time?.trim() ||
        "—",
      tone: activityTone(item.dotColor, item.tone),
    };
  });
}

export function mapAdminVehicleDetailsScreen(
  data: AdminVehicleDetailsScreenRaw | undefined,
): VehicleDetailsScreenDisplay | null {
  if (!data?.id) {
    return null;
  }

  const make = displayValue(data.make);
  const model = displayValue(data.model);
  const displayName =
    data.displayName?.trim() || [make, model].filter((part) => part !== "—").join(" ");
  const keyAssignment = data.keyAssignment;
  const bay = displayValue(keyAssignment?.bay);
  const bayCode = displayValue(keyAssignment?.bayCode);
  const levelCode = displayValue(keyAssignment?.levelCode);

  return {
    id: data.id,
    make,
    model,
    displayName: displayName || "—",
    subtitle: displayValue(data.subtitle),
    statusLabel: displayValue(data.statusLabel || data.status),
    statusKey: data.statusKey?.trim() || "",
    plate: displayValue(data.plate),
    vin: displayValue(data.vin),
    ownerInitial: displayValue(data.owner?.initial),
    ownerName: displayValue(data.owner?.name),
    ownerInfoLabel: displayValue(data.owner?.infoLabel),
    specifications: [
      { label: "Year", value: displayValue(data.year) },
      { label: "Colour", value: displayValue(data.colour) },
      { label: "Engine", value: displayValue(data.engine) },
      { label: "Miles", value: displayValue(data.mileage) },
      { label: "Plate", value: displayValue(data.plate) },
      { label: "VIN", value: displayValue(data.vin) },
    ],
    bayCode,
    levelCode,
    bayTitle:
      bay !== "—" && levelCode !== "—"
        ? `Bay ${bay} - ${levelCode}`
        : bay !== "—"
          ? `Bay ${bay}`
          : levelCode,
    storedStatus: displayValue(keyAssignment?.storedStatus),
    inspectionStatus: displayValue(keyAssignment?.inspectionStatus),
    bayDetails: [
      { label: "Stored since", value: displayValue(keyAssignment?.storedSince) },
      {
        label: "Days stored",
        value: displayValue(keyAssignment?.daysStoredLabel),
      },
      {
        label: "Last inspected by",
        value: displayValue(keyAssignment?.lastInspectedBy),
      },
    ],
    activityHistory: mapActivityHistory(data.activityHistory),
  };
}
