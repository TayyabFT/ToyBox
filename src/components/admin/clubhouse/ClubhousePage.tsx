"use client";

import { useState } from "react";
import { ClubhouseAddAreaModal } from "./add-area/ClubhouseAddAreaModal";
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
  const [isAddAreaOpen, setIsAddAreaOpen] = useState(false);

  return (
    <>
      <div className="space-y-7 p-8">
        <ClubhousePageHeader onAddNewClick={() => setIsAddAreaOpen(true)} />
        <ClubhouseStatsRow stats={clubhouseStats} />
        <ClubhouseVenuesRow venues={clubhouseVenues} />
        <ClubhouseReservationsSection reservations={clubhouseReservations} />
      </div>

      <ClubhouseAddAreaModal
        open={isAddAreaOpen}
        onClose={() => setIsAddAreaOpen(false)}
      />
    </>
  );
}
