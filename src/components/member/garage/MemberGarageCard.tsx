import Link from "next/link";
import type { GarageVehicle, GarageVehicleStatusTone } from "./types";

const statusToneClass: Record<GarageVehicleStatusTone, string> = {
  ready: "border-teal/30 bg-teal/10 text-teal",
  in_service: "border-pink/30 bg-pink/10 text-pink",
  away: "border-accent/25 bg-accent/8 text-secondary",
};

type MemberGarageCardProps = {
  vehicle: GarageVehicle;
};

export function MemberGarageCard({ vehicle }: MemberGarageCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-accent/10 bg-card">
      <div className="relative h-[220px] w-full">
        <img
          src={vehicle.imageUrl}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="h-full w-full object-cover"
        />

        {vehicle.statusLabel && (
          <span
            className={`font-roboto absolute left-3 top-3 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-semibold tracking-[0.16em] uppercase ${statusToneClass[vehicle.statusTone]}`}
          >
            <span className="size-1.5 rounded-full bg-current" />
            {vehicle.statusLabel}
          </span>
        )}

        {vehicle.bayLabel && (
          <span className="font-roboto absolute right-3 top-3 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[9px] font-semibold tracking-[0.16em] text-white/85 uppercase backdrop-blur-sm">
            {vehicle.bayLabel}
          </span>
        )}
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-1">
          <h3 className="font-copperplate text-[16px] leading-tight uppercase">
            <span className="text-foreground">{vehicle.make} </span>
            <span className="text-primary">{vehicle.model}</span>
          </h3>
          <p className="font-roboto text-[10px] tracking-[0.1em] text-secondary uppercase">
            {vehicle.detail}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {vehicle.stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-copperplate text-[20px] leading-none text-foreground">
                {stat.value}
              </p>
              <p className="font-roboto mt-1.5 text-[9px] tracking-[0.12em] text-secondary uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-accent/10 pt-4">
          <div className="space-y-0.5">
            <p className="font-roboto text-[9px] tracking-[0.12em] text-secondary/70 uppercase">
              {vehicle.lastInspectedLabel}
            </p>
            <p className="font-roboto text-[11px] text-foreground/80">
              {vehicle.lastInspectedValue}
            </p>
          </div>

          <Link
            href={`/member/vehicles/${vehicle.id}`}
            className="font-roboto flex shrink-0 items-center gap-1 rounded-full border border-accent/25 px-4 py-2 text-[9px] font-semibold tracking-[0.14em] text-primary uppercase transition-colors hover:border-primary/40 hover:bg-accent/8"
          >
            Details
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path
                d="M4.5 2.5L8 6L4.5 9.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
