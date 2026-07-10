import type {
  AuthProfileData,
  AuthProfileFieldRaw,
  AuthProfileHeaderStatRaw,
  AuthProfilePanel,
  AuthProfileSectionRaw,
  AuthProfileSectionsNested,
} from "@/types/api";

export type ProfileHeaderStatView = {
  label: string;
  value: string;
  subtext?: string;
};

export type ProfileFieldView = {
  label: string;
  value: string;
};

export type ProfileSectionView = {
  key: string;
  title: string;
  fields: ProfileFieldView[];
};

export type AuthProfileView = {
  panel: AuthProfilePanel;
  name: string;
  initial: string;
  subtitle: string;
  headerStats: ProfileHeaderStatView[];
  sections: ProfileSectionView[];
};

const SECTION_TITLES: Record<string, string> = {
  billing: "Billing",
  membership: "Membership",
  vehiclePreferences: "Vehicle Preferences",
  vehicles: "Vehicles",
  account: "Account",
  security: "Security",
  work: "Work",
};

function humanizeKey(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatFieldValue(value: AuthProfileFieldRaw["value"]): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
}

function mapHeaderStat(
  stat: AuthProfileHeaderStatRaw,
  index: number,
): ProfileHeaderStatView {
  const label =
    stat.label?.trim() ||
    (stat.key ? humanizeKey(stat.key) : `Stat ${index + 1}`);
  const value =
    stat.value !== undefined && stat.value !== null
      ? String(stat.value)
      : stat.count !== undefined && stat.count !== null
        ? String(stat.count)
        : "—";

  return {
    label,
    value,
    subtext: stat.subtext?.trim() || stat.sub?.trim() || undefined,
  };
}

function mapField(
  field: AuthProfileFieldRaw,
  index: number,
): ProfileFieldView | null {
  const label =
    field.label?.trim() ||
    (field.key ? humanizeKey(field.key) : `Field ${index + 1}`);
  const value = formatFieldValue(field.value);

  if (label === "—" && value === "—") {
    return null;
  }

  return { label, value };
}

function mapSection(
  key: string,
  section?: AuthProfileSectionRaw,
): ProfileSectionView | null {
  if (!section) {
    return null;
  }

  const fields = (section.fields ?? section.items ?? [])
    .map(mapField)
    .filter((field): field is ProfileFieldView => Boolean(field));

  if (fields.length === 0 && !section.title?.trim() && !section.label?.trim()) {
    return null;
  }

  const sectionKey = section.key?.trim() || key;

  return {
    key: sectionKey,
    title:
      section.title?.trim() ||
      section.label?.trim() ||
      SECTION_TITLES[sectionKey] ||
      humanizeKey(sectionKey),
    fields,
  };
}

function isNestedProfileSections(
  sections?: AuthProfileData["sections"],
): sections is AuthProfileSectionsNested {
  if (!sections || Array.isArray(sections)) {
    return false;
  }

  return (
    "account" in sections ||
    "preferences" in sections ||
    "connected" in sections ||
    "vehiclePreferences" in sections
  );
}

function mapSections(
  sections?: AuthProfileData["sections"],
): ProfileSectionView[] {
  if (!sections || isNestedProfileSections(sections)) {
    return [];
  }

  if (Array.isArray(sections)) {
    return sections
      .map((section, index) =>
        mapSection(section.key?.trim() || `section-${index + 1}`, section),
      )
      .filter((section): section is ProfileSectionView => Boolean(section));
  }

  return Object.entries(sections)
    .map(([key, section]) => mapSection(key, section))
    .filter((section): section is ProfileSectionView => Boolean(section));
}

function resolvePanel(panel?: string): AuthProfilePanel {
  if (panel === "member" || panel === "staff" || panel === "admin") {
    return panel;
  }

  return "member";
}

function resolveName(data: AuthProfileData): string {
  return (
    data.displayName?.trim() ||
    data.fullName?.trim() ||
    data.name?.trim() ||
    "User"
  );
}

function resolveSubtitle(data: AuthProfileData, panel: AuthProfilePanel): string {
  if (panel === "member") {
    return (
      data.membershipTier?.trim() ||
      data.tier?.trim() ||
      humanizeKey(data.role?.trim() || "member")
    );
  }

  return (
    data.jobTitle?.trim() ||
    humanizeKey(data.role?.trim() || panel)
  );
}

function getInitial(name: string): string {
  const trimmed = name.trim();

  if (!trimmed) {
    return "?";
  }

  return trimmed.charAt(0).toUpperCase();
}

export function mapAuthProfile(data?: AuthProfileData | null): AuthProfileView | null {
  if (!data) {
    return null;
  }

  const panel = resolvePanel(data.panel?.trim() || data.role?.trim());
  const name = resolveName(data);

  return {
    panel,
    name,
    initial: getInitial(name),
    subtitle: resolveSubtitle(data, panel),
    headerStats: (data.headerStats ?? [])
      .map(mapHeaderStat)
      .filter((stat) => stat.label || stat.value),
    sections: mapSections(data.sections),
  };
}
