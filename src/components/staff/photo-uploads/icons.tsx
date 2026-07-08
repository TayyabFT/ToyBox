type IconProps = {
  className?: string;
};

const base = "h-[18px] w-[18px]";

export function CaptureCameraIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className ?? base}>
      <path
        d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.2-1.8h6.6L16.5 7h2A1.5 1.5 0 0 1 20 8.5v8A1.5 1.5 0 0 1 18.5 18h-13A1.5 1.5 0 0 1 4 16.5v-8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function VideoIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className ?? base}>
      <rect
        x="3"
        y="7"
        width="11"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M14 10.5 21 8v8l-7-2.5v-3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BurstIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className ?? base}>
      <rect
        x="7"
        y="7"
        width="11"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M5 15V6.5A1.5 1.5 0 0 1 6.5 5H15"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ZoomIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className ?? base}>
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="m15.5 15.5 3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M11 8.5v5M8.5 11h5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FlashIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className ?? base}>
      <path
        d="M13 3 5 13h6l-1 8 8-10h-6l1-8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ScanIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className ?? base}>
      <path
        d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M4 12h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function RecDotIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden className={className ?? "size-2.5"}>
      <circle cx="6" cy="6" r="4" fill="currentColor" />
    </svg>
  );
}

export function SyncIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className ?? "size-3.5"}>
      <path
        d="M3 8a5 5 0 0 1 8.5-3.5L13 6M13 8a5 5 0 0 1-8.5 3.5L3 10"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 3.5V6h-2.5M3 12.5V10h2.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FilterIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className ?? "size-3.5"}>
      <path
        d="M2.5 4h11M4.5 8h7M6.5 12h3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FlagIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className ?? "size-3.5"}>
      <path
        d="M4 2.5v11"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M4 3h7l-1.3 2L11 7H4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DocReportIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className ?? "size-3.5"}>
      <path
        d="M4 2h5l3 3v9H4V2Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M9 2v3h3M6 8.5h4M6 11h4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SignOffIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className ?? "size-3.5"}>
      <path
        d="M2.5 12c1.5-3 3-4.5 4-4.5.8 0 1 .8.5 1.6-.6 1-1.4 1.4-1.4.6 0-1 1.5-3 3-3 .9 0 1.2.7.9 1.4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 8.5 13 6l-1-1-2.5 2.5V8.5h1Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DetailingIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className ?? "size-3.5"}>
      <path
        d="M10 2 8 6M10 2l2 1-3.2 3.4M8 6 4 10.5c-.6.7-.6 1.7 0 2.4.7.7 1.7.7 2.4 0L11 8.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TransportIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 16" fill="none" aria-hidden className={className ?? "size-3.5"}>
      <path
        d="M2 10V6.5A1.5 1.5 0 0 1 3.5 5H10v5M10 6h2.8l2.2 2.5V10"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="5" cy="11.5" r="1.4" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12.5" cy="11.5" r="1.4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M6.4 11.5h4.7M2 10h1.6M14 10h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function PreServiceIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className ?? "size-3.5"}>
      <path
        d="M3 6.5 7 10l6-6.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 8v3.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5v-7A1.5 1.5 0 0 1 4.5 3H10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CameraRollIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 10 10" fill="none" aria-hidden className={className ?? "size-2.5"}>
      <path
        d="M7.39415 1.49548H1.94581C1.51595 1.49548 1.16748 1.84396 1.16748 2.27382V7.72215C1.16748 8.15201 1.51595 8.50048 1.94581 8.50048H7.39415C7.82401 8.50048 8.17248 8.15201 8.17248 7.72215V2.27382C8.17248 1.84396 7.82401 1.49548 7.39415 1.49548Z"
        stroke="currentColor"
        strokeWidth="0.778333"
      />
      <path
        d="M3.30811 4.22009C3.63063 4.22009 3.89209 3.95863 3.89209 3.63611C3.89209 3.31358 3.63063 3.05212 3.30811 3.05212C2.98558 3.05212 2.72412 3.31358 2.72412 3.63611C2.72412 3.95863 2.98558 4.22009 3.30811 4.22009Z"
        stroke="currentColor"
        strokeWidth="0.778333"
      />
      <path
        d="M8.17247 6.16544L6.22663 4.2196L1.9458 8.50044"
        stroke="currentColor"
        strokeWidth="0.778333"
      />
    </svg>
  );
}

export function FilesAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 10 10" fill="none" aria-hidden className={className ?? "size-2.5"}>
      <path
        d="M8.3335 1.25H1.66683C1.20659 1.25 0.833496 1.6231 0.833496 2.08333V6.25C0.833496 6.71024 1.20659 7.08333 1.66683 7.08333H8.3335C8.79373 7.08333 9.16683 6.71024 9.16683 6.25V2.08333C9.16683 1.6231 8.79373 1.25 8.3335 1.25Z"
        stroke="currentColor"
        strokeWidth="0.833333"
      />
      <path d="M3.3335 8.75H6.66683" stroke="currentColor" strokeWidth="0.833333" />
      <path d="M5 7.08337V8.75004" stroke="currentColor" strokeWidth="0.833333" />
    </svg>
  );
}

export function ImportIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className ?? "size-3.5"}>
      <path
        d="M8 2.5v6M5.5 6 8 8.5 10.5 6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 10.5v1.5A1.5 1.5 0 0 0 4.5 13.5h7A1.5 1.5 0 0 0 13 12v-1.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function UploadFileArrowIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden className={className ?? "size-[18px]"}>
      <path
        d="M15.75 11.25V14.25C15.75 14.6478 15.592 15.0294 15.3107 15.3107C15.0294 15.592 14.6478 15.75 14.25 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V11.25"
        stroke="currentColor"
        strokeWidth="1.125"
      />
      <path
        d="M5.25 7.5L9 11.25L12.75 7.5"
        stroke="currentColor"
        strokeWidth="1.125"
      />
      <path d="M9 11.25V2.25" stroke="currentColor" strokeWidth="1.125" />
    </svg>
  );
}

export function UploadFromDeviceIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 28 28" fill="none" aria-hidden className={className ?? "size-7"}>
      <path
        d="M24.5 17.5V22.1667C24.5 22.7855 24.2542 23.379 23.8166 23.8166C23.379 24.2542 22.7855 24.5 22.1667 24.5H5.83333C5.21449 24.5 4.621 24.2542 4.18342 23.8166C3.74583 23.379 3.5 22.7855 3.5 22.1667V17.5"
        stroke="currentColor"
        strokeWidth="1.63333"
      />
      <path
        d="M8.1665 11.6666L13.9998 17.5L19.8332 11.6666"
        stroke="currentColor"
        strokeWidth="1.63333"
      />
      <path d="M14 17.5V3.5" stroke="currentColor" strokeWidth="1.63333" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden className={className ?? "size-3"}>
      <path
        d="M2.5 6.2 5 8.5l4.5-5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DeleteIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className ?? "size-3.5"}>
      <path
        d="M3.5 4.5h9M6 4.5V3.5h4v1M6.5 7v4M9.5 7v4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 4.5 5.5 12.5h5L11 4.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EditIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className ?? "size-3.5"}>
      <path
        d="m10.5 3 2.5 2.5-7 7H3.5V10l7-7Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
