import Link from "next/link";
import type { MemberVehicleItem } from "./types";
import { MemberVehicleRow } from "./MemberVehicleRow";

type MemberCollectionSectionProps = {
  vehicles: MemberVehicleItem[];
};

export function MemberCollectionSection({ vehicles }: MemberCollectionSectionProps) {
  return (
    <div className="space-y-3">
      {/* Figma header: Copperplate ~11px, white + gold split, subtitle muted */}
      <div className="flex items-center justify-between gap-3 pb-1">
        <div className="space-y-0.5">
          <h2 className="font-copperplate text-[11px] tracking-[0.06em] leading-tight uppercase">
            <span className="text-foreground">Your </span>
            <span className="text-primary">Collection</span>
          </h2>
          <p className="font-roboto text-[9px] tracking-[0.14em] text-secondary/70 uppercase">
            {vehicles.length} vehicles in storage
          </p>
        </div>
        <Link
          href="/member/vehicles"
          className="font-roboto text-[9px] tracking-[0.16em] text-primary uppercase transition-colors hover:text-accent"
        >
          View All →
        </Link>
      </div>

      {/* Vehicle list */}
      <div className="space-y-2.5">
        {vehicles.map((v) => (
          <MemberVehicleRow key={v.id} vehicle={v} />
        ))}
      </div>
    </div>
  );
}
