import type { MemberProfileData } from "./types";

export const memberProfileMock: MemberProfileData = {
  name: "Alex Mitchell",
  handle: "@alexm",
  memberNumber: "No. 0004192",
  tier: "Founding Member",
  stats: [
    { value: "4", label: "Vehicles" },
    { value: "23", label: "Events Attended" },
    { value: "142", label: "Days as Member" },
    { value: "1,847", label: "Miles Driven" },
  ],
  settingsSections: [
    {
      id: "account",
      title: "Account",
      items: [
        {
          id: "personal-information",
          title: "Personal Information",
          subtitle: "Name, Contact, Address",
          icon: "personal",
          action: { type: "link" },
        },
        {
          id: "billing-payments",
          title: "Billing & Payments",
          subtitle: "Cards, Invoices, Statements",
          icon: "billing",
          action: { type: "link" },
        },
        {
          id: "membership-tier",
          title: "Membership Tier",
          subtitle: "Founding · Benefits & Perks",
          icon: "membership",
          action: { type: "status", value: "Active" },
        },
      ],
    },
    {
      id: "preferences",
      title: "Preferences",
      items: [
        {
          id: "notifications",
          title: "Notifications",
          subtitle: "Channels & Alerts",
          icon: "notifications",
          action: { type: "toggle", enabled: true },
        },
        {
          id: "privacy",
          title: "Privacy",
          subtitle: "Visibility & Data",
          icon: "privacy",
          action: { type: "link" },
        },
        {
          id: "security-2fa",
          title: "Security & 2FA",
          subtitle: "Authentication",
          icon: "security",
          action: { type: "status", value: "On" },
        },
      ],
    },
    {
      id: "vehicle-preferences",
      title: "Vehicle Preferences",
      items: [
        {
          id: "favourites-drivers",
          title: "Favourites & Drivers",
          subtitle: "Marco · Preferred",
          icon: "favourites",
          action: { type: "link" },
        },
        {
          id: "default-summon-time",
          title: "Default Summon Time",
          subtitle: "Standard Arrival Window",
          icon: "summon",
          action: { type: "status", value: "30 Min" },
        },
        {
          id: "cabin-temperature",
          title: "Cabin Temperature",
          subtitle: "Climate Pre-set",
          icon: "temperature",
          action: { type: "status", value: "21°C" },
        },
      ],
    },
    {
      id: "connected",
      title: "Connected",
      items: [
        {
          id: "steves-memory",
          title: "Steve's Memory",
          subtitle: "What Steve Remembers About You",
          icon: "memory",
          action: { type: "link" },
        },
        {
          id: "download-my-data",
          title: "Download My Data",
          subtitle: "Export Account Archive",
          icon: "download",
          action: { type: "link" },
        },
      ],
    },
  ],
};
