"use client";

import { useMemo, useState } from "react";
import { ClubhouseFilterTabs } from "./ClubhouseFilterTabs";
import { ClubhouseReservationStatusBadge } from "./ClubhouseReservationStatus";
import type {
  ClubhouseReservationsSummary,
  ClubhouseZoneFilter,
} from "./types";

const columns = ["Time", "Member", "Zone", "Pax", "Status"] as const;

type ClubhouseReservationsPanelProps = {
  summary: ClubhouseReservationsSummary;
};

export function ClubhouseReservationsPanel({
  summary,
}: ClubhouseReservationsPanelProps) {
  const [activeFilter, setActiveFilter] = useState<ClubhouseZoneFilter>("all");

  const visibleReservations = useMemo(() => {
    if (activeFilter === "all") {
      return summary.reservations;
    }

    return summary.reservations.filter(
      (reservation) => reservation.zoneFilter === activeFilter,
    );
  }, [activeFilter, summary.reservations]);

  return (
    <section className="overflow-hidden rounded-2xl border border-accent/10 bg-card">
      <div className="flex flex-col gap-4 border-b border-accent/8 p-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1.5">
          <h2 className="font-copperplate text-[18px] leading-none tracking-[0.06em] uppercase">
            <span className="text-foreground">Today&apos;s </span>
            <span className="text-accent">Reservations</span>
          </h2>
          <p className="font-roboto text-[10px] tracking-[0.12em] text-secondary uppercase">
            {summary.confirmedCount} confirmed · {summary.walkInCount} walk-ins
          </p>
        </div>

        <ClubhouseFilterTabs active={activeFilter} onChange={setActiveFilter} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr className="border-b border-accent/8">
              {columns.map((column) => (
                <th
                  key={column}
                  className={`font-roboto px-5 py-4 text-[10px] font-medium tracking-[0.16em] text-secondary uppercase ${
                    column === "Pax"
                      ? "text-center"
                      : column === "Status"
                        ? "text-end"
                        : "text-left"
                  }`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleReservations.map((reservation) => (
              <tr
                key={reservation.id}
                className="border-b border-accent/8 last:border-b-0"
              >
                <td className="px-5 py-4">
                  <span className="font-roboto text-[12px] font-medium tracking-[0.04em] text-accent">
                    {reservation.time}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-roboto flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold uppercase ${reservation.avatarClass}`}
                    >
                      {reservation.memberInitial}
                    </span>
                    <div className="min-w-0">
                      <p className="font-roboto text-[12px] font-semibold tracking-[0.06em] text-foreground uppercase">
                        {reservation.memberName}
                      </p>
                      <p className="font-roboto text-[10px] tracking-[0.04em] text-secondary">
                        {reservation.memberNumber}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="font-roboto text-[12px] tracking-[0.03em] text-foreground">
                    {reservation.zone}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="font-roboto text-[12px] tracking-[0.03em] text-foreground">
                    {reservation.pax}
                  </span>
                </td>
                <td className="px-5 py-4 text-end">
                  <ClubhouseReservationStatusBadge
                    status={reservation.status}
                    detail={reservation.statusDetail}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-accent/8 p-5">
        <button
          type="button"
          className="font-roboto w-full cursor-pointer rounded-xl border border-accent/20 bg-transparent px-4 py-3 text-[11px] font-semibold tracking-[0.12em] text-primary uppercase transition-colors hover:border-primary/35 hover:bg-accent/8"
        >
          View More reservations
        </button>
      </div>
    </section>
  );
}
