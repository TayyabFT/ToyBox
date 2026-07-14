import type {
  AuthProfileData,
  AuthProfileSectionsNested,
  UpdateAuthProfileRequest,
} from "@/types/api";
import { memberProfileMock } from "@/components/member/profile/mockData";
import type {
  MemberProfileData,
  MemberProfileSettingsItem,
  MemberProfileSettingsSection,
  MemberProfileStat,
} from "@/components/member/profile/types";

function hasValue(value?: string | null): value is string {
  return Boolean(value?.trim());
}

function orFallback(apiValue: string | undefined | null, fallback: string): string {
  return hasValue(apiValue) ? apiValue.trim() : fallback;
}

function formatPhone(
  phone?: string,
  mobile?: string,
  countryCode?: string,
): string {
  if (hasValue(phone)) {
    return phone.trim();
  }

  const m = mobile?.trim();
  if (!m) {
    return "";
  }

  const cc = countryCode?.trim();
  return cc ? `${cc} ${m}` : m;
}

function formatDisplayValue(value?: string | null, fallback = "—"): string {
  return hasValue(value) ? value.trim() : fallback;
}

function formatBool(value?: boolean, fallback = "—"): string {
  if (value === undefined) {
    return fallback;
  }

  return value ? "On" : "Off";
}

