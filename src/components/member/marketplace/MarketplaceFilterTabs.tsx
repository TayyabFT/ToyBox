"use client";

import {
  MARKETPLACE_FILTERS,
  type MarketplaceFilterId,
} from "./types";

type Props = {
  active: MarketplaceFilterId;
  onChange: (filter: MarketplaceFilterId) => void;
};

export function MarketplaceFilterTabs({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {MARKETPLACE_FILTERS.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() => onChange(f.id)}
          className={`font-roboto whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.14em] uppercase transition-all ${
            active === f.id
              ? "border-accent bg-accent/10 text-accent"
              : "border-accent/15 text-secondary/60 hover:border-accent/30 hover:text-secondary"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
