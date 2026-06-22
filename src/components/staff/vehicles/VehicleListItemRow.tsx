import { VehicleListCarIcon } from "@/components/common/Svgs";
import { VehicleStatusBadge } from "./VehicleStatusBadge";
import type { VehicleListItem, VehicleStatus } from "./types";

type VehicleListItemRowProps = {
  vehicle: VehicleListItem;
  selected: boolean;
  onSelect: () => void;
};

function splitVehicleName(name: string): { brand: string; model: string } {
  const parts = name.trim().split(/\s+/);

  if (parts.length <= 1) {
    return { brand: name, model: "" };
  }

  return {
    brand: parts[0],
    model: parts.slice(1).join(" "),
  };
}

function getStatusAccentColor(status: VehicleStatus): string {
  switch (status) {
    case "overdue":
      return "var(--pink)";
    case "dispatched":
      return "#6B9EC4";
    case "away":
      return "var(--secondary)";
    default:
      return "var(--primary)";
  }
}

export function VehicleListItemRow({
  vehicle,
  selected,
  onSelect,
}: VehicleListItemRowProps) {
  const { brand, model } = splitVehicleName(vehicle.name);
  const accentColor = selected ? "var(--primary)" : getStatusAccentColor(vehicle.status);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex w-full cursor-pointer items-center gap-3 border-b border-[#D4A8470F] px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-[#D4A84708] ${
        selected ? "bg-[#D4A8470D]" : "bg-transparent"
      }`}
    >
      {selected && (
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-[3px] bg-[#D4A847]"
        />
      )}

      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#E8B84B33] bg-[#E8B84B14]">
        <VehicleListCarIcon color={accentColor} className="h-[10px] w-[19px]" />
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={`font-copperplate truncate text-[12px] tracking-[0.04em] ${
            selected ? "text-primary" : ""
          }`}
        >
          {selected ? (
            vehicle.name
          ) : (
            <>
              <span className="text-[#F2EAD5]">{brand}</span>
              {model ? (
                <>
                  {" "}
                  <span className="text-primary">{model}</span>
                </>
              ) : null}
            </>
          )}
        </span>

        <span className="mt-1 block font-roboto truncate text-[9px] tracking-[0.06em] text-secondary uppercase">
          {vehicle.bay} · {vehicle.member} ·
        </span>

        <span className="mt-0.5 block font-roboto text-[9px] tracking-[0.06em] text-secondary uppercase">
          {vehicle.mileage}
        </span>
      </span>

      <span className="flex shrink-0 flex-col items-end gap-2 self-stretch justify-center">
        <span className="font-roboto text-[10px] tracking-[0.06em] text-primary uppercase">
          {vehicle.bay}
        </span>
        <VehicleStatusBadge status={vehicle.status} />
      </span>
    </button>
  );
}
