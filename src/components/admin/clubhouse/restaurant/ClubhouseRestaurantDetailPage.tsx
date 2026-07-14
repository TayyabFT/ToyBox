"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminClubhouseApi } from "@/api/adminClubhouse.api";
import { mapAdminClubhouseRestaurantList } from "@/lib/adminClubhouse";
import { useSetAdminPageSubtitle } from "@/lib/adminPageMeta";
import { PageLoadingShimmer } from "@/components/common/PageLoadingShimmer";
import { showError } from "@/lib/toast";
import { ClubhouseVenueStatusBadge } from "../ClubhouseVenueStatusBadge";
import type { ClubhouseRestaurantListItem } from "./types";

type ClubhouseRestaurantDetailPageProps = {
  restaurantId: string;
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between gap-4 py-3.5">
      <span className="font-roboto text-[13px] tracking-[0.02em] text-secondary">
        {label}
      </span>
      <span className="font-roboto text-[13px] font-medium tracking-[0.02em] text-foreground">
        {value}
      </span>
    </li>
  );
}

function formatDateTime(value: string): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function DetailContent({
  restaurant,
}: {
  restaurant: ClubhouseRestaurantListItem;
}) {
  useSetAdminPageSubtitle(restaurant.restaurantName);

  return (
    <div className="space-y-5 p-8">
      <section
        className="relative overflow-hidden rounded-2xl border border-accent/15 px-9 py-9"
        style={{
          background:
            "radial-gradient(90% 130% at 42% -15%, rgba(212,168,71,0.20) 0%, rgba(140,105,45,0.10) 38%, rgba(10,8,6,0) 68%), #0a0806",
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2.5">
            <p className="font-roboto text-[12px] font-medium tracking-[0.22em] text-secondary uppercase">
              {restaurant.cuisineType}
            </p>
            <h1 className="font-copperplate text-[30px] leading-none tracking-[0.05em] text-[#F2EAD5]">
              {restaurant.restaurantName}
            </h1>
            <p className="font-roboto text-[11px] tracking-[0.12em] text-secondary uppercase">
              {restaurant.openingTime} – {restaurant.closingTime}
            </p>
          </div>

          <ClubhouseVenueStatusBadge
            label={restaurant.statusLabel}
            tone={restaurant.statusTone}
          />
        </div>
      </section>

      {restaurant.images.length > 0 && (
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {restaurant.images.map((image) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={image}
              src={image}
              alt={restaurant.restaurantName}
              className="h-32 w-full rounded-xl border border-accent/12 object-cover"
            />
          ))}
        </section>
      )}

      <section className="rounded-2xl border border-accent/12 bg-card p-5">
        <div className="flex min-h-[26px] items-center justify-between pb-3">
          <h2 className="font-roboto text-[11px] font-medium tracking-[0.18em] text-secondary uppercase">
            Details
          </h2>
        </div>
        <ul className="divide-y divide-accent/8 border-t border-accent/8">
          <InfoRow label="Number of tables" value={String(restaurant.numberOfTables)} />
          <InfoRow label="Capacity" value={String(restaurant.capacity)} />
          <InfoRow
            label="Booked"
            value={`${restaurant.booked} / ${restaurant.totalCapacity}`}
          />
          {restaurant.capacityLabel && (
            <InfoRow label="Summary" value={restaurant.capacityLabel} />
          )}
          <InfoRow label="Created" value={formatDateTime(restaurant.createdAt)} />
          <InfoRow label="Updated" value={formatDateTime(restaurant.updatedAt)} />
        </ul>
      </section>
    </div>
  );
}

export function ClubhouseRestaurantDetailPage({
  restaurantId,
}: ClubhouseRestaurantDetailPageProps) {
  const [restaurant, setRestaurant] = useState<ClubhouseRestaurantListItem | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
        const response = await adminClubhouseApi.getRestaurants();
        const restaurants = mapAdminClubhouseRestaurantList(response.data);
        const match = restaurants.find((item) => item.id === restaurantId) ?? null;

        if (!cancelled) {
          setRestaurant(match);
        }
      } catch (error) {
        const message =
          (error as { message?: string }).message ??
          "Failed to load restaurant";

        if (!cancelled) {
          showError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [restaurantId]);

  if (loading) {
    return <PageLoadingShimmer />;
  }

  if (!restaurant) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
        <p className="font-roboto text-[12px] tracking-[0.1em] text-secondary uppercase">
          Restaurant not found.
        </p>
        <Link
          href="/admin/clubhouse/restaurant"
          className="font-roboto rounded-full border border-accent/25 px-4 py-2 text-[10px] font-semibold tracking-[0.12em] text-primary uppercase transition-colors hover:border-primary/40"
        >
          Back to Restaurants
        </Link>
      </div>
    );
  }

  return <DetailContent restaurant={restaurant} />;
}
