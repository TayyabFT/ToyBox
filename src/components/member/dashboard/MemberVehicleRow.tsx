import Link from "next/link";
import type { MemberVehicleItem } from "@/components/member/dashboard/types";

const statusConfig: Record<string, { label: string; cls: string }> = {
  ready: {
    label: "Ready",
    cls: "border-teal/30 bg-teal/8 text-teal",
  },
  in_service: {
    label: "In Service",
    cls: "border-pink/30 bg-pink/8 text-pink",
  },
  scheduled: {
    label: "Scheduled",
    cls: "border-accent/30 bg-accent/8 text-primary",
  },
};

function getStatus(status: string) {
  return statusConfig[status] ?? { label: status, cls: "border-accent/20 bg-accent/6 text-secondary" };
}

type MemberVehicleRowProps = {
  vehicle: MemberVehicleItem;
};

export function MemberVehicleRow({ vehicle }: MemberVehicleRowProps) {
  const st = getStatus(vehicle.status);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-accent/8 bg-card px-4 py-3 transition-colors hover:border-accent/16 cursor-pointer">
      {/* Thumbnail — ~60px wide */}
      <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-elevated">
        {vehicle.imageUrl ? (
          <img src={vehicle.imageUrl} alt={vehicle.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 16H5.5L6.5 13H17.5L18.5 16H20" stroke="var(--muted)" strokeWidth="1" />
              <path d="M4 16H20V18.5C20 18.78 19.78 19 19.5 19H4.5C4.22 19 4 18.78 4 18.5V16Z" stroke="var(--muted)" strokeWidth="1" />
              <circle cx="7" cy="18.5" r="1" fill="var(--muted)" />
              <circle cx="17" cy="18.5" r="1" fill="var(--muted)" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="font-roboto truncate text-[12px] font-medium tracking-[0.01em] text-foreground">
          {vehicle.name}
        </p>
        <div className="flex items-center gap-1.5 text-[9px]">
          <p className="font-roboto tracking-[0.1em] text-secondary/60 uppercase">{vehicle.plate}</p>
          {vehicle.lastService && (
            <>
              <span className="text-secondary/30">·</span>
              <p className="font-roboto tracking-[0.02em] text-secondary/60">{vehicle.lastService}</p>
            </>
          )}
        </div>
      </div>

      {/* Status badge + Details button */}
      <div className="flex shrink-0 items-center gap-2">
        <span className={`font-roboto rounded-full border px-2.5 py-0.5 text-[8px] font-medium tracking-[0.12em] uppercase ${st.cls}`}>
          {st.label}
        </span>
        <Link
          href="/member/vehicles"
          className="font-roboto rounded-lg border border-accent/20 bg-accent/5 px-3 py-1 text-[8px] font-semibold tracking-[0.18em] text-primary uppercase transition-colors hover:border-primary/35 hover:bg-primary/8"
        >
          Details
        </Link>
      </div>
    </div>
  );
}