function humanizeEnum(value?: string): string {
  if (!hasValue(value)) {
    return "—";
  }

  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function capitalizeTier(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return trimmed;
  }

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function isNestedSections(
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

function getNestedSections(
  data: AuthProfileData,
): AuthProfileSectionsNested | undefined {
  return isNestedSections(data.sections) ? data.sections : undefined;
}

function mapHeaderStats(data: AuthProfileData): MemberProfileStat[] {
  if (data.headerStats && data.headerStats.length > 0) {
    return data.headerStats.map((stat) => ({
      label: stat.label?.trim() || stat.key?.trim() || "Stat",
      value:
        stat.value !== undefined && stat.value !== null
          ? String(stat.value)
          : stat.count !== undefined && stat.count !== null
            ? String(stat.count)
            : "—",
    }));
  }

  const stats = data.stats;
  if (stats) {
    const derived: MemberProfileStat[] = [];

    if (stats.vehicles !== undefined) {
      derived.push({ value: String(stats.vehicles), label: "Vehicles" });
    }
    if (stats.eventsAttended !== undefined) {
      derived.push({
        value: String(stats.eventsAttended),
        label: "Events Attended",
      });
    }
    if (data.memberDays !== undefined) {
      derived.push({
        value: String(data.memberDays),
        label: "Days as Member",
      });
    } else if (stats.memberDays !== undefined) {
      derived.push({
        value: String(stats.memberDays),
        label: "Days as Member",
      });
    }
    if (stats.milesDriven !== undefined) {
      derived.push({
        value: String(stats.milesDriven),
        label: "Miles Driven",
      });
    }

    if (derived.length > 0) {
      return derived;
    }
  }

  return memberProfileMock.stats;
}

function withDetailFields(
  item: MemberProfileSettingsItem,
  detailFields?: { label: string; value: string }[],
): MemberProfileSettingsItem {
  if (!detailFields || detailFields.length === 0) {
    return item;
  }

  return { ...item, detailFields };
}

function mapSettingsSections(data: AuthProfileData): MemberProfileSettingsSection[] {
  const sections = getNestedSections(data);
  const personal = sections?.account?.personalInformation;
  const membership = sections?.account?.membership;
  const notifications = sections?.preferences?.notifications;
  const privacy = sections?.preferences?.privacy ?? data.privacySettings;
  const security = sections?.preferences?.security;
  const downloadData = sections?.connected?.downloadMyData;

  const membershipTier =
    data.roleDetail?.user?.membershipTier?.trim() ||
    data.membershipTier?.trim() ||
    data.tier?.trim() ||
    "";

  const memberNumber = data.roleDetail?.user?.memberNumber?.trim() || "";
  const phone = formatPhone(data.phone, data.mobile, data.mobileCountryCode);
  const address =
    data.address?.trim() || data.residence?.trim() || personal?.address?.trim() || "";

  return memberProfileMock.settingsSections.map((section) => ({
    ...section,
    items: section.items.map((item) => {
      switch (item.id) {
        case "personal-information":
          return withDetailFields(
            {
              ...item,
              title: orFallback(personal?.title, item.title),
              subtitle: orFallback(personal?.subtitle, item.subtitle),
            },
            [
              {
                label: "Name",
                value: formatDisplayValue(
                  personal?.name || data.fullName || data.name,
                ),
              },
              {
                label: "Email",
                value: formatDisplayValue(personal?.email || data.email),
              },
              {
                label: "Phone",
                value: formatDisplayValue(
                  personal?.phone || phone,
                ),
              },
              {
                label: "Address",
                value: formatDisplayValue(
                  personal?.address || address,
                ),
              },
            ],
          );

        case "billing-payments":
          return withDetailFields(item, [
            { label: "Payment Methods", value: "—" },
            { label: "Invoices", value: "—" },
            { label: "Statements", value: "—" },
          ]);

        case "membership-tier": {
          const tierLabel = membershipTier
            ? capitalizeTier(membershipTier)
            : item.action.type === "status"
              ? item.action.value
              : "—";

          return withDetailFields(
            {
              ...item,
              subtitle: membershipTier
                ? `${capitalizeTier(membershipTier)} · Benefits & Perks`
                : item.subtitle,
              action: {
                type: "status",
                value:
                  membership?.status?.trim() ||
                  data.roleDetail?.accountStatus?.trim() ||
                  (item.action.type === "status" ? item.action.value : "Active"),
              },
            },
            [
              { label: "Tier", value: formatDisplayValue(tierLabel) },
              {
                label: "Member Number",
                value: formatDisplayValue(
                  memberNumber ? `No. ${memberNumber}` : "",
                ),
              },
              {
                label: "Status",
                value: formatDisplayValue(
                  membership?.status ||
                    data.roleDetail?.accountStatus ||
                    "Active",
                ),
              },
            ],
          );
        }

        case "notifications":
          return withDetailFields(
            {
              ...item,
              title: orFallback(notifications?.title, item.title),
              subtitle: orFallback(notifications?.subtitle, item.subtitle),
              action: {
                type: "toggle",
                enabled:
                  notifications?.pushEnabled ??
                  (item.action.type === "toggle" ? item.action.enabled : true),
              },
            },
            [
              {
                label: "Push Notifications",
                value: formatBool(
                  notifications?.pushEnabled,
                  item.action.type === "toggle" && item.action.enabled
                    ? "On"
                    : "Off",
                ),
              },
              {
                label: "Email Alerts",
                value: formatBool(notifications?.emailEnabled),
              },
              {
                label: "SMS Alerts",
                value: formatBool(notifications?.smsEnabled),
              },
            ],
          );

        case "privacy":
          return withDetailFields(
            {
              ...item,
              title: orFallback(privacy?.title, item.title),
              subtitle: orFallback(privacy?.subtitle, item.subtitle),
            },
            [
              {
                label: "Profile Visibility",
                value: humanizeEnum(privacy?.profileVisibility),
              },
              {
                label: "Show at Club",
                value: formatBool(privacy?.showAtClub),
              },
              {
                label: "Events Attendance",
                value: humanizeEnum(privacy?.eventsAttendanceVisibility),
              },
              {
                label: "Vehicle Visibility",
                value: humanizeEnum(privacy?.vehicleVisibility),
              },
              {
                label: "Biometric Unlock",
                value: formatBool(privacy?.biometricUnlockEnabled),
              },
            ],
          );

        case "security-2fa":
          return withDetailFields(
            {
              ...item,
              title: orFallback(security?.title, item.title),
              subtitle: orFallback(security?.subtitle, item.subtitle),
              action: {
                type: "status",
                value:
                  security?.statusLabel?.trim() ||
                  formatBool(
                    security?.twoFactorEnabled ?? data.twoFactorEnabled,
                  ),
              },
            },
            [
              {
                label: "Two-Factor Authentication",
                value: formatBool(
                  security?.twoFactorEnabled ?? data.twoFactorEnabled,
                ),
              },
              {
                label: "Status",
                value: formatDisplayValue(
                  security?.statusLabel ||
                    formatBool(
                      security?.twoFactorEnabled ?? data.twoFactorEnabled,
                    ),
                ),
              },
            ],
          );

        case "favourites-drivers":
          return withDetailFields(item, [
            { label: "Preferred Driver", value: "Marco" },
            { label: "Backup Driver", value: "—" },
          ]);

        case "default-summon-time":
          return withDetailFields(item, [
            { label: "Arrival Window", value: "30 Min" },
          ]);

        case "cabin-temperature":
          return withDetailFields(item, [
            { label: "Climate Pre-set", value: "21°C" },
          ]);

        case "steves-memory":
          return withDetailFields(item, [
            {
              label: "Memory Summary",
              value: "What Steve remembers about you",
            },
          ]);

        case "download-my-data":
          return withDetailFields(
            {
              ...item,
              title: orFallback(downloadData?.title, item.title),
              subtitle: orFallback(downloadData?.subtitle, item.subtitle),
            },
            [
              {
                label: "Export Available",
                value: formatBool(downloadData?.available, "—"),
              },
            ],
          );

        default:
          return item;
      }
    }),
  }));
}

export function mapMemberProfileData(
  data?: AuthProfileData | null,
): MemberProfileData {
  if (!data) {
    return memberProfileMock;
  }

  const membershipTier =
    data.roleDetail?.user?.membershipTier?.trim() ||
    data.membershipTier?.trim() ||
    data.tier?.trim() ||
    "";

  const memberNumber = data.roleDetail?.user?.memberNumber?.trim() || "";
  const displayHandle = data.displayHandle?.trim() || "";

  const profileImageUrl =
    data.profileImageUrl?.trim() ||
    data.profileImage?.trim() ||
    data.avatarUrl?.trim() ||
    data.roleDetail?.user?.profileImageUrl?.trim() ||
    "";

  return {
    name: orFallback(
      data.name || data.fullName || data.displayName,
      memberProfileMock.name,
    ),
    handle: displayHandle
      ? displayHandle.startsWith("@")
        ? displayHandle
        : `@${displayHandle}`
      : memberProfileMock.handle,
    memberNumber: memberNumber
      ? `No. ${memberNumber}`
      : memberProfileMock.memberNumber,
    tier: membershipTier
      ? capitalizeTier(membershipTier)
      : memberProfileMock.tier,
    profileImageUrl: profileImageUrl || undefined,
    stats: mapHeaderStats(data),
    settingsSections: mapSettingsSections(data),
  };
}

export type MemberProfileEditFormState = {
  firstName: string;
  lastName: string;
  displayHandle: string;
  email: string;
  jobTitle: string;
  mobile: string;
  mobileCountryCode: string;
  residence: string;
  address: string;
  coverImageUrl: string;
};

function resolveProfileNames(data: AuthProfileData): {
  firstName: string;
  lastName: string;
} {
  if (data.firstName?.trim() || data.lastName?.trim()) {
    return {
      firstName: data.firstName?.trim() || "",
      lastName: data.lastName?.trim() || "",
    };
  }

  const fullName =
    data.fullName?.trim() || data.name?.trim() || data.displayName?.trim() || "";
  const parts = fullName.split(/\s+/).filter(Boolean);

  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
}

export function mapAuthProfileToEditForm(
  data: AuthProfileData,
): MemberProfileEditFormState {
  const { firstName, lastName } = resolveProfileNames(data);
  const sections = getNestedSections(data);
  const personal = sections?.account?.personalInformation;

  return {
    firstName,
    lastName,
    displayHandle: (data.displayHandle?.trim() || "").replace(/^@/, ""),
    email: data.email?.trim() || personal?.email?.trim() || "",
    jobTitle: data.jobTitle?.trim() || "",
    mobile: data.mobile?.trim() || "",
    mobileCountryCode: data.mobileCountryCode?.trim() || "",
    residence: data.residence?.trim() || "",
    address:
      data.address?.trim() ||
      data.residence?.trim() ||
      personal?.address?.trim() ||
      "",
    coverImageUrl: data.coverImageUrl?.trim() || "",
  };
}

export function buildMemberProfileUpdatePayload(
  form: MemberProfileEditFormState,
): UpdateAuthProfileRequest {
  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    displayHandle: form.displayHandle.trim(),
    email: form.email.trim(),
    jobTitle: form.jobTitle.trim(),
    mobile: form.mobile.trim(),
    mobileCountryCode: form.mobileCountryCode.trim(),
    residence: form.residence.trim(),
    address: form.address.trim(),
    coverImageUrl: form.coverImageUrl.trim(),
  };
}
