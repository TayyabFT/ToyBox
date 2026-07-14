import { stripEmptyRequestFields } from "@/lib/apiPayload";
import type { TransportDetailsFormState } from "@/components/member/garage/transport-delivery/types";
import type {
  CreateMemberTransportRequestBody,
  MemberTransportRequestData,
} from "@/types/api";

function resolveRequestType(
  form: TransportDetailsFormState,
): CreateMemberTransportRequestBody["requestType"] {
  if (form.request === "pickup") return "pickup_from_storage";
  if (form.request === "return") return "return_to_storage";
  if (form.serviceType === "delivery" || form.serviceType === "transport") {
    return "transport_delivery";
  }
  return "custom_transfer";
}

function parseTimeWindow(timeWindow: string): {
  timeWindowStart: string;
  timeWindowEnd: string;
} {
  const [start, end] = timeWindow.split("-").map((p) => p.trim());
  return {
    timeWindowStart: start || "10:00",
    timeWindowEnd: end || "12:00",
  };
}

function applyAddressField(
  body: CreateMemberTransportRequestBody,
  request: TransportDetailsFormState["request"],
  address: string,
) {
  if (!address) return;
  if (request === "pickup") { body.deliveryAddress = address; return; }
  if (request === "return") { body.pickupAddress  = address; return; }
  body.deliveryAddress = address;
}

export function buildMemberTransportRequestBody(
  memberId: string,
  vehicleId: string,
  form: TransportDetailsFormState,
): CreateMemberTransportRequestBody {
  const { timeWindowStart, timeWindowEnd } = parseTimeWindow(form.timeWindow);
  const preferredDate = form.date; // already ISO YYYY-MM-DD from shared date picker
  const address = form.address.trim();
  const notes = form.notes.trim();

  const serviceType = resolveRequestType(form);

  const body: CreateMemberTransportRequestBody = {
    memberId,
    vehicleId,
    serviceType,
    requestType: "transport_delivery",
    preferredDate,
    timeWindowStart,
    timeWindowEnd,
    timeWindow: form.timeWindow,
  };

  applyAddressField(body, form.request, address);

  if (notes) {
    body.notes = notes;
  }

  return stripEmptyRequestFields(body);
}

export function resolveTransportRequestNumber(
  data: MemberTransportRequestData,
): string {
  if (data.referenceNumber?.trim()) {
    return data.referenceNumber.trim();
  }

  if (data.requestNumber?.trim()) {
    return data.requestNumber.trim();
  }

  if (data.id != null && String(data.id).trim()) {
    return String(data.id);
  }

  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const seq = String(Math.floor(Math.random() * 900) + 100);

  return `TR-${yy}${mm}-${seq}`;
}
