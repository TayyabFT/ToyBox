"use client";

import { useMemo, useState } from "react";
import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import { MarketplaceVehicleStatusBadge } from "./MarketplaceStatusBadge";
import type { MarketplaceVehicleItem } from "./types";

type MarketplaceVehiclesPanelProps = {
  vehicles: MarketplaceVehicleItem[];
  loading?: boolean;
  onEdit: (vehicle: MarketplaceVehicleItem) => void;
  onDelete: (vehicle: MarketplaceVehicleItem) => void;
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "available", label: "Available" },
  { key: "reserved", label: "Reserved" },
  { key: "sold", label: "Sold" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

export function MarketplaceVehiclesPanel({
  vehicles,
  loading = false,
  onEdit,
  onDelete,
}: MarketplaceVehiclesPanelProps) {
  const [filter, setFilter] = useState<FilterKey>("all");

  const rows = useMemo(() => {
    if (filter === "all") return vehicles;
    return vehicles.filter((vehicle) => vehicle.statusTone === filter);
  }, [filter, vehicles]);

  return (
    <section
      className="rounded-2xl border border-accent/12 bg-card p-5"
      aria-busy={loading}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="font-copperplate text-[16px] tracking-[0.06em] text-foreground uppercase">
            Marketplace <span className="text-accent">Vehicles</span>
          </h2>
          <p className="font-roboto text-[9px] tracking-[0.14em] text-secondary uppercase">
            Listings · Price − Discount = Final
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => {
            const active = filter === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={`font-roboto cursor-pointer rounded-full px-3 py-1.5 text-[9px] font-semibold tracking-[0.1em] uppercase ${
                  active
                    ? "admin-gold-cta"
                    : "border border-accent/25 text-secondary"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse">
          <thead>
            <tr className="border-b border-accent/10">
              {["Vehicle", "Year / Specs", "Price", "Final"].map((label) => (
                <th
                  key={label}
                  className="font-roboto px-3 pb-3 text-left text-[9px] font-medium tracking-[0.12em] text-secondary uppercase"
                >
                  {label}
                </th>
              ))}
              <th className="font-roboto px-3 pb-3 text-center text-[9px] font-medium tracking-[0.12em] text-secondary uppercase">
                Status
              </th>
              <th className="font-roboto sticky right-0 bg-card px-3 pb-3 text-right text-[9px] font-medium tracking-[0.12em] text-secondary uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index} className="border-b border-accent/6 last:border-b-0">
                  <td className="px-3 py-4" colSpan={6}>
                    <ShimmerBlock className="h-12 w-full rounded-xl" />
                  </td>
                </tr>
              ))
            ) : rows.length > 0 ? (
              rows.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  className="border-b border-accent/6 transition-colors last:border-b-0 hover:bg-accent/3"
                >
                  <td className="min-w-0 px-3 py-4">
                    <p className="font-roboto truncate text-[13px] font-semibold text-foreground">
                      {vehicle.title}
                    </p>
                    <p className="font-roboto truncate text-[10px] tracking-[0.06em] text-secondary uppercase">
                      {[vehicle.make, vehicle.model, vehicle.variant]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </p>
                  </td>

                  <td className="min-w-0 px-3 py-4">
                    <p className="font-roboto text-[12px] text-foreground">
                      {vehicle.year || "—"}
                    </p>
                    <p className="font-roboto truncate text-[10px] text-secondary uppercase">
                      {vehicle.mileageLabel}
                      {vehicle.color ? ` · ${vehicle.color}` : ""}
                    </p>
                  </td>

                  <td className="min-w-0 px-3 py-4">
                    <p className="font-roboto text-[12px] text-foreground">
                      {vehicle.priceLabel}
                    </p>
                    {vehicle.discount > 0 ? (
                      <p className="font-roboto text-[10px] text-secondary uppercase">
                        Disc {vehicle.discountLabel}
                      </p>
                    ) : null}
                  </td>

                  <td className="px-3 py-4">
                    <p className="font-roboto text-[12px] font-semibold text-accent">
                      {vehicle.finalPriceLabel}
                    </p>
                  </td>

                  <td className="px-3 py-4 text-center">
                    <div className="flex justify-center">
                      <MarketplaceVehicleStatusBadge
                        label={vehicle.statusLabel}
                        tone={vehicle.statusTone}
                      />
                    </div>
                  </td>

                  <td className="sticky right-0 bg-card px-3 py-4 text-right">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(vehicle)}
                        className="admin-gold-cta font-roboto cursor-pointer rounded-full px-3 py-1.5 text-[9px] font-semibold tracking-[0.1em] uppercase"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(vehicle)}
                        className="font-roboto cursor-pointer rounded-full border border-pink/35 bg-pink/8 px-3 py-1.5 text-[9px] font-semibold tracking-[0.1em] text-pink uppercase transition-colors hover:border-pink/50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="font-roboto px-3 py-10 text-center text-sm text-secondary"
                >
                  No marketplace vehicles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
