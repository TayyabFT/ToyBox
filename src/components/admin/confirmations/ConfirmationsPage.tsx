"use client";

import { useCallback, useEffect, useState } from "react";
import { sourcingApi } from "@/api/sourcing.api";
import {
  createEmptyAdminConfirmationStats,
  getAdminInReviewCount,
  mapAdminCompletedToday,
  mapAdminConfirmationStats,
  mapAdminConfirmedBookings,
  mapAdminInReviewBookings,
  mapAdminPendingBookings,
} from "@/lib/adminConfirmations";
import { showError } from "@/lib/toast";
import { CompletedTodayPanel } from "./CompletedTodayPanel";
import { ConfirmedBookingsPanel } from "./ConfirmedBookingsPanel";
import { ConfirmationsPageHeader } from "./ConfirmationsPageHeader";
import { ConfirmationsStatsRow } from "./ConfirmationsStatsRow";
import { InReviewBookingsPanel } from "./InReviewBookingsPanel";
import { PendingConfirmationsPanel } from "./PendingConfirmationsPanel";
import { confirmationStats as fallbackStats } from "./mockData";
import type {
  BookingItem,
  CompletedTodayItem,
  ConfirmationStatItem,
  InReviewBooking,
  PendingBookingItem,
} from "./types";

const ADMIN_SOURCING_QUERY = {
  status: "Request received",
  limit: 50,
  offset: 0,
};

export function ConfirmationsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ConfirmationStatItem[]>(fallbackStats);
  const [pendingBookings, setPendingBookings] = useState<PendingBookingItem[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState<BookingItem[]>([]);
  const [inReviewBookings, setInReviewBookings] = useState<InReviewBooking[]>([]);
  const [completedToday, setCompletedToday] = useState<CompletedTodayItem[]>([]);
  const [inReviewCount, setInReviewCount] = useState(0);

  const loadConfirmations = useCallback(async () => {
    setLoading(true);

    try {
      const response = await sourcingApi.getAdminRequests(ADMIN_SOURCING_QUERY);
      const { data } = response;

      setStats(mapAdminConfirmationStats(data));
      setPendingBookings(mapAdminPendingBookings(data.requests));
      setConfirmedBookings(mapAdminConfirmedBookings(data.requests));
      setInReviewBookings(mapAdminInReviewBookings(data.inReviewBookings));
      setCompletedToday(mapAdminCompletedToday(data.requests));
      setInReviewCount(getAdminInReviewCount(data));
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load booking confirmations";

      showError(message);
      setStats(createEmptyAdminConfirmationStats());
      setPendingBookings([]);
      setConfirmedBookings([]);
      setInReviewBookings([]);
      setCompletedToday([]);
      setInReviewCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfirmations();
  }, [loadConfirmations]);

  const pendingCount =
    Number.parseInt(stats[0]?.value ?? "0", 10) || pendingBookings.length;
  const completedCount =
    Number.parseInt(stats[2]?.value ?? "0", 10) || completedToday.length;

  return (
    <div className="space-y-7 p-8">
      <ConfirmationsPageHeader />
      <ConfirmationsStatsRow stats={stats} />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="space-y-6">
          <PendingConfirmationsPanel
            bookings={pendingBookings}
            pendingCount={pendingCount}
            loading={loading}
          />
          <ConfirmedBookingsPanel
            bookings={confirmedBookings}
            loading={loading}
          />
        </div>

        <div className="space-y-6">
          <InReviewBookingsPanel
            bookings={inReviewBookings}
            pendingCount={inReviewCount || inReviewBookings.length}
            loading={loading}
          />
          <CompletedTodayPanel
            items={completedToday}
            completedCount={completedCount}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
