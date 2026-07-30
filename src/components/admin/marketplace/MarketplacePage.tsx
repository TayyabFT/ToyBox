"use client";

import { useCallback, useEffect, useState } from "react";
import { adminMarketplaceApi } from "@/api/adminMarketplace.api";
import {
  buildMarketplaceOfferActionBody,
  mapMarketplaceOffer,
  mapMarketplaceOffers,
  mapMarketplaceVehicle,
  mapMarketplaceVehicles,
  normalizeMarketplaceOfferDetail,
} from "@/lib/adminMarketplace";
import { showError, showSuccess } from "@/lib/toast";
import type { MarketplaceOfferAction } from "@/types/api";
import { MarketplaceDeleteVehicleModal } from "./MarketplaceDeleteVehicleModal";
import { MarketplaceOfferDetailModal } from "./MarketplaceOfferDetailModal";
import { MarketplaceOffersPanel } from "./MarketplaceOffersPanel";
import { MarketplacePageHeader } from "./MarketplacePageHeader";
import { MarketplaceTabs } from "./MarketplaceTabs";
import { MarketplaceVehicleFormModal } from "./MarketplaceVehicleFormModal";
import { MarketplaceVehiclesPanel } from "./MarketplaceVehiclesPanel";
import type {
  MarketplaceOfferItem,
  MarketplaceTab,
  MarketplaceVehicleItem,
} from "./types";

type OfferFormAction = Extract<
  MarketplaceOfferAction,
  "reject" | "counter" | "reject_payment"
>;

