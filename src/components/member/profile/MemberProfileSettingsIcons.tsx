import type { ReactNode } from "react";
import type { MemberProfileSettingsIconKey } from "./types";

const iconColor = "#D4A847";

function SettingsIconShell({ children }: { children: ReactNode }) {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-accent/20 bg-accent/5">
      {children}
    </span>
  );
}

const icons: Record<MemberProfileSettingsIconKey, ReactNode> = {
  personal: (
    <SettingsIconShell>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path
          d="M7 7.25C8.10457 7.25 9 6.35457 9 5.25C9 4.14543 8.10457 3.25 7 3.25C5.89543 3.25 5 4.14543 5 5.25C5 6.35457 5.89543 7.25 7 7.25Z"
          stroke={iconColor}
          strokeWidth="0.9"
        />
        <path
          d="M3.5 11.375C3.5 9.67893 5.05393 8.3125 7 8.3125C8.94607 8.3125 10.5 9.67893 10.5 11.375"
          stroke={iconColor}
          strokeWidth="0.9"
          strokeLinecap="round"
        />
      </svg>
    </SettingsIconShell>
  ),
  billing: (
    <SettingsIconShell>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <rect
          x="1.75"
          y="3.5"
          width="10.5"
          height="7"
          rx="1.2"
          stroke={iconColor}
          strokeWidth="0.9"
        />
        <path d="M1.75 6.125H12.25" stroke={iconColor} strokeWidth="0.9" />
        <path
          d="M4.375 8.75H5.6875"
          stroke={iconColor}
          strokeWidth="0.9"
          strokeLinecap="round"
        />
      </svg>
    </SettingsIconShell>
  ),
  membership: (
    <SettingsIconShell>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path
          d="M7 2.625L8.358 5.377L11.375 5.808L9.1875 7.897L9.716 10.895L7 9.433L4.284 10.895L4.813 7.897L2.625 5.808L5.642 5.377L7 2.625Z"
          stroke={iconColor}
          strokeWidth="0.9"
          strokeLinejoin="round"
        />
      </svg>
    </SettingsIconShell>
  ),
  notifications: (
    <SettingsIconShell>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path
          d="M5.25 10.5H8.75"
          stroke={iconColor}
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <path
          d="M3.5 8.75V6.125C3.5 4.42893 4.92893 3.0625 6.5625 3.0625C8.19607 3.0625 9.625 4.42893 9.625 6.125V8.75L10.9375 10.0625H2.1875L3.5 8.75Z"
          stroke={iconColor}
          strokeWidth="0.9"
          strokeLinejoin="round"
        />
      </svg>
    </SettingsIconShell>
  ),
  privacy: (
    <SettingsIconShell>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <circle cx="7" cy="7" r="4.75" stroke={iconColor} strokeWidth="0.9" />
        <circle cx="7" cy="7" r="1.5" fill={iconColor} />
      </svg>
    </SettingsIconShell>
  ),
  security: (
    <SettingsIconShell>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <rect
          x="3.5"
          y="6.125"
          width="7"
          height="5.25"
          rx="1"
          stroke={iconColor}
          strokeWidth="0.9"
        />
        <path
          d="M5.25 6.125V4.8125C5.25 3.67686 6.11437 2.75 7.175 2.75C8.23563 2.75 9.1 3.67686 9.1 4.8125V6.125"
          stroke={iconColor}
          strokeWidth="0.9"
          strokeLinecap="round"
        />
      </svg>
    </SettingsIconShell>
  ),
  favourites: (
    <SettingsIconShell>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path
          d="M3.5 4.375H10.5V9.625C10.5 10.2463 9.99632 10.75 9.375 10.75H4.625C4.00368 10.75 3.5 10.2463 3.5 9.625V4.375Z"
          stroke={iconColor}
          strokeWidth="0.9"
        />
        <path
          d="M5.25 4.375V3.9375C5.25 3.41973 5.66973 3 6.1875 3H7.8125C8.33027 3 8.75 3.41973 8.75 3.9375V4.375"
          stroke={iconColor}
          strokeWidth="0.9"
        />
        <circle cx="7" cy="7.4375" r="1" fill={iconColor} />
      </svg>
    </SettingsIconShell>
  ),
  summon: (
    <SettingsIconShell>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <circle cx="7" cy="7" r="4.75" stroke={iconColor} strokeWidth="0.9" />
        <path
          d="M7 4.8125V7L8.75 8.3125"
          stroke={iconColor}
          strokeWidth="0.9"
          strokeLinecap="round"
        />
      </svg>
    </SettingsIconShell>
  ),
  temperature: (
    <SettingsIconShell>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <rect
          x="4.375"
          y="2.625"
          width="5.25"
          height="8.75"
          rx="1.5"
          stroke={iconColor}
          strokeWidth="0.9"
        />
        <path
          d="M6.125 5.25H7.875M6.125 7H7.875M6.125 8.75H7.875"
          stroke={iconColor}
          strokeWidth="0.9"
          strokeLinecap="round"
        />
      </svg>
    </SettingsIconShell>
  ),
  memory: (
    <SettingsIconShell>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <circle cx="7" cy="7" r="3.5" fill={iconColor} />
      </svg>
    </SettingsIconShell>
  ),
  download: (
    <SettingsIconShell>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path
          d="M7 2.625V8.75"
          stroke={iconColor}
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <path
          d="M4.8125 6.5625L7 8.75L9.1875 6.5625"
          stroke={iconColor}
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.0625 11.375H10.9375"
          stroke={iconColor}
          strokeWidth="0.9"
          strokeLinecap="round"
        />
      </svg>
    </SettingsIconShell>
  ),
};

export function MemberProfileSettingsIcon({
  name,
}: {
  name: MemberProfileSettingsIconKey;
}) {
  return icons[name];
}
