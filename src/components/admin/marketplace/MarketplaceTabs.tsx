import type { MarketplaceTab } from "./types";

type MarketplaceTabsProps = {
  activeTab: MarketplaceTab;
  vehicleCount: number;
  offerCount: number;
  onChange: (tab: MarketplaceTab) => void;
};

const TABS: { id: MarketplaceTab; label: string }[] = [
  { id: "vehicles", label: "Vehicles" },
  { id: "offers", label: "Offers" },
];

export function MarketplaceTabs({
  activeTab,
  vehicleCount,
  offerCount,
  onChange,
}: MarketplaceTabsProps) {
  const counts: Record<MarketplaceTab, number> = {
    vehicles: vehicleCount,
    offers: offerCount,
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {TABS.map((tab) => {
        const active = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`font-roboto cursor-pointer rounded-full px-4 py-2 text-[10px] font-semibold tracking-[0.12em] uppercase transition-colors ${
              active
                ? "admin-gold-cta"
                : "border border-accent/25 text-secondary hover:border-accent/40 hover:text-foreground"
            }`}
          >
            {tab.label}
            <span className="ml-2 opacity-80">{counts[tab.id]}</span>
          </button>
        );
      })}
    </div>
  );
}
