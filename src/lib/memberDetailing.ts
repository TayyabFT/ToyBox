import type { WashDetailsFormState, WashPackageKey, WashAddOnKey } from "@/components/member/garage/detailing-wash/types";
import type {
  CreateDetailingBookingBody,
  DetailingBookingConfirmationData,
} from "@/types/api";

/** Maps UI package keys → backend packageKey values */
const PACKAGE_KEY_MAP: Record<WashPackageKey, string> = {
  "full-detail": "full_detail",
  "exterior-wash": "exterior_wash",
  "interior-only": "interior_only",
};

/** Maps UI add-on keys → backend addonKeys values */
const ADDON_KEY_MAP: Record<WashAddOnKey, string> = {
  "ceramic-coat": "ceramic_coat",
  "engine-bay-clean": "engine_bay",
  "leather-treatment": "leather_protection",
};

export function buildDetailingBookingBody(
  memberId: string,
  vehicleId: string,
  form: WashDetailsFormState,
): CreateDetailingBookingBody {
  const addonKeys = form.addOns
    .map((key) => ADDON_KEY_MAP[key])
    .filter(Boolean);

  const body: CreateDetailingBookingBody = {
    memberId,
    vehicleId,
    packageKey: PACKAGE_KEY_MAP[form.package],
    preferredDate: form.date, // already ISO YYYY-MM-DD from shared date picker
    timeWindowStart: "09:00",
    timeWindowEnd: "17:00",
    locationKey: "workshop_main",
  };

  if (addonKeys.length > 0) {
    body.addonKeys = addonKeys;
  }

  const notes = form.notes.trim();
  if (notes) {
    body.specialInstructions = notes;
  }

  return body;
}

export function resolveDetailingReferenceNumber(
  data: DetailingBookingConfirmationData,
): string {
  if (data.referenceNumber?.trim()) {
    return data.referenceNumber.trim();
  }

  if (data.id?.trim()) {
    return data.id.trim();
  }

  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const seq = String(Math.floor(Math.random() * 900) + 100);

  return `DTL-${yy}${mm}-${seq}`;
}
