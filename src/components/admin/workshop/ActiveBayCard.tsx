import type { ActiveBayItem } from "./types";
import { Chip } from "@/components/ui/Chip";
import type { ChipTone } from "@/components/ui/Chip";

const STATUS_TONE: Record<string, ChipTone> = {
  overdue:        "pink",
  active:         "teal",
  "final-check":  "teal",
  "in-transit":   "gold",
  "track-repairs": "purple",
};

const timeToneClass = {
  pink: "text-pink",
  gold: "text-accent",
  teal: "text-teal",
} as const;

type ActiveBayCardProps = {
  bay: ActiveBayItem;
};

export function ActiveBayCard({ bay }: ActiveBayCardProps) {
  const timeClass = timeToneClass[bay.timeTone ?? "gold"];

  return (
    <article className="flex min-h-[220px] flex-col rounded-xl border border-[var(--overview-border)] bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-roboto text-[10px] font-semibold tracking-[0.16em] text-accent uppercase">
          {bay.bay}
        </p>
        <Chip
          label={bay.statusLabel}
          context="inline"
          tone={STATUS_TONE[bay.status] ?? "neutral"}
          shape="pill"
        />
      </div>

      <div className="mb-3 space-y-1.5">
        <p className="font-roboto text-[13px] font-semibold leading-tight tracking-[0.05em] uppercase">
          <span className="text-foreground-soft">{bay.vehicleMake} </span>
          <span className="text-accent">{bay.vehicleModel}</span>
        </p>
        <p className="font-roboto text-[10px] tracking-[0.1em] text-secondary uppercase">
          {bay.memberName} · {bay.memberNumber}
        </p>
      </div>

      <p className="font-roboto mb-4 flex-1 text-[13px] leading-[1.65] tracking-[0.02em] text-muted">
        {bay.description}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--overview-border)] pt-3.5">
        <div className="flex items-center gap-2">
          <span
            className={`size-2 shrink-0 rounded-full ${
              bay.engineer === "Unassigned" ? "bg-secondary" : "bg-teal"
            }`}
          />
          <span className="font-roboto text-[11px] tracking-[0.04em] text-foreground-soft">
            {bay.engineer}
            {bay.engineerRole ? (
              <span className="text-secondary"> · {bay.engineerRole}</span>
            ) : null}
          </span>
        </div>
        <span
          className={`font-roboto shrink-0 text-[11px] font-medium tracking-[0.06em] uppercase ${timeClass}`}
        >
          {bay.timeLabel}
        </span>
      </div>
    </article>
  );
}
