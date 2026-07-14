"use client";

import { useTheme } from "@/components/common/ThemeProvider";

type VehiclesPageHeaderProps = {
  onAddVehicleClick?: () => void;
};

export function VehiclesPageHeader({ onAddVehicleClick }: VehiclesPageHeaderProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <p className="font-roboto text-[10px] tracking-[0.18em] text-accent uppercase">
          — Vehicle Management
        </p>
        <h1 className="font-copperplate text-[36px] leading-none tracking-[0.04em] text-foreground uppercase">
          Vehicles
        </h1>
      </div>

      <button
        type="button"
        onClick={onAddVehicleClick}
        className="admin-gold-cta font-roboto shrink-0 cursor-pointer rounded-full px-6 py-3 text-[10px] font-semibold tracking-[0.16em] uppercase"
        style={
          isLight
            ? {
                backgroundColor: "#D0C8BC",
                backgroundImage:
                  "linear-gradient(90deg, #8A7D6A 0%, #D0C8BC 100%)",
                color: "#1A1816",
                boxShadow: "none",
              }
            : undefined
        }
      >
        + Add Vehicle
      </button>
    </div>
  );
}
