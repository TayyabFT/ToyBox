"use client";

import { useTheme } from "@/components/common/ThemeProvider";

type MarketplacePageHeaderProps = {
  onAddVehicleClick?: () => void;
};

export function MarketplacePageHeader({
  onAddVehicleClick,
}: MarketplacePageHeaderProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <p className="font-roboto text-[10px] tracking-[0.18em] text-accent uppercase">
          — Marketplace Management
        </p>
        <h1 className="font-copperplate text-[32px] leading-none tracking-[0.03em] text-foreground uppercase sm:text-[40px]">
          Marketplace
        </h1>
      </div>

      <button
        type="button"
        onClick={onAddVehicleClick}
        className="admin-gold-cta font-roboto w-full cursor-pointer rounded-full px-6 py-3 text-[10px] font-semibold tracking-[0.16em] uppercase sm:w-auto sm:shrink-0"
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
