export type TransportServiceTypeKey = "roadside" | "delivery" | "transport";

export type TransportRequestKey = "pickup" | "return" | "custom";

export type TransportDetailsFormState = {
  serviceType: TransportServiceTypeKey;
  request: TransportRequestKey;
  address: string;
  date: string;
  timeWindow: string;
  notes: string;
};

export type TransportDeliveryVehicleSummary = {
  name: string;
  bayLabel: string;
  statusLabel: string;
  imageUrl: string;
};
