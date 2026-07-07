import { ClubhouseVenueCardItem } from "./ClubhouseVenueCard";
import type { ClubhouseVenuesDisplay } from "./types";

type ClubhouseVenuesRowProps = {
  venues: ClubhouseVenuesDisplay;
};

export function ClubhouseVenuesRow({ venues }: ClubhouseVenuesRowProps) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      {venues.map((venue) => (
        <ClubhouseVenueCardItem key={venue.id} venue={venue} />
      ))}
    </div>
  );
}
