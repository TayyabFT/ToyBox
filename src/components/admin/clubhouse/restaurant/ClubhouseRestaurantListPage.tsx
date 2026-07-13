"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { adminClubhouseApi } from "@/api/adminClubhouse.api";
import { mapAdminClubhouseRestaurantList } from "@/lib/adminClubhouse";
import { showError } from "@/lib/toast";
import { ClubhouseRestaurantCard } from "./ClubhouseRestaurantCard";
import type { ClubhouseRestaurantListItem } from "./types";

export function ClubhouseRestaurantListPage() {
  const [restaurants, setRestaurants] = useState<ClubhouseRestaurantListItem[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  const loadRestaurants = useCallback(async () => {
    setLoading(true);

    try {
      const response = await adminClubhouseApi.getRestaurants();
      setRestaurants(mapAdminClubhouseRestaurantList(response.data));
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load restaurants";

      showError(message);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  return (
    <div className="space-y-7 p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-copperplate text-[22px] tracking-[0.04em] text-foreground">
            Restaurant Areas
          </h1>
          <p className="mt-1 font-roboto text-[11px] tracking-[0.1em] text-secondary uppercase">
            The Clubhouse Restaurant
          </p>
        </div>

        <Link
          href="/admin/clubhouse"
          className="font-roboto rounded-full border border-accent/25 px-4 py-2 text-[10px] font-semibold tracking-[0.12em] text-primary uppercase transition-colors hover:border-primary/40"
        >
          Back to Clubhouse
        </Link>
      </div>

      {loading && (
        <p className="font-roboto py-8 text-center text-sm text-secondary">
          Loading restaurants...
        </p>
      )}

      {!loading && restaurants.length === 0 && (
        <p className="font-roboto py-8 text-center text-sm text-secondary">
          No restaurant areas found.
        </p>
      )}

      {!loading && restaurants.length > 0 && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {restaurants.map((restaurant) => (
            <ClubhouseRestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
}
