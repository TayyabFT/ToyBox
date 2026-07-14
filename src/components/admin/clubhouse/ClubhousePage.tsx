"use client";

import { useCallback, useEffect, useState } from "react";
import { adminClubhouseApi } from "@/api/adminClubhouse.api";
import {
  createEmptyAdminClubhouseReservations,
  createEmptyAdminClubhouseStats,
  createEmptyAdminClubhouseVenues,
  mapAdminClubhouseOverviewStats,
  mapAdminClubhouseOverviewVenues,
  mapAdminClubhouseReservations,
} from "@/lib/adminClubhouse";
import { showError } from "@/lib/toast";
import { ClubhouseAddAreaModal } from "./add-area/ClubhouseAddAreaModal";
import { ClubhousePageHeader } from "./ClubhousePageHeader";
import { ClubhouseReservationsSection } from "./ClubhouseReservationsSection";
import { ClubhouseStatsRow } from "./ClubhouseStatsRow";
import { ClubhouseVenuesRow } from "./ClubhouseVenuesRow";
import type {
  ClubhouseReservationsDisplay,
  ClubhouseStatsDisplay,
  ClubhouseVenuesDisplay,
} from "./types";

export function ClubhousePage() {
  const [isAddAreaOpen, setIsAddAreaOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reservationsLoading, setReservationsLoading] = useState(true);
  const [stats, setStats] = useState<ClubhouseStatsDisplay>(
    createEmptyAdminClubhouseStats(),
  );
  const [venues, setVenues] = useState<ClubhouseVenuesDisplay>(
    createEmptyAdminClubhouseVenues(),
  );
  const [reservations, setReservations] = useState<ClubhouseReservationsDisplay>(
    createEmptyAdminClubhouseReservations(),
  );

  const loadPage = useCallback(async () => {
    setLoading(true);
    setReservationsLoading(true);

    try {
      const [overviewResponse, reservationsResponse] = await Promise.all([
        adminClubhouseApi.getOverview(),
        adminClubhouseApi.getReservations(),
      ]);

      setStats(mapAdminClubhouseOverviewStats(overviewResponse.data));
      setVenues(mapAdminClubhouseOverviewVenues(overviewResponse.data));
      setReservations(mapAdminClubhouseReservations(reservationsResponse.data));
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load clubhouse data";

      showError(message);
      setStats(createEmptyAdminClubhouseStats());
      setVenues(createEmptyAdminClubhouseVenues());
      setReservations(createEmptyAdminClubhouseReservations());
    } finally {
      setLoading(false);
      setReservationsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPage();
  }, [loadPage]);

  return (
    <>
      <div className="space-y-7 p-8">
        <ClubhousePageHeader onAddNewClick={() => setIsAddAreaOpen(true)} />
        <ClubhouseStatsRow stats={stats} loading={loading} />
        <ClubhouseVenuesRow venues={venues} />
        <ClubhouseReservationsSection
          reservations={reservations}
          loading={reservationsLoading}
        />
      </div>

      <ClubhouseAddAreaModal
        open={isAddAreaOpen}
        onClose={() => setIsAddAreaOpen(false)}
      />
    </>
  );
}
