export type ParkingSlotStatus =
  | "available"
  | "occupied"
  | "maintenance"
  | "reserved";

export type ParkingSlotListItem = {
  id: string;
  slotCode: string;
  zone: string;
  level: string;
  slotType: string;
  status: string;
  statusLabel: string;
  isActive: boolean;
};

export type ParkingSlotDetail = {
  id: string;
  slotCode: string;
  level: string;
  zone: string;
  label: string;
  slotType: string;
  slotTypeLabel: string;
  openTime: string;
  closeTime: string;
  status: string;
  statusLabel: string;
  isActive: boolean;
  notes: string;
};

export type ParkingSlotsSummaryDisplay = {
  total: { label: string; value: string; subtext: string };
  available: { label: string; value: string; subtext: string };
  occupied: { label: string; value: string; subtext: string };
  maintenance: { label: string; value: string; subtext: string };
};

export const PARKING_SLOT_STATUS_OPTIONS: {
  id: ParkingSlotStatus;
  label: string;
}[] = [
  { id: "available", label: "Available" },
  { id: "occupied", label: "Occupied" },
  { id: "maintenance", label: "Maintenance" },
  { id: "reserved", label: "Reserved" },
];

export const PARKING_SLOT_TYPE_OPTIONS = [
  { id: "standard", label: "Standard" },
  { id: "covered", label: "Covered" },
  { id: "ev", label: "EV" },
  { id: "premium", label: "Premium" },
  { id: "oversized", label: "Oversized" },
] as const;
