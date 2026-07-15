"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import type { OperationStatus, VehicleOperationRow } from "./types";

const FILTERS: { key: "all" | OperationStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "overdue", label: "Overdue" },
  { key: "in-service", label: "In Service" },
  { key: "ready", label: "Ready" },
];

const STATUS_TONE: Record<OperationStatus, string> = {
  overdue: "border-pink/40 bg-pink/[0.08] text-pink",
  "in-service": "border-accent/40 bg-accent/[0.08] text-accent",
  ready: "border-teal/40 bg-teal/[0.08] text-teal",
};

const DOT_TONE: Record<OperationStatus, string> = {
  overdue: "bg-pink",
  "in-service": "bg-accent",
  ready: "bg-teal",
};

const GRID = "grid grid-cols-[120px_1.2fr_1.8fr_1.3fr_1.5fr_110px] items-center gap-4";

function StatusPill({ op }: { op: VehicleOperationRow }) {
  return (
    <span
      className={`font-roboto inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[9px] font-semibold tracking-[0.1em] uppercase ${STATUS_TONE[op.status]}`}
    >
      <span className={`size-1.5 rounded-full ${DOT_TONE[op.status]}`} />
      {op.statusLabel}
    </span>
  );
}

function ActionButton({
  status,
  vehicleId,
}: {
  status: OperationStatus;
  vehicleId: string;
}) {
  if (status === "overdue") {
    return (
      <button
        type="button"
        className="admin-gold-cta admin-resolve-btn font-roboto cursor-pointer rounded-full px-4 py-1.5 text-[9px] font-semibold tracking-[0.12em] uppercase"
      >
        Resolve
      </button>
    );
  }

  if (!vehicleId) {
    return (
      <button
        type="button"
        disabled
        className="font-roboto cursor-not-allowed rounded-full bg-accent/20 px-4 py-1.5 text-[9px] font-semibold tracking-[0.12em] text-secondary uppercase"
      >
        View
      </button>
    );
  }

  return (
    <Link
      href={`/admin/vehicles/${vehicleId}`}
      className="admin-gold-cta font-roboto inline-flex rounded-full px-4 py-1.5 text-[9px] font-semibold tracking-[0.12em] uppercase"
    >
      View
    </Link>
  );
}

type VehicleOperationsProps = {
  operations: VehicleOperationRow[];
  activeFilter: "all" | OperationStatus;
  onFilterChange: (filter: "all" | OperationStatus) => void;
  loading?: boolean;
};

export function VehicleOperations({
  operations,
  activeFilter,
  onFilterChange,
  loading = false,
}: VehicleOperationsProps) {
  const rows = useMemo(() => {
    if (activeFilter === "all") return operations;
    return operations.filter((op) => op.status === activeFilter);
  }, [activeFilter, operations]);

  return (
    <section
      className="rounded-2xl border border-accent/12 bg-card p-5"
      aria-busy={loading}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="font-copperplate text-[16px] tracking-[0.06em] text-foreground uppercase">
            Vehicle <span className="text-accent">Operations</span>
          </h2>
          <p className="font-roboto text-[9px] tracking-[0.14em] text-secondary uppercase">
            Active Status Overview
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.key;

            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => onFilterChange(filter.key)}
                className={`font-roboto cursor-pointer rounded-full px-4 py-2 text-[9px] font-semibold tracking-[0.14em] uppercase transition-colors ${
                  isActive
                    ? "admin-gold-cta"
                    : "border border-accent/25 text-secondary hover:text-accent"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="min-w-[820px]">
          <div
            className={`${GRID} border-b border-accent/10 px-3 pb-3 font-roboto text-[9px] tracking-[0.14em] text-secondary uppercase`}
          >
            <span>Bay</span>
            <span>Member</span>
            <span>Vehicle</span>
            <span>Status</span>
            <span>Last Activity</span>
            <span className="text-right">Action</span>
          </div>

          {loading && rows.length === 0 ? (
            <div className="divide-y divide-accent/8" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className={`${GRID} px-3 py-4`}>
                  <ShimmerBlock className="h-4 w-8" />
                  <div className="flex items-center gap-3">
                    <ShimmerBlock className="size-8 shrink-0 rounded-full" />
                    <div className="space-y-1.5">
                      <ShimmerBlock className="h-3 w-24" />
                      <ShimmerBlock className="h-2.5 w-16" />
                    </div>
                  </div>
                  <ShimmerBlock className="h-3 w-28" />
                  <ShimmerBlock className="h-5 w-20 rounded-full" />
                  <ShimmerBlock className="h-3 w-20" />
                  <div className="flex justify-end">
                    <ShimmerBlock className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {!loading && rows.length === 0 ? (
            <p className="font-roboto py-8 text-center text-sm text-secondary">
              No vehicles for this filter.
            </p>
          ) : null}

          <div className="divide-y divide-accent/8">
            {rows.map((op) => (
              <div
                key={op.id}
                className={`${GRID} px-3 py-4 transition-colors hover:bg-surface/40`}
              >
                <span className="font-copperplate text-[15px] text-accent">
                  {op.bay}
                </span>

                <div className="flex items-center gap-3">
                  {op.profileImageUrl ? (
                    <Image
                      src={op.profileImageUrl}
                      alt={op.member}
                      width={32}
                      height={32}
                      className="size-8 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span className="admin-gold-avatar flex size-8 shrink-0 items-center justify-center rounded-full font-roboto text-[11px] font-semibold uppercase">
                      {op.initial}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="font-roboto text-[11px] font-semibold tracking-[0.06em] text-foreground uppercase">
                      {op.member}
                    </p>
                    <p className="font-roboto text-[9px] tracking-[0.06em] text-secondary uppercase">
                      No. {op.memberNo}
                    </p>
                  </div>
                </div>

                <p className="font-roboto text-[12px] text-foreground">
                  {op.make}{" "}
                  {op.model ? (
                    <span className="text-accent italic">{op.model}</span>
                  ) : null}
                </p>

                <div>
                  <StatusPill op={op} />
                </div>

                <p className="font-roboto text-[10px] tracking-[0.04em] text-secondary">
                  {op.lastActivity}
                </p>

                <div className="flex justify-end">
                  <ActionButton status={op.status} vehicleId={op.vehicleId} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
