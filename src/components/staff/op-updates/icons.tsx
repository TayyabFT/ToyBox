type IconProps = {
  className?: string;
};

export function MegaphoneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path
        d="M3.5 8.5v3l3 1.5V7l-3 1.5ZM6.5 7 14 4v12l-7.5-3V7Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 7.5c1 .8 1.5 1.7 1.5 2.5s-.5 1.7-1.5 2.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FeedFlagIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path
        d="M5 4.5v11M5 4.5h8.5l-1.5 2.5 1.5 2.5H5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FeedCheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="m7.2 10 1.8 1.8 3.8-3.8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FeedTruckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path
        d="M3.5 6.5h8v5.5H3.5V6.5ZM11.5 9h2.3l1.7 3v1.5h-4V9Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="6.5" cy="13.5" r="1.2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="14" cy="13.5" r="1.2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function FeedWrenchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path
        d="m12.2 4.8 1 1-2.2 2.2a2.4 2.4 0 1 1-3.4 3.4L5.8 11.2a2.4 2.4 0 1 1 3.4-3.4l2.2-2.2 1 1"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FeedInspectIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M10 7v3.2l2 1.2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function RocketIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        d="M8 2.5s3 1.2 3.5 5.5c0 0-1.8-.5-3.5-1.5C5.8 7.5 4 8 4 8 4.5 3.7 8 2.5 8 2.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 10.5 5 13l1.5-.5L8 13l-1.5-2.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SmallFlagIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 14 14" fill="none" className={className} aria-hidden>
      <path
        d="M3 2.5v9M3 2.5h6l-1 2 1 2H3"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
