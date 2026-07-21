// ── Member Parking Modal — types ─────────────────────────────────────────────

export type ParkingMode = "drop_self" | "pickup";

export type ParkingSlotResult = {
  id: string;
  slotCode: string;
  label: string;
  level: string;
  zone: string;
  slotType: string;
  slotTypeLabel: string;
  openTime: string;
  closeTime: string;
  status: "available" | "occupied" | string;
  statusLabel: string;
};

// ── Step 1: Find Slot form ───────────────────────────────────────────────────

export type ParkingFindSlotFormState = {
  /** ISO datetime string for the parking window start */
  fromDate: string; // YYYY-MM-DD
  fromTime: string; // HH:mm
  /** ISO datetime string for the parking window end */
  toDate: string;   // YYYY-MM-DD
  toTime: string;   // HH:mm
  /** Filter chips */
  level: string;    // "any" | "01" | "02" | "03" ...
  zone: string;     // "any" | "A" | "B" | "C"
  slotType: string; // "any" | "standard" | "covered" | "ev" | "premium" | "oversized"
  selectableOnly: boolean;
};

// ── Step 2: Review form ──────────────────────────────────────────────────────

export type ParkingReviewFormState = {
  mode: ParkingMode;
  pickupAddress: string;
  pickupNotes: string;
};

// ── Combined form across both steps ─────────────────────────────────────────

export type ParkingFormState = ParkingFindSlotFormState & ParkingReviewFormState;

// ── Submission result ────────────────────────────────────────────────────────

export type ParkingSubmitResult = {
  sessionId: string;
  referenceNumber: string;
  status: string;
};
