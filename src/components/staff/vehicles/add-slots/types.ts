export type ParkingSlotTypeOption =
  | "standard"
  | "covered"
  | "oversized"
  | "ev"
  | "premium";

export type AddSlotsFormState = {
  createMultiple: boolean;
  bayPrefix: string;
  baySuffix: string;
  slotCount: number;
  slotType: ParkingSlotTypeOption;
  openTime: string;
  closeTime: string;
  notes: string;
};

export const BAY_PREFIX_OPTIONS = ["A", "B", "C"] as const;

export const MAX_SLOTS = 8;

export const SLOT_TYPE_OPTIONS: {
  id: ParkingSlotTypeOption;
  label: string;
}[] = [
  { id: "standard", label: "Standard" },
  { id: "covered", label: "Covered" },
  { id: "ev", label: "EV" },
  { id: "premium", label: "Premium" },
  { id: "oversized", label: "Oversized" },
];

export function createInitialAddSlotsForm(): AddSlotsFormState {
  return {
    createMultiple: false,
    bayPrefix: "A",
    baySuffix: "01",
    slotCount: 4,
    slotType: "standard",
    openTime: "06:00",
    closeTime: "22:00",
    notes: "",
  };
}
