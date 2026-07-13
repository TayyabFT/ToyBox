import Link from "next/link";
import { ClubhouseVenueStatusBadge } from "../ClubhouseVenueStatusBadge";
import type { ClubhouseRestaurantListItem } from "./types";

type ClubhouseRestaurantCardProps = {
  restaurant: ClubhouseRestaurantListItem;
};

export function ClubhouseRestaurantCard({
  restaurant,
}: ClubhouseRestaurantCardProps) {
  return (
    <Link
      href={`/admin/clubhouse/restaurant/${restaurant.id}`}
      className="flex h-full flex-col rounded-2xl border border-accent/12 bg-card p-5 transition-colors hover:border-primary/40 hover:bg-accent/5"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-copperplate text-[15px] leading-tight tracking-[0.06em] text-foreground uppercase">
          {restaurant.restaurantName}
        </h2>
        <ClubhouseVenueStatusBadge
          label={restaurant.statusLabel}
          tone={restaurant.statusTone}
        />
      </div>

      <p className="mt-2 font-roboto text-[10px] tracking-[0.12em] text-secondary uppercase">
        {restaurant.cuisineType} · {restaurant.openingTime} –{" "}
        {restaurant.closingTime}
      </p>

      <ul className="mt-5 space-y-3 border-t border-accent/8 pt-4">
        <li className="flex items-start justify-between gap-4">
          <span className="font-roboto text-[11px] tracking-[0.02em] text-secondary">
            Tables
          </span>
          <span className="font-roboto text-right text-[11px] tracking-[0.02em] text-muted">
            {restaurant.numberOfTables}
          </span>
        </li>
        <li className="flex items-start justify-between gap-4">
          <span className="font-roboto text-[11px] tracking-[0.02em] text-secondary">
            Capacity
          </span>
          <span className="font-roboto text-right text-[11px] tracking-[0.02em] text-muted">
            {restaurant.booked} / {restaurant.totalCapacity}
          </span>
        </li>
      </ul>
    </Link>
  );
}
