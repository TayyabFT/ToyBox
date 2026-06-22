export type ConfirmationBadgeTone =
  | "confirmed"
  | "pending"
  | "in-review"
  | "awaiting"
  | "sign-off"
  | "done";

export type ConfirmationStatItem = {
  label: string;
  value: string;
  subtext: string;
  accent?: "gold" | "teal";
};

export type BookingItem = {
  id: string;
  vehicle: string;
  reference: string;
  member: string;
  schedule: string;
  status: ConfirmationBadgeTone;
};

export type PendingBookingItem = {
  id: string;
  index: number;
  title: string;
  bookingRef: string;
  staff: string;
  bay: string;
  price: string;
  status: ConfirmationBadgeTone;
  icon: "check" | "car" | "circle";
};

export type InReviewBooking = {
  id: string;
  vehicle: string;
  member: string;
  schedule: string;
};

export type CompletedTodayItem = {
  id: string;
  title: string;
  bookingRef: string;
  confirmedAt: string;
  assignee: string;
};
