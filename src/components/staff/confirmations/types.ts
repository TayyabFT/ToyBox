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
};

export type ConfirmationStatsDisplay = {
  pendingConfirm: ConfirmationStatItem;
  signOffQueue: ConfirmationStatItem;
  completedToday: ConfirmationStatItem;
  shiftProgress: ConfirmationStatItem;
};

export type ConfirmationRequestItem = {
  id: string;
  vehicle: string;
  reference: string;
  member: string;
  memberId: string;
  memberName: string;
  schedule: string;
  status: ConfirmationBadgeTone;
  confirmationStatus: string;
  showOfferVehicle: boolean;
};
