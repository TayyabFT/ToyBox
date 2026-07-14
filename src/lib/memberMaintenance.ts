import type {
  MaintenanceServiceTypeKey,
  MaintenanceServiceCentreKey,
  MaintenanceDateKey,
  MaintenanceTimeWindowKey,
  MaintenanceDetailsFormState,
} from "@/components/member/garage/maintenance-service/types";
import type {
  CreateMaintenanceRequestBody,
  MaintenanceRequestConfirmationData,
} from "@/types/api";

// ── Service key mappings ──────────────────────────────────────────────────────

/**
 * Maps each UI service type to the backend serviceKeys it represents.
 * The backend accepts: oil_change | brake_pads | tire_rotation |
 * annual_service | battery_check | ac_service
 */
const SERVICE_TYPE_TO_KEYS: Record<MaintenanceServiceTypeKey, string[]> = {
  "scheduled-annual": ["annual_service"],
  "repair-fault": ["oil_change", "battery_check"],
  "tyres-brakes": ["brake_pads", "tire_rotation"],
  "bodywork-paint": ["ac_service"],
};

// ── Location key mappings ─────────────────────────────────────────────────────

/**
 * Maps UI service-centre keys → backend locationKey values.
 * Backend valid keys: toybox_main | toybox_bay_c | partner_porsche
 */
const CENTRE_TO_LOCATION_KEY: Record<MaintenanceServiceCentreKey, string> = {
  "official-porsche": "partner_porsche",
  "toybox-partner": "toybox_main",
};

// ── Date / time helpers ───────────────────────────────────────────────────────

/** Maps time window key → ISO hour for scheduledAt */
const TIME_TO_HOUR: Record<MaintenanceTimeWindowKey, number> = {
  morning: 9,
  afternoon: 13,
  evening: 17,
  flexible: 10,
};

function buildScheduledAt(
  dateKey: MaintenanceDateKey,
  timeKey: MaintenanceTimeWindowKey,
): string {
  // dateKey is now a YYYY-MM-DD ISO string
  const hour = TIME_TO_HOUR[timeKey] ?? 10;
  const parsed = new Date(`${dateKey}T${String(hour).padStart(2, "0")}:00:00`);

  // If somehow still in the past, bump one day forward
  if (parsed < new Date()) {
    parsed.setDate(parsed.getDate() + 1);
  }

  return parsed.toISOString();
}

// ── Public builder ────────────────────────────────────────────────────────────

export function buildMaintenanceRequestBody(
  memberId: string,
  vehicleId: string,
  form: MaintenanceDetailsFormState,
): CreateMaintenanceRequestBody {
  const serviceKeys = SERVICE_TYPE_TO_KEYS[form.serviceType] ?? ["annual_service"];
  const locationKey = CENTRE_TO_LOCATION_KEY[form.serviceCentre] ?? "toybox_main";
  const scheduledAt = buildScheduledAt(form.preferredDate, form.preferredTime);
  const notes = form.issueDescription.trim();

  const body: CreateMaintenanceRequestBody = {
    memberId,
    vehicleId,
    serviceKeys,
    scheduledAt,
    locationKey,
  };

  if (notes) {
    body.notes = notes;
  }

  return body;
}

export function resolveMaintenanceReferenceNumber(
  data: MaintenanceRequestConfirmationData,
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

  return `MNT-${yy}${mm}-${seq}`;
}
