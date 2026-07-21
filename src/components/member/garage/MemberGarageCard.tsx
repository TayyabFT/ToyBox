import Link from "next/link";
import { MemberGarageChevronRight } from "@/components/common/Svgs";
import type { GarageVehicle, GarageVehicleStatusTone } from "./types";

const statusToneClass: Record<GarageVehicleStatusTone, string> = {
  ready:      "border-teal/60 bg-teal/25 text-teal",
  in_service: "border-accent/60 bg-accent/25 text-accent",
  away:       "border-accent/50 bg-dark/85 text-accent backdrop-blur-sm",
  stored:     "border-accent/50 bg-dark/85 text-accent backdrop-blur-sm",
  in_review:  "border-pink/60 bg-pink/20 text-pink backdrop-blur-sm",
};

type MemberGarageCardProps = {
  vehicle: GarageVehicle;
};

export function MemberGarageCard({ vehicle }: MemberGarageCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-accent/10 bg-card">
      <div className="relative h-[180px] sm:h-[220px] w-full bg-elevated">
        {vehicle.imageUrl ? (
          <img
            src={vehicle.imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M4 16H5.5L6.5 13H17.5L18.5 16H20"
                stroke="var(--muted)"
                strokeWidth="1"
              />
              <path
                d="M4 16H20V18.5C20 18.78 19.78 19 19.5 19H4.5C4.22 19 4 18.78 4 18.5V16Z"
                stroke="var(--muted)"
                strokeWidth="1"
              />
              <circle cx="7" cy="18.5" r="1" fill="var(--muted)" />
              <circle cx="17" cy="18.5" r="1" fill="var(--muted)" />
            </svg>
          </div>
        )}

        {vehicle.statusLabel && (
          <span
            className={`font-roboto absolute left-3 top-3 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-semibold tracking-[0.16em] uppercase ${statusToneClass[vehicle.statusTone]}`}
          >
            <span className="size-1.5 rounded-full bg-current" />
            {vehicle.statusLabel}
          </span>
        )}

        {vehicle.bayLabel && (
          <span className="font-roboto absolute right-3 top-3 rounded-full border border-foreground/20 bg-background/60 px-2.5 py-1 text-[9px] font-semibold tracking-[0.16em] text-foreground/85 uppercase backdrop-blur-sm">
            {vehicle.bayLabel}
          </span>
        )}
      </div>

      <div className="space-y-3 sm:space-y-4 p-4 sm:p-5">
        <div className="space-y-1">
          <h3 className="font-copperplate text-[15px] sm:text-[16px] leading-tight uppercase">
            <span className="text-foreground">{vehicle.make} </span>
            <span className="text-primary">{vehicle.model}</span>
          </h3>
          <p className="font-roboto text-[10px] tracking-[0.1em] text-secondary uppercase">
            {vehicle.detail}
          </p>
        </div>

        <div className="grid min-w-0 grid-cols-3 gap-2 rounded-xl bg-elevated p-2.5 sm:p-3">
          {vehicle.stats.map((stat) => (
            <div key={stat.label} className="min-w-0 overflow-hidden">
              <p
                className="font-copperplate truncate text-[16px] sm:text-[18px] leading-tight tabular-nums text-foreground"
                title={stat.value}
              >
                {stat.value}
              </p>
              <p className="font-roboto mt-1 sm:mt-1.5 truncate text-[8.5px] sm:text-[9px] tracking-[0.12em] text-secondary uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-accent/10 pt-3 sm:pt-4">
          <div className="space-y-0.5">
            <p className="font-roboto text-[9px] tracking-[0.12em] text-secondary/70 uppercase">
              {vehicle.lastInspectedLabel}
            </p>
            <p className="font-roboto text-[11px] text-foreground/80">
              {vehicle.lastInspectedValue}
            </p>
          </div>

          <Link
            href={`/member/garage/${vehicle.id}`}
            className="font-roboto flex shrink-0 items-center gap-1 rounded-full border border-accent/20 bg-elevated px-3 sm:px-4 py-2 text-[9px] font-semibold tracking-[0.14em] text-foreground/70 uppercase transition-colors hover:border-primary/40 hover:bg-accent/8 hover:text-primary"
          >
            Details
            <MemberGarageChevronRight className="size-[10px]" color="currentColor" />
          </Link>
        </div>
      </div>
    </div>
  );
}
