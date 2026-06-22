import type { StaffStatsDisplay } from "./types";

export const staffStats: StaffStatsDisplay = {
  totalStaff: {
    label: "TOTAL STAFF",
    value: "0",
    subtext: "OPERATIVES",
  },
  activeStaff: {
    label: "ACTIVE",
    value: "0",
    subtext: "ON SYSTEM",
  },
  pendingActivation: {
    label: "PENDING ACTIVATION",
    value: "0",
    subtext: "INVITE SENT",
  },
  invitedThisMonth: {
    label: "INVITED THIS MONTH",
    value: "0",
    subtext: "NEW HIRES",
  },
};
