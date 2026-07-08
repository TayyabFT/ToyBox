import type { GarageVehicleStatusTone, MemberVehicleDetail } from "./types";

const statusToneClass: Record<GarageVehicleStatusTone, string> = {
  ready: "border-teal/30 bg-teal/10 text-teal",
  in_service: "border-pink/30 bg-pink/10 text-pink",
  away: "border-accent/25 bg-accent/8 text-secondary",
};

type MemberVehicleHeroCardProps = {
  vehicle: MemberVehicleDetail;
};

export function MemberVehicleHeroCard({ vehicle }: MemberVehicleHeroCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-accent/10 bg-card">
      <div className="relative h-[240px] w-full">
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
          <h2 className="font-copperplate text-[18px] leading-tight uppercase">
            <span className="text-foreground">{vehicle.make} </span>
            <span className="text-primary">{vehicle.model}</span>
          </h2>
          <p className="font-roboto text-[10px] tracking-[0.1em] text-secondary uppercase">
            {vehicle.detail}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3 bg-accent/10 p-4 rounded-lg">
          {vehicle.stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-copperplate text-[18px] leading-none text-foreground text-center">
                {stat.value}
              </p>
              <p className="font-roboto mt-1.5 text-[9px] tracking-[0.12em] text-secondary uppercase text-center">
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

          <button
            type="button"
            className="font-roboto flex shrink-0 items-center gap-1 rounded-full border border-accent/25 px-4 py-2 text-[9px] font-semibold tracking-[0.14em] text-primary bg-accent/8 uppercase transition-colors hover:border-primary/40 hover:bg-accent/8"
          >
            View Document
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path
                d="M4.5 2.5L8 6L4.5 9.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
