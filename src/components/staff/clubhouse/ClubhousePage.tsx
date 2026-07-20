"use client";

import { useCallback, useEffect, useState } from "react";
import { staffClubhouseApi } from "@/api/staffClubhouse.api";
import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import {
  createEmptyClubhouseSummary,
  mapClubhouseReservation,
  mapClubhouseReservationsList,
  mapClubhouseSummary,
} from "@/lib/staffClubhouse";
import { showError, showSuccess } from "@/lib/toast";
import type { StaffClubhouseReservationUpdateRequest } from "@/types/api";
import { ClubhouseFilterTabs } from "./ClubhouseFilterTabs";
import { ClubhouseGreeting } from "./ClubhouseGreeting";
import { ClubhouseReservationStatusBadge } from "./ClubhouseReservationStatus";
import { CancelReservationModal } from "./CancelReservationModal";
import { EditReservationModal } from "./EditReservationModal";
import { MessageMemberModal } from "./MessageMemberModal";
import { ReservationDetailsModal } from "./ReservationDetailsModal";
import type {
  ClubhouseReservation,
  ClubhouseSummaryDisplay,
  ClubhouseZoneFilter,
} from "./types";

const columns = ["Time", "Member", "Zone", "Pax", "Status"] as const;

function ReservationRowSkeleton() {
  return (
    <tr className="border-b border-accent/8 last:border-b-0">
      <td className="px-5 py-4">
        <ShimmerBlock className="h-3 w-10" />
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <ShimmerBlock className="size-9 shrink-0 rounded-full" />
          <div className="min-w-0 space-y-1.5">
            <ShimmerBlock className="h-3 w-24" />
            <ShimmerBlock className="h-2.5 w-16" />
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <ShimmerBlock className="h-3 w-14" />
      </td>
      <td className="px-5 py-4 text-center">
        <ShimmerBlock className="mx-auto h-3 w-6" />
      </td>
      <td className="px-5 py-4 text-end">
        <ShimmerBlock className="ml-auto h-5 w-16 rounded-full" />
      </td>
    </tr>
  );
}

