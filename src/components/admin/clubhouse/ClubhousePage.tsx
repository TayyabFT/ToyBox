"use client";

import { ClubhousePageHeader } from "./ClubhousePageHeader";
import { ClubhouseReservationsSection } from "./ClubhouseReservationsSection";
import { ClubhouseStatsRow } from "./ClubhouseStatsRow";
import { ClubhouseVenuesRow } from "./ClubhouseVenuesRow";
import {
  clubhouseReservations,
  clubhouseStats,
  clubhouseVenues,
} from "./mockData";

export function ClubhousePage() {
  return (
    <div className="space-y-7 p-8">
      <ClubhousePageHeader />
      <ClubhouseStatsRow stats={clubhouseStats} />
      <ClubhouseVenuesRow venues={clubhouseVenues} />
      <ClubhouseReservationsSection reservations={clubhouseReservations} />
    </div>
  );
}