export function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<MarketplaceTab>("vehicles");
  const [vehicles, setVehicles] = useState<MarketplaceVehicleItem[]>([]);
  const [offers, setOffers] = useState<MarketplaceOfferItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [vehicleFormOpen, setVehicleFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] =
    useState<MarketplaceVehicleItem | null>(null);
  const [vehicleSubmitting, setVehicleSubmitting] = useState(false);
  const [deletingVehicle, setDeletingVehicle] =
    useState<MarketplaceVehicleItem | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [selectedOffer, setSelectedOffer] =
    useState<MarketplaceOfferItem | null>(null);
  const [offerDetailOpen, setOfferDetailOpen] = useState(false);
  const [offerDetailLoading, setOfferDetailLoading] = useState(false);
  const [offerSubmitting, setOfferSubmitting] = useState(false);
  const [offerInitialAction, setOfferInitialAction] =
    useState<OfferFormAction | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const [vehiclesResponse, offersResponse] = await Promise.all([
        adminMarketplaceApi.getVehicles(),
        adminMarketplaceApi.getOffers(),
      ]);

      setVehicles(mapMarketplaceVehicles(vehiclesResponse.data));
      setOffers(mapMarketplaceOffers(offersResponse.data));
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load marketplace data";

      showError(message);
      setVehicles([]);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  function openCreateVehicle() {
    setEditingVehicle(null);
    setVehicleFormOpen(true);
  }

  async function openEditVehicle(vehicle: MarketplaceVehicleItem) {
    setEditingVehicle(vehicle);
    setVehicleFormOpen(true);

    try {
      const response = await adminMarketplaceApi.getVehicle(vehicle.id);
      const mapped = mapMarketplaceVehicle(response.data);

      if (mapped) {
        setEditingVehicle(mapped);
      }
    } catch {
      // Keep list item data if detail fetch fails.
    }
  }

  async function handleVehicleSubmit(form: Parameters<
    typeof adminMarketplaceApi.createVehicle
  >[0]) {
    setVehicleSubmitting(true);

    try {
      if (editingVehicle) {
        await adminMarketplaceApi.updateVehicle(editingVehicle.id, form);
        showSuccess("Vehicle updated");
      } else {
        await adminMarketplaceApi.createVehicle(form);
        showSuccess("Vehicle created");
      }

      setVehicleFormOpen(false);
      setEditingVehicle(null);
      await loadData();
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        (editingVehicle
          ? "Failed to update vehicle"
          : "Failed to create vehicle");

      showError(message);
    } finally {
      setVehicleSubmitting(false);
    }
  }

  function openDeleteVehicle(vehicle: MarketplaceVehicleItem) {
    setDeletingVehicle(vehicle);
  }

  async function handleDeleteVehicle() {
    if (!deletingVehicle) return;

    setDeleteSubmitting(true);

    try {
      await adminMarketplaceApi.deleteVehicle(deletingVehicle.id);
      showSuccess("Vehicle deleted");
      setDeletingVehicle(null);
      await loadData();
    } catch (error) {
      const message =
        (error as { message?: string }).message ?? "Failed to delete vehicle";

      showError(message);
    } finally {
      setDeleteSubmitting(false);
    }
  }

  async function openOfferDetail(
    offer: MarketplaceOfferItem,
    initialAction: OfferFormAction | null = null,
  ) {
    setSelectedOffer(offer);
    setOfferInitialAction(initialAction);
    setOfferDetailOpen(true);
    setOfferDetailLoading(true);

    try {
      const response = await adminMarketplaceApi.getOffer(offer.id);
      const raw = normalizeMarketplaceOfferDetail(response.data);
      const mapped = raw ? mapMarketplaceOffer(raw) : null;

      if (mapped) {
        setSelectedOffer(mapped);
      }
    } catch (error) {
      const message =
        (error as { message?: string }).message ?? "Failed to load offer detail";

      showError(message);
    } finally {
      setOfferDetailLoading(false);
    }
  }

  async function handleOfferAction(
    offer: MarketplaceOfferItem,
    payload: {
      action: MarketplaceOfferAction;
      counterOfferPrice?: number;
      remarks?: string;
    },
  ) {
    setOfferSubmitting(true);
    setActionLoadingId(offer.id);

    try {
      const body = buildMarketplaceOfferActionBody(payload);
      await adminMarketplaceApi.actOnOffer(offer.id, body);
      showSuccess("Offer updated");
      setOfferDetailOpen(false);
      setSelectedOffer(null);
      setOfferInitialAction(null);
      await loadData();
    } catch (error) {
      const message =
        (error as { message?: string }).message ?? "Failed to update offer";

      showError(message);
    } finally {
      setOfferSubmitting(false);
      setActionLoadingId(null);
    }
  }

  async function handleQuickApprove(offer: MarketplaceOfferItem) {
    await handleOfferAction(offer, { action: "approve" });
  }

  async function handleQuickApprovePayment(offer: MarketplaceOfferItem) {
    await handleOfferAction(offer, { action: "approve_payment" });
  }

  return (
    <div className="space-y-5 p-4 sm:p-6 lg:p-8 sm:space-y-7">
      <MarketplacePageHeader onAddVehicleClick={openCreateVehicle} />

      <MarketplaceTabs
        activeTab={activeTab}
        vehicleCount={vehicles.length}
        offerCount={offers.length}
        onChange={setActiveTab}
      />

      {activeTab === "vehicles" ? (
        <MarketplaceVehiclesPanel
          vehicles={vehicles}
          loading={loading}
          onEdit={openEditVehicle}
          onDelete={openDeleteVehicle}
        />
      ) : (
        <MarketplaceOffersPanel
          offers={offers}
          loading={loading}
          actionLoadingId={actionLoadingId}
          onOpenOffer={(offer) => void openOfferDetail(offer)}
          onApprove={(offer) => void handleQuickApprove(offer)}
          onReject={(offer) => void openOfferDetail(offer, "reject")}
          onCounter={(offer) => void openOfferDetail(offer, "counter")}
          onApprovePayment={(offer) => void handleQuickApprovePayment(offer)}
          onRejectPayment={(offer) =>
            void openOfferDetail(offer, "reject_payment")
          }
        />
      )}

      <MarketplaceVehicleFormModal
        open={vehicleFormOpen}
        vehicle={editingVehicle}
        submitting={vehicleSubmitting}
        onClose={() => {
          if (vehicleSubmitting) return;
          setVehicleFormOpen(false);
          setEditingVehicle(null);
        }}
        onSubmit={(form) => void handleVehicleSubmit(form)}
      />

      <MarketplaceDeleteVehicleModal
        open={Boolean(deletingVehicle)}
        vehicle={deletingVehicle}
        submitting={deleteSubmitting}
        onClose={() => {
          if (deleteSubmitting) return;
          setDeletingVehicle(null);
        }}
        onConfirm={() => void handleDeleteVehicle()}
      />

      <MarketplaceOfferDetailModal
        open={offerDetailOpen}
        offer={selectedOffer}
        loading={offerDetailLoading}
        submitting={offerSubmitting}
        initialAction={offerInitialAction}
        onClose={() => {
          if (offerSubmitting) return;
          setOfferDetailOpen(false);
          setSelectedOffer(null);
          setOfferInitialAction(null);
        }}
        onAction={(payload) => {
          if (!selectedOffer) return;
          void handleOfferAction(selectedOffer, payload);
        }}
      />
    </div>
  );
}
