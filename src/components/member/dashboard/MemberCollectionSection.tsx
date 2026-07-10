import Link from "next/link";
import type { MemberVehicleItem } from "./types";
import { MemberVehicleRow } from "./MemberVehicleRow";
import { MemberSectionEmpty } from "./MemberSectionEmpty";
import { dashboardSectionHeadingClass, dashboardSectionHeadingPrefixClass, dashboardSectionHeadingAccentClass, dashboardSectionSubtitleClass } from "./dashboardStyles";

type MemberCollectionSectionProps = {
  vehicles: MemberVehicleItem[];
};

export function MemberCollectionSection({ vehicles }: MemberCollectionSectionProps) {
  // Count vehicles by status
  const readyCount = vehicles.filter((v) => v.status === "ready").length;
  const inServiceCount = vehicles.filter((v) => v.status === "in_service").length;
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h2 className={dashboardSectionHeadingClass}>
            <span className={dashboardSectionHeadingPrefixClass}>Your </span>
            <span className={dashboardSectionHeadingAccentClass}>Collection</span>
          </h2>
          <p className={dashboardSectionSubtitleClass}>
            {vehicles.length} Motor Cars · {readyCount} Ready
            {inServiceCount > 0 && `, ${inServiceCount} In Service`}
          </p>
        </div>
        <Link
          href="/member/garage"
          className="flex items-center gap-1.5 rounded-lg border border-accent/20 bg-transparent px-4 py-2 transition-all hover:border-accent/35 hover:bg-accent/5"
        >
          <span className="font-roboto text-[10px] font-semibold tracking-[0.14em] text-accent uppercase">
            View All
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M4.5 2.5L8 6L4.5 9.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-accent"
            />
          </svg>
        </Link>
      </div>

      {/* Vehicle list */}
      <div className="space-y-3">
        {vehicles.length === 0 ? (
          <MemberSectionEmpty
            title="No Vehicles Yet"
            description="Vehicles added to your garage will appear here."
          />
        ) : (
          vehicles.map((v) => <MemberVehicleRow key={v.id} vehicle={v} />)
        )}
      </div>
    </div>
  );
}
