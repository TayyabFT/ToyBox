"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ConfirmationPendingClock,
  ConfirmationShiftProgress,
  ConfirmationSignOffEdit,
  VehicleFleetReady,
} from "@/components/common/Svgs";
import { sourcingApi } from "@/api/sourcing.api";
import {
  createEmptyConfirmationStats,
  getInReviewPendingCount,
  mapConfirmationCompletedBookings,
  mapConfirmationConfirmedBookings,
  mapConfirmationInReviewBookings,
  mapConfirmationPendingBookings,
  mapConfirmationSummary,
} from "@/lib/confirmations";
import { showError } from "@/lib/toast";
import { StatCard } from "@/components/staff/overview/StatCard";
import { CompletedTodayPanel } from "./CompletedTodayPanel";
import { ConfirmedBookingsPanel } from "./ConfirmedBookingsPanel";
import { ConfirmationsGreeting } from "./ConfirmationsGreeting";
import { InReviewBookingsPanel } from "./InReviewBookingsPanel";
import { PendingConfirmationsPanel } from "./PendingConfirmationsPanel";
import { OfferVehicleModal } from "./OfferVehicleModal";
import type { ConfirmationRequestItem, ConfirmationStatsDisplay } from "./types";

export function ConfirmationsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ConfirmationStatsDisplay>(
    createEmptyConfirmationStats(),
  );
  const [pending, setPending] = useState<ConfirmationRequestItem[]>([]);
  const [inReview, setInReview] = useState<ConfirmationRequestItem[]>([]);
  const [confirmed, setConfirmed] = useState<ConfirmationRequestItem[]>([]);
  const [completed, setCompleted] = useState<ConfirmationRequestItem[]>([]);
  const [inReviewCount, setInReviewCount] = useState(0);
  const [offerRequest, setOfferRequest] = useState<ConfirmationRequestItem | null>(
    null,
  );

  const loadConfirmations = useCallback(async () => {
    setLoading(true);

    try {
      const response = await sourcingApi.getStaffRequests();
      const { data } = response;

      setPending(mapConfirmationPendingBookings(data.pendingBookings));
      setInReview(mapConfirmationInReviewBookings(data.inReviewBookings));
      setConfirmed(mapConfirmationConfirmedBookings(data.confirmedBookings));
      setCompleted(mapConfirmationCompletedBookings(data.completedTodayBookings));
      setStats(mapConfirmationSummary(data));
      setInReviewCount(getInReviewPendingCount(data));
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load bookings";

      showError(message);
      setPending([]);
      setInReview([]);
      setConfirmed([]);
      setCompleted([]);
      setStats(createEmptyConfirmationStats());
      setInReviewCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfirmations();
  }, [loadConfirmations]);

  return (
    <div className="space-y-8 p-8">
      <ConfirmationsGreeting />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-4">
        <StatCard
          label={stats.pendingConfirm.label}
          value={stats.pendingConfirm.value}
          subtext={stats.pendingConfirm.subtext}
          icon={<ConfirmationPendingClock />}
          iconSize="lg"
          valueLoading={loading}
        />
        <StatCard
          label={stats.signOffQueue.label}
          value={stats.signOffQueue.value}
          subtext={stats.signOffQueue.subtext}
          icon={<ConfirmationSignOffEdit />}
          iconSize="lg"
          valueLoading={loading}
        />
        <StatCard
          label={stats.completedToday.label}
          value={stats.completedToday.value}
          subtext={stats.completedToday.subtext}
          icon={<VehicleFleetReady />}
          iconSize="lg"
          valueLoading={loading}
        />
        <StatCard
          label={stats.shiftProgress.label}
          value={stats.shiftProgress.value}
          subtext={stats.shiftProgress.subtext}
          icon={<ConfirmationShiftProgress color="currentColor" />}
          iconSize="lg"
          valueLoading={loading}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="space-y-6 xl:col-span-3">
          <PendingConfirmationsPanel
            requests={pending}
            pendingCount={Number.parseInt(stats.pendingConfirm.value, 10) || pending.length}
            loading={loading}
            onOfferVehicle={setOfferRequest}
          />
          <ConfirmedBookingsPanel
            requests={confirmed}
            confirmedCount={confirmed.length}
            loading={loading}
          />
        </div>

        <div className="space-y-6 xl:col-span-2">
          <InReviewBookingsPanel
            requests={inReview}
            pendingCount={inReviewCount || inReview.length}
            loading={loading}
          />
          <CompletedTodayPanel
            requests={completed}
            completedCount={
              Number.parseInt(stats.completedToday.value, 10) || completed.length
            }
            loading={loading}
          />
        </div>
      </div>

      <OfferVehicleModal
        open={offerRequest !== null}
        request={offerRequest}
        onClose={() => setOfferRequest(null)}
        onSuccess={loadConfirmations}
      />
    </div>
  );
}
