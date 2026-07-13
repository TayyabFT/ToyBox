"use client";

import { ParkingSessionStatusBadge } from "./ParkingSessionStatusBadge";
import type { ParkingSessionDetail } from "./types";

type ParkingSessionDetailPanelProps = {
  detail: ParkingSessionDetail | null;
  loading: boolean;
};

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="font-roboto text-[9px] tracking-[0.12em] text-secondary uppercase">
        {label}
      </p>
      <p className="font-roboto text-sm text-foreground">{value}</p>
    </div>
  );
}

export function ParkingSessionDetailPanel({
  detail,
  loading,
}: ParkingSessionDetailPanelProps) {
  if (loading || !detail) {
    return (
      <section className="overflow-hidden rounded-2xl border border-accent/12 bg-card px-5 py-8 text-center">
        <p className="font-roboto text-sm text-secondary">
          {loading ? "Loading session details..." : "Select a parking request"}
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-accent/12 bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-accent/10 px-5 py-4">
        <div className="space-y-1">
          <p className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
            Session Detail
          </p>
          <h3 className="font-copperplate text-[20px] uppercase text-foreground">
            {detail.reference}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ParkingSessionStatusBadge
            status={detail.status}
            label={detail.statusLabel}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-b border-accent/10 px-5 py-5 md:grid-cols-4">
        <InfoCell label="Member" value={detail.memberName} />
        <InfoCell label="Vehicle" value={detail.vehicleName} />
        <InfoCell
          label="Plate"
          value={detail.vehiclePlate || "—"}
        />
        <InfoCell label="Bay" value={detail.slotCode} />
        <InfoCell label="Zone" value={detail.slotZone} />
        <InfoCell label="Level" value={detail.slotLevel} />
        <InfoCell label="Requested" value={detail.requestedAtLabel} />
        <InfoCell label="Accepted" value={detail.acceptedAtLabel} />
        <InfoCell label="Started" value={detail.startedAtLabel} />
        <InfoCell label="Completed" value={detail.completedAtLabel} />
      </div>

      {detail.memberNotes ? (
        <div className="border-t border-accent/10 px-5 py-5 sm:px-6">
          <p className="font-roboto mb-2 text-[9px] tracking-[0.12em] text-secondary uppercase">
            Member Notes
          </p>
          <p className="font-roboto rounded-xl border border-accent/12 bg-[#11100C] px-4 py-3 text-sm leading-relaxed text-foreground">
            {detail.memberNotes}
          </p>
        </div>
      ) : null}

      {detail.staffNotes ? (
        <div className="border-t border-accent/10 px-5 py-5 sm:px-6">
          <p className="font-roboto mb-2 text-[9px] tracking-[0.12em] text-secondary uppercase">
            Staff Notes
          </p>
          <p className="font-roboto rounded-xl border border-accent/12 bg-[#11100C] px-4 py-3 text-sm leading-relaxed text-foreground">
            {detail.staffNotes}
          </p>
        </div>
      ) : null}
    </section>
  );
}
