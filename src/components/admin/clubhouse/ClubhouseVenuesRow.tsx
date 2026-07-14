import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import { ClubhouseVenueCardItem } from "./ClubhouseVenueCard";
import type { ClubhouseVenuesDisplay } from "./types";

type ClubhouseVenuesRowProps = {
  venues: ClubhouseVenuesDisplay;
  loading?: boolean;
};

function VenueCardSkeleton() {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-accent/12 bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <ShimmerBlock className="h-4 w-32" />
        <ShimmerBlock className="h-5 w-20 rounded-full" />
      </div>

      <ShimmerBlock className="mt-3 h-2.5 w-40" />

      <div className="mt-5 space-y-2">
        <ShimmerBlock className="h-[3px] w-full rounded-full" />
        <div className="flex items-center justify-between gap-3">
          <ShimmerBlock className="h-2.5 w-20" />
          <ShimmerBlock className="h-2.5 w-20" />
        </div>
      </div>

      <ul className="mt-5 space-y-3 border-t border-accent/8 pt-4">
        {Array.from({ length: 3 }, (_, index) => (
          <li key={index} className="flex items-center justify-between gap-4">
            <ShimmerBlock className="h-2.5 w-24" />
            <ShimmerBlock className="h-2.5 w-12" />
          </li>
        ))}
      </ul>
    </article>
  );
}

export function ClubhouseVenuesRow({
  venues,
  loading = false,
}: ClubhouseVenuesRowProps) {
  if (loading) {
    return (
      <div
        className="grid grid-cols-1 gap-4 xl:grid-cols-3"
        aria-busy="true"
        aria-live="polite"
      >
        {Array.from({ length: 3 }, (_, index) => (
          <VenueCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      {venues.map((venue) => (
        <ClubhouseVenueCardItem key={venue.id} venue={venue} />
      ))}
    </div>
  );
}
