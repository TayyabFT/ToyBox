export type MemberProfileStat = {
  value: string;
  label: string;
};

export type MemberProfileSettingsAction =
  | { type: "link" }
  | { type: "status"; value: string }
  | { type: "toggle"; enabled: boolean };

export type MemberProfileSettingsItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: MemberProfileSettingsIconKey;
  action: MemberProfileSettingsAction;
};

export type MemberProfileSettingsSection = {
  id: string;
  title: string;
  items: MemberProfileSettingsItem[];
};

export type MemberProfileSettingsIconKey =
  | "personal"
  | "billing"
  | "membership"
  | "notifications"
  | "privacy"
  | "security"
  | "favourites"
  | "summon"
  | "temperature"
  | "memory"
  | "download";

export type MemberProfileData = {
  name: string;
  handle: string;
  memberNumber: string;
  tier: string;
  stats: MemberProfileStat[];
  settingsSections: MemberProfileSettingsSection[];
};
