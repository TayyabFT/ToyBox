import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import { ClubhouseReservationStatusBadge } from "./ClubhouseReservationStatusBadge";
import type { ClubhouseReservationsDisplay } from "./types";

type ClubhouseReservationsSectionProps = {
  reservations: ClubhouseReservationsDisplay;
  loading?: boolean;
};

const columns = ["Time", "Member", "Zone", "Party", "Status", "Notes"] as const;

function ReservationRowSkeleton() {
  return (
    <tr className="border-b border-accent/8 last:border-b-0">
      <td className="px-5 py-4">
        <ShimmerBlock className="h-3 w-10" />
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <ShimmerBlock className="size-9 shrink-0 rounded-full" />
          <div className="min-w-0 space-y-1.5">
            <ShimmerBlock className="h-3 w-24" />
            <ShimmerBlock className="h-2.5 w-16" />
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <ShimmerBlock className="h-3 w-14" />
      </td>
      <td className="px-5 py-4 text-center">
        <ShimmerBlock className="mx-auto h-3 w-6" />
      </td>
      <td className="px-5 py-4">
        <ShimmerBlock className="h-5 w-16 rounded-full" />
      </td>
      <td className="px-5 py-4">
        <ShimmerBlock className="h-3 w-28" />
      </td>
    </tr>
  );
}

export function ClubhouseReservationsSection({
  reservations,
  loading = false,
}: ClubhouseReservationsSectionProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-1.5">
        <h2 className="font-copperplate text-[18px] leading-none tracking-[0.06em] uppercase">
          <span className="text-foreground">Today&apos;s </span>
          <span className="text-accent">Reservations</span>
        </h2>
        <p className="font-roboto text-[10px] tracking-[0.12em] text-secondary uppercase">
          {reservations.summaryLabel ??
            `${reservations.confirmedCount} Confirmed · ${reservations.walkInCount} Walk-ins`}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-accent/12 bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="border-b border-accent/8">
                {columns.map((column) => (
                  <th
                    key={column}
                    className={`font-roboto px-5 py-4 text-[10px] font-medium tracking-[0.16em] text-secondary uppercase ${
                      column === "Party" ? "text-center" : "text-left"
                    }`}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }, (_, index) => (
                  <ReservationRowSkeleton key={index} />
                ))
              ) : reservations.rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-5 py-10 text-center font-roboto text-[12px] tracking-[0.04em] text-secondary"
                  >
                    No reservations for today.
                  </td>
                </tr>
              ) : (
                reservations.rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-accent/8 last:border-b-0"
                >
                  <td className="px-5 py-4">
                    <span className="font-roboto text-[12px] font-medium tracking-[0.04em] text-accent">
                      {row.time}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="admin-gold-avatar flex size-9 shrink-0 items-center justify-center rounded-full font-copperplate text-[13px]">
                        {row.memberInitial}
                      </span>
                      <div className="min-w-0">
                        <p className="font-roboto text-[12px] font-semibold tracking-[0.06em] text-foreground uppercase">
                          {row.memberName}
                        </p>
                        <p className="font-roboto text-[10px] tracking-[0.04em] text-secondary">
                          {row.memberNumber}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-roboto text-[12px] tracking-[0.03em] text-foreground">
                      {row.zone}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="font-roboto text-[12px] tracking-[0.03em] text-foreground">
                      {row.party}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <ClubhouseReservationStatusBadge
                      status={row.status}
                      label={row.statusLabel}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-roboto text-[11px] tracking-[0.02em] text-muted">
                      {row.notes}
                    </span>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