export function ClubhousePage() {
  const [summary, setSummary] = useState<ClubhouseSummaryDisplay>(
    createEmptyClubhouseSummary(),
  );
  const [reservations, setReservations] = useState<ClubhouseReservation[]>([]);
  const [activeFilter, setActiveFilter] = useState<ClubhouseZoneFilter>("all");
  const [listLoading, setListLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const [detail, setDetail] = useState<ClubhouseReservation | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);

  const loadSummary = useCallback(async () => {
    try {
      const response = await staffClubhouseApi.getSummary();
      setSummary(mapClubhouseSummary(response.data));
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load Club House summary";

      showError(message);
      setSummary(createEmptyClubhouseSummary());
    }
  }, []);

  const loadReservations = useCallback(async (zone: ClubhouseZoneFilter) => {
    setListLoading(true);

    try {
      const response = await staffClubhouseApi.getReservations({
        zone: zone === "all" ? undefined : zone,
      });

      setReservations(mapClubhouseReservationsList(response.data));
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load reservations";

      showError(message);
      setReservations([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  const loadDetail = useCallback(async (id: string) => {
    if (!id) {
      setDetail(null);
      return;
    }

    setDetailLoading(true);

    try {
      const response = await staffClubhouseApi.getReservation(id);
      const index = reservations.findIndex((item) => item.id === id);
      setDetail(mapClubhouseReservation(response.data, index >= 0 ? index : 0));
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load reservation details";

      showError(message);
      setDetail(null);
      setSelectedId("");
    } finally {
      setDetailLoading(false);
    }
  }, [reservations]);

  const refreshAll = useCallback(async () => {
    await Promise.all([loadSummary(), loadReservations(activeFilter)]);

    if (selectedId) {
      await loadDetail(selectedId);
    }
  }, [activeFilter, loadDetail, loadReservations, loadSummary, selectedId]);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    void loadReservations(activeFilter);
  }, [activeFilter, loadReservations]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }

    void loadDetail(selectedId);
  }, [loadDetail, selectedId]);

  async function runAction(action: () => Promise<void>) {
    setActionLoading(true);

    try {
      await action();
      await refreshAll();
    } finally {
      setActionLoading(false);
    }
  }

  async function handleApprove() {
    if (!detail) {
      return;
    }

    await runAction(async () => {
      await staffClubhouseApi.approveReservation(detail.id);
      showSuccess("Reservation approved");
    });
  }

  async function handleEditSubmit(body: StaffClubhouseReservationUpdateRequest) {
    if (!detail) {
      return;
    }

    await runAction(async () => {
      await staffClubhouseApi.updateReservation(detail.id, body);
      showSuccess("Reservation updated");
      setEditOpen(false);
    });
  }

  async function handleCancelSubmit(reason: string) {
    if (!detail) {
      return;
    }

    await runAction(async () => {
      await staffClubhouseApi.cancelReservation(detail.id, {
        reason: reason || undefined,
      });
      showSuccess("Reservation cancelled");
      setCancelOpen(false);
      setSelectedId("");
      setDetail(null);
    });
  }

  async function handleMessageSubmit(initialMessage: string) {
    if (!detail) {
      return;
    }

    await runAction(async () => {
      await staffClubhouseApi.messageMember(detail.id, { initialMessage });
      showSuccess("Message sent to member");
      setMessageOpen(false);
    });
  }

  return (
    <div className="space-y-6 p-8">
      <ClubhouseGreeting summary={summary} />

      <section className="overflow-hidden rounded-2xl border border-accent/10 bg-card">
        <div className="flex flex-col gap-4 border-b border-accent/8 p-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1.5">
            <h2 className="font-copperplate text-[18px] leading-none tracking-[0.06em] uppercase">
              <span className="text-foreground">Today&apos;s </span>
              <span className="text-accent">Reservations</span>
            </h2>
            <p className="font-roboto text-[10px] tracking-[0.12em] text-secondary uppercase">
              {summary.confirmedCount} confirmed · {summary.walkInCount} walk-ins
              {summary.pendingCount > 0
                ? ` · ${summary.pendingCount} pending`
                : ""}
              {summary.prepCount > 0 ? ` · ${summary.prepCount} prep` : ""}
            </p>
          </div>

          <ClubhouseFilterTabs
            active={activeFilter}
            tabs={summary.zoneTabs}
            onChange={setActiveFilter}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-accent/8">
                {columns.map((column) => (
                  <th
                    key={column}
                    className={`font-roboto px-5 py-4 text-[10px] font-medium tracking-[0.16em] text-secondary uppercase ${
                      column === "Pax"
                        ? "text-center"
                        : column === "Status"
                          ? "text-end"
                          : "text-left"
                    }`}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {listLoading &&
                Array.from({ length: 4 }, (_, index) => (
                  <ReservationRowSkeleton key={index} />
                ))}

              {!listLoading && reservations.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-5 py-8 text-center"
                  >
                    <p className="font-roboto text-sm text-secondary">
                      No reservations for this filter
                    </p>
                  </td>
                </tr>
              )}

              {!listLoading &&
                reservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    onClick={() => setSelectedId(reservation.id)}
                    className="cursor-pointer border-b border-accent/8 transition-colors last:border-b-0 hover:bg-accent/4"
                  >
                    <td className="px-5 py-4">
                      <span className="font-roboto text-[12px] font-medium tracking-[0.04em] text-accent">
                        {reservation.time}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-roboto flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold uppercase ${reservation.avatarClass}`}
                        >
                          {reservation.memberInitial}
                        </span>
                        <div className="min-w-0">
                          <p className="font-roboto text-[12px] font-semibold tracking-[0.06em] text-foreground uppercase">
                            {reservation.memberName}
                          </p>
                          <p className="font-roboto text-[10px] tracking-[0.04em] text-secondary">
                            {reservation.memberNumber}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-roboto text-[12px] tracking-[0.03em] text-foreground">
                        {reservation.zone}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="font-roboto text-[12px] tracking-[0.03em] text-foreground">
                        {reservation.pax}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-end">
                      <ClubhouseReservationStatusBadge
                        status={reservation.status}
                        detail={reservation.statusDetail}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      <ReservationDetailsModal
        open={Boolean(selectedId)}
        reservation={detail}
        loading={detailLoading}
        actionLoading={actionLoading}
        onClose={() => {
          if (actionLoading) {
            return;
          }

          setSelectedId("");
          setDetail(null);
          setEditOpen(false);
          setCancelOpen(false);
          setMessageOpen(false);
        }}
        onEdit={() => setEditOpen(true)}
        onCancel={() => setCancelOpen(true)}
        onApprove={() => void handleApprove()}
        onMessageMember={() => setMessageOpen(true)}
      />

      <EditReservationModal
        open={editOpen}
        reservation={detail}
        submitting={actionLoading}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditSubmit}
      />

      <CancelReservationModal
        open={cancelOpen}
        memberName={detail?.memberName}
        submitting={actionLoading}
        onClose={() => setCancelOpen(false)}
        onSubmit={handleCancelSubmit}
      />

      <MessageMemberModal
        open={messageOpen}
        memberName={detail?.memberName}
        timeSlot={detail?.time}
        submitting={actionLoading}
        onClose={() => setMessageOpen(false)}
        onSubmit={handleMessageSubmit}
      />
    </div>
  );
}
