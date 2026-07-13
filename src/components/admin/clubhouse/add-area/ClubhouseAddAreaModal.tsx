"use client";

import { useEffect, useState } from "react";
import { adminClubhouseApi } from "@/api/adminClubhouse.api";
import { isApiError } from "@/lib/apiError";
import { showToast } from "@/lib/toast";
import { ClubhouseAreaTypeSelect } from "./ClubhouseAreaTypeSelect";
import { ClubhousePrivateLoungeForm } from "./ClubhousePrivateLoungeForm";
import { ClubhouseRestaurantForm } from "./ClubhouseRestaurantForm";
import { ClubhouseSuiteLoungeForm } from "./ClubhouseSuiteLoungeForm";
import type {
  ClubhouseAddAreaStep,
  ClubhouseAreaType,
  ClubhousePrivateLoungeFormState,
  ClubhouseRestaurantFormState,
  ClubhouseSuiteLoungeFormState,
} from "./types";

const INITIAL_RESTAURANT_FORM: ClubhouseRestaurantFormState = {
  restaurantName: "the-clubhouse-restaurant",
  openingTime: "12:00 PM",
  closingTime: "3:30 PM",
  tableCount: "18",
  capacity: "40",
  cuisineType: "asian",
  ambienceImages: [null, null, null],
};

const INITIAL_PRIVATE_LOUNGE_FORM: ClubhousePrivateLoungeFormState = {
  loungeTitle: "members-lounge",
  type: "Long bite",
  isAvailable24x7: true,
  capacity: "6",
  maintainTiming: "1 hour",
  images: [null, null, null],
};

const INITIAL_SUITE_LOUNGE_FORM: ClubhouseSuiteLoungeFormState = {
  suites: [
    {
      id: "suite-1",
      suiteTitle: "pc-hotel",
      location: "Ground floor, east wing",
      roomType: "suite",
      capacity: "18",
    },
  ],
  images: [null, null, null],
  notes: "",
};

type ClubhouseAddAreaModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
};

function stepForAreaType(areaType: ClubhouseAreaType): ClubhouseAddAreaStep {
  if (areaType === "clubhouse_restaurant") return "clubhouse_restaurant";
  if (areaType === "private_lounge") return "private_lounge";
  return "suite_lounge";
}

function resolveErrorMessage(error: unknown, fallback: string): string {
  if (isApiError(error)) {
    return error.message;
  }

  return fallback;
}

export function ClubhouseAddAreaModal({
  open,
  onClose,
  onSaved,
}: ClubhouseAddAreaModalProps) {
  const [step, setStep] = useState<ClubhouseAddAreaStep>("select-type");
  const [selectedAreaType, setSelectedAreaType] = useState<ClubhouseAreaType | "">(
    "",
  );
  const [restaurantForm, setRestaurantForm] =
    useState<ClubhouseRestaurantFormState>(INITIAL_RESTAURANT_FORM);
  const [privateLoungeForm, setPrivateLoungeForm] =
    useState<ClubhousePrivateLoungeFormState>(INITIAL_PRIVATE_LOUNGE_FORM);
  const [suiteLoungeForm, setSuiteLoungeForm] =
    useState<ClubhouseSuiteLoungeFormState>(INITIAL_SUITE_LOUNGE_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      setStep("select-type");
      setSelectedAreaType("");
      setRestaurantForm(INITIAL_RESTAURANT_FORM);
      setPrivateLoungeForm(INITIAL_PRIVATE_LOUNGE_FORM);
      setSuiteLoungeForm(INITIAL_SUITE_LOUNGE_FORM);
      setSaving(false);
    }
  }, [open]);

  function handleClose() {
    onClose();
  }

  function handleAreaTypeChange(areaType: ClubhouseAreaType) {
    setSelectedAreaType(areaType);
    setStep(stepForAreaType(areaType));
  }

  async function handleRestaurantSave() {
    setSaving(true);

    try {
      const response = await adminClubhouseApi.createRestaurant(restaurantForm);

      showToast.success({
        title: "Area Saved",
        message: response.message || "Clubhouse restaurant area has been saved.",
      });
      onSaved?.();
      handleClose();
    } catch (error) {
      showToast.error({
        title: "Save Failed",
        message: resolveErrorMessage(
          error,
          "Unable to save clubhouse restaurant area.",
        ),
      });
    } finally {
      setSaving(false);
    }
  }

  async function handlePrivateLoungeSave() {
    setSaving(true);

    try {
      const response = await adminClubhouseApi.createPrivateLounge(privateLoungeForm);

      showToast.success({
        title: "Area Saved",
        message: response.message || "Private lounge area has been saved.",
      });
      onSaved?.();
      handleClose();
    } catch (error) {
      showToast.error({
        title: "Save Failed",
        message: resolveErrorMessage(error, "Unable to save private lounge area."),
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleSuiteLoungeSave() {
    setSaving(true);

    try {
      const response = await adminClubhouseApi.createSuiteLounge(suiteLoungeForm);

      showToast.success({
        title: "Area Saved",
        message: response.message || "Suite lounge area has been saved.",
      });
      onSaved?.();
      handleClose();
    } catch (error) {
      showToast.error({
        title: "Save Failed",
        message: resolveErrorMessage(error, "Unable to save suite lounge area."),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <ClubhouseAreaTypeSelect
        open={open && step === "select-type"}
        value={selectedAreaType}
        onClose={handleClose}
        onChange={handleAreaTypeChange}
      />

      <ClubhouseRestaurantForm
        open={open && step === "clubhouse_restaurant"}
        value={restaurantForm}
        saving={saving}
        onClose={handleClose}
        onChange={(patch) => setRestaurantForm((current) => ({ ...current, ...patch }))}
        onSave={handleRestaurantSave}
      />

      <ClubhousePrivateLoungeForm
        open={open && step === "private_lounge"}
        value={privateLoungeForm}
        saving={saving}
        onClose={handleClose}
        onChange={(patch) =>
          setPrivateLoungeForm((current) => ({ ...current, ...patch }))
        }
        onSave={handlePrivateLoungeSave}
      />

      <ClubhouseSuiteLoungeForm
        open={open && step === "suite_lounge"}
        value={suiteLoungeForm}
        saving={saving}
        onClose={handleClose}
        onChange={setSuiteLoungeForm}
        onSave={handleSuiteLoungeSave}
      />
    </>
  );
}
