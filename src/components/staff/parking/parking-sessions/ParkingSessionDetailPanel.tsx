"use client";

import { ParkingSessionStatusBadge } from "./ParkingSessionStatusBadge";
import {
  PARKING_SESSION_ACTION_LABELS,
  type ParkingSessionAction,
  type ParkingSessionDetail,
} from "./types";

type ParkingSessionDetailPanelProps = {
  detail: ParkingSessionDetail | null;
  loading: boolean;
  actionLoading?: boolean;
  onAction: (action: ParkingSessionAction) => void;
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

function actionButtonClass(action: ParkingSessionAction) {
  if (action === "accept") {
    return "border-primary/35 bg-primary/10 text-primary hover:border-primary/55 hover:bg-primary/15";
  }

  if (action === "start") {
    return "border-vehicle-blue/35 bg-vehicle-blue/10 text-vehicle-blue hover:border-vehicle-blue/55 hover:bg-vehicle-blue/15";
  }

  return "border-teal/35 bg-teal/10 text-teal hover:border-teal/55 hover:bg-teal/15";
}

export function ParkingSessionDetailPanel({
  detail,
  loading,
  actionLoading = false,
  onAction,
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
          {detail.nextAction ? (
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => onAction(detail.nextAction!)}
              className={`font-roboto cursor-pointer rounded-lg border px-4 py-2 text-[10px] font-medium tracking-[0.1em] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${actionButtonClass(detail.nextAction)}`}
            >
              {actionLoading
                ? "Processing..."
                : PARKING_SESSION_ACTION_LABELS[detail.nextAction].submit}
            </button>
          ) : null}
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
          <p className="font-roboto rounded-xl border border-accent/15 bg-input-muted px-4 py-3 text-sm leading-relaxed text-foreground">
            {detail.memberNotes}
          </p>
        </div>
      ) : null}

      {detail.staffNotes ? (
        <div className="border-t border-accent/10 px-5 py-5 sm:px-6">
          <p className="font-roboto mb-2 text-[9px] tracking-[0.12em] text-secondary uppercase">
            Staff Notes
          </p>
          <p className="font-roboto rounded-xl border border-accent/15 bg-input-muted px-4 py-3 text-sm leading-relaxed text-foreground">
            {detail.staffNotes}
          </p>
        </div>
      ) : null}
    </section>
  );
}
