type SvgIconProps = {
  active?: boolean;
  inverted?: boolean;
  stroke?: string;
  className?: string;
};

function getNavStroke(active?: boolean, inverted?: boolean, stroke?: string) {
  if (stroke) return stroke;
  if (inverted && active) return "var(--dark)";
  return active ? "var(--accent)" : "var(--muted)";
}

export function OverviewPulse({
  active,
  inverted,
  stroke: strokeOverride,
  className,
}: SvgIconProps) {
  const stroke = getNavStroke(active, inverted, strokeOverride);

  return (
    <svg
      width="12"
      height="14"
      viewBox="0 0 12 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 6.90043H2.66667L4.66667 1.56709L7.33333 12.2338L9.33333 6.90043H12"
        stroke="#B8AE96"
        strokeWidth="0.933333"
      />
    </svg>
  );
}

export function OverviewBolt({
  active,
  inverted,
  stroke: strokeOverride,
  className,
}: SvgIconProps) {
  const stroke = getNavStroke(active, inverted, strokeOverride);

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M7.5 1.5L3.5 8H7L6.5 12.5L10.5 6H7L7.5 1.5Z"
        stroke={stroke}
        strokeWidth="0.9625"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NavMegaphone({
  active,
  inverted,
  stroke: strokeOverride,
  className,
}: SvgIconProps) {
  const stroke = getNavStroke(active, inverted, strokeOverride);

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M2.5 5.5H5.5L9.5 2.5V11.5L5.5 8.5H2.5V5.5Z"
        stroke={stroke}
        strokeWidth="0.9625"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 5.5C11.25 6.25 11.25 7.75 10.5 8.5"
        stroke={stroke}
        strokeWidth="0.9625"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function NavDollar({
  active,
  inverted,
  stroke: strokeOverride,
  className,
}: SvgIconProps) {
  const stroke = getNavStroke(active, inverted, strokeOverride);

  return (
    <svg
      width="9"
      height="15"
      viewBox="0 0 9 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.46667 0V14.6667M7.8 2.66667H2.8C2.18116 2.66667 1.58767 2.9125 1.15008 3.35008C0.7125 3.78767 0.466667 4.38116 0.466667 5C0.466667 5.61884 0.7125 6.21233 1.15008 6.64992C1.58767 7.0875 2.18116 7.33333 2.8 7.33333H6.13333C6.75217 7.33333 7.34567 7.57917 7.78325 8.01675C8.22084 8.45434 8.46667 9.04783 8.46667 9.66667C8.46667 10.2855 8.22084 10.879 7.78325 11.3166C7.34567 11.7542 6.75217 12 6.13333 12H0.466667"
        stroke="#B8AE96"
        strokeWidth="0.933333"
      />
    </svg>
  );
}

export function StatMembersIcon({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <circle cx="8" cy="5.5" r="2.25" stroke={color} strokeWidth="1" />
      <path
        d="M3.5 13.5V12.25C3.5 10.56 4.85 9.25 6.5 9.25H9.5C11.15 9.25 12.5 10.56 12.5 12.25V13.5"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function StatCarIcon({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M3 10.5H4.2L5 8.5H11L11.8 10.5H13"
        stroke={color}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 10.5H13.5V12.5C13.5 13 13 13.5 12.5 13.5H3.5C3 13.5 2.5 13 2.5 12.5V10.5Z"
        stroke={color}
        strokeWidth="1"
      />
      <circle cx="5" cy="12.5" r="0.75" fill={color} />
      <circle cx="11" cy="12.5" r="0.75" fill={color} />
    </svg>
  );
}

export function StatMessageIcon({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M13.5 10.5C13.5 10.8978 13.342 11.2794 13.0607 11.5607C12.7794 11.842 12.3978 12 12 12H5L2.5 14.5V4.5C2.5 4.10218 2.65799 3.72064 2.93934 3.43934C3.22064 3.15799 3.60218 3 4 3H12C12.3978 3 12.7794 3.15799 13.0607 3.43934C13.342 3.72064 13.5 4.10218 13.5 4.5V10.5Z"
        stroke={color}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StatDollarIcon({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <path d="M8 2V14" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <path
        d="M10.5 4.5H6.75C6.06 4.5 5.5 5.06 5.5 5.75C5.5 6.44 6.06 7 6.75 7H9.25C9.94 7 10.5 7.56 10.5 8.25C10.5 8.94 9.94 9.5 9.25 9.5H5.5"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ToyBoxLogoMark({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={className}
    >
      <rect x="2" y="2" width="7" height="7" rx="1.5" fill="#B8943F" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" fill="#5C4D35" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" fill="#5C4D35" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" fill="#B8943F" />
    </svg>
  );
}

export function Grid({ active, className }: SvgIconProps) {
  const stroke = getNavStroke(active);

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M5.25 1.75H2.33333C2.01117 1.75 1.75 2.01117 1.75 2.33333V5.25C1.75 5.57217 2.01117 5.83333 2.33333 5.83333H5.25C5.57217 5.83333 5.83333 5.57217 5.83333 5.25V2.33333C5.83333 2.01117 5.57217 1.75 5.25 1.75Z"
        stroke={stroke}
        strokeWidth="0.9625"
      />
      <path
        d="M11.6666 1.75H8.74996C8.42779 1.75 8.16663 2.01117 8.16663 2.33333V5.25C8.16663 5.57217 8.42779 5.83333 8.74996 5.83333H11.6666C11.9888 5.83333 12.25 5.57217 12.25 5.25V2.33333C12.25 2.01117 11.9888 1.75 11.6666 1.75Z"
        stroke={stroke}
        strokeWidth="0.9625"
      />
      <path
        d="M11.6666 8.16667H8.74996C8.42779 8.16667 8.16663 8.42784 8.16663 8.75001V11.6667C8.16663 11.9888 8.42779 12.25 8.74996 12.25H11.6666C11.9888 12.25 12.25 11.9888 12.25 11.6667V8.75001C12.25 8.42784 11.9888 8.16667 11.6666 8.16667Z"
        stroke={stroke}
        strokeWidth="0.9625"
      />
      <path
        d="M5.25 8.16667H2.33333C2.01117 8.16667 1.75 8.42784 1.75 8.75001V11.6667C1.75 11.9888 2.01117 12.25 2.33333 12.25H5.25C5.57217 12.25 5.83333 11.9888 5.83333 11.6667V8.75001C5.83333 8.42784 5.57217 8.16667 5.25 8.16667Z"
        stroke={stroke}
        strokeWidth="0.9625"
      />
    </svg>
  );
}

export function Checkbox({ active, className }: SvgIconProps) {
  const stroke = active ? "var(--accent)" : "var(--muted)";

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M5.25 6.41666L7 8.16666L12.8333 2.33333"
        stroke={stroke}
        strokeWidth="0.9625"
      />
      <path
        d="M12.25 7V11.0833C12.25 11.3928 12.1271 11.6895 11.9083 11.9083C11.6895 12.1271 11.3928 12.25 11.0833 12.25H2.91667C2.60725 12.25 2.3105 12.1271 2.09171 11.9083C1.87292 11.6895 1.75 11.3928 1.75 11.0833V2.91667C1.75 2.60725 1.87292 2.3105 2.09171 2.09171C2.3105 1.87292 2.60725 1.75 2.91667 1.75H9.33333"
        stroke={stroke}
        strokeWidth="0.9625"
      />
    </svg>
  );
}

export function CircleCheck({ active, className }: SvgIconProps) {
  const stroke = active ? "var(--accent)" : "var(--muted)";

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M12.8333 6.46334V7C12.8326 8.25792 12.4253 9.4819 11.6721 10.4894C10.9189 11.4969 9.86021 12.2339 8.65392 12.5906C7.44763 12.9473 6.15836 12.9044 4.9784 12.4685C3.79844 12.0326 2.79101 11.2269 2.10635 10.1716C1.4217 9.11636 1.0965 7.86804 1.17927 6.61285C1.26204 5.35766 1.74833 4.16286 2.56562 3.20663C3.38292 2.2504 4.48742 1.58398 5.7144 1.30675C6.94139 1.02953 8.22512 1.15637 9.37413 1.66834"
        stroke={stroke}
        strokeWidth="0.9625"
      />
      <path
        d="M12.8333 2.33333L7 8.17249L5.25 6.42249"
        stroke={stroke}
        strokeWidth="0.9625"
      />
    </svg>
  );
}

export function Sunburst({ active, className }: SvgIconProps) {
  const stroke = active ? "var(--accent)" : "var(--muted)";

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M7 8.75C7.9665 8.75 8.75 7.9665 8.75 7C8.75 6.0335 7.9665 5.25 7 5.25C6.0335 5.25 5.25 6.0335 5.25 7C5.25 7.9665 6.0335 8.75 7 8.75Z"
        stroke={stroke}
        strokeWidth="0.9625"
      />
      <path
        d="M7.00004 0.583328V1.74999M7.00004 12.25V13.4167M2.46171 2.46166L3.29004 3.28999M10.71 10.71L11.5384 11.5383M0.583374 6.99999H1.75004M12.25 6.99999H13.4167M2.46171 11.5383L3.29004 10.71M10.71 3.28999L11.5384 2.46166"
        stroke={stroke}
        strokeWidth="0.9625"
      />
    </svg>
  );
}

export function Camera({ active, className }: SvgIconProps) {
  const stroke = active ? "var(--accent)" : "var(--muted)";

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M13.4167 11.0833C13.4167 11.3928 13.2938 11.6895 13.075 11.9083C12.8562 12.1271 12.5595 12.25 12.25 12.25H1.75004C1.44062 12.25 1.14388 12.1271 0.925083 11.9083C0.70629 11.6895 0.583374 11.3928 0.583374 11.0833V4.66667C0.583374 4.35725 0.70629 4.0605 0.925083 3.84171C1.14388 3.62292 1.44062 3.5 1.75004 3.5H4.08337L5.25004 1.75H8.75004L9.91671 3.5H12.25C12.5595 3.5 12.8562 3.62292 13.075 3.84171C13.2938 4.0605 13.4167 4.35725 13.4167 4.66667V11.0833Z"
        stroke={stroke}
        strokeWidth="0.9625"
      />
      <path
        d="M6.99996 9.91667C8.28862 9.91667 9.33329 8.872 9.33329 7.58333C9.33329 6.29467 8.28862 5.25 6.99996 5.25C5.71129 5.25 4.66663 6.29467 4.66663 7.58333C4.66663 8.872 5.71129 9.91667 6.99996 9.91667Z"
        stroke={stroke}
        strokeWidth="0.9625"
      />
    </svg>
  );
}

export function User({
  active,
  inverted,
  stroke: strokeOverride,
  className,
}: SvgIconProps) {
  const stroke = getNavStroke(active, inverted, strokeOverride);

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M11.6667 12.25V11.0833C11.6667 10.4645 11.4209 9.871 10.9833 9.43342C10.5457 8.99583 9.95221 8.75 9.33337 8.75H4.66671C4.04787 8.75 3.45438 8.99583 3.01679 9.43342C2.57921 9.871 2.33337 10.4645 2.33337 11.0833V12.25"
        stroke={stroke}
        strokeWidth="0.9625"
      />
      <path
        d="M6.99996 6.41667C8.28862 6.41667 9.33329 5.372 9.33329 4.08333C9.33329 2.79467 8.28862 1.75 6.99996 1.75C5.71129 1.75 4.66663 2.79467 4.66663 4.08333C4.66663 5.372 5.71129 6.41667 6.99996 6.41667Z"
        stroke={stroke}
        strokeWidth="0.9625"
      />
    </svg>
  );
}

export function Message({
  active,
  inverted,
  stroke: strokeOverride,
  className,
}: SvgIconProps) {
  const stroke = getNavStroke(active, inverted, strokeOverride);

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M12.25 8.75C12.25 9.05942 12.1271 9.35616 11.9083 9.57496C11.6895 9.79375 11.3928 9.91667 11.0833 9.91667H4.08333L1.75 12.25V2.91667C1.75 2.60725 1.87292 2.3105 2.09171 2.09171C2.3105 1.87292 2.60725 1.75 2.91667 1.75H11.0833C11.0833 2.05942 11.2062 2.35617 11.425 2.57496C11.6438 2.79375 11.9406 2.91667 12.25 2.91667V8.75Z"
        stroke={stroke}
        strokeWidth="0.9625"
      />
    </svg>
  );
}

export function Edit({ active, className }: SvgIconProps) {
  const stroke = active ? "var(--accent)" : "var(--muted)";

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M6.41663 2.33334H2.33329C2.02387 2.33334 1.72713 2.45626 1.50833 2.67505C1.28954 2.89384 1.16663 3.19059 1.16663 3.50001V11.6667C1.16663 11.9761 1.28954 12.2728 1.50833 12.4916C1.72713 12.7104 2.02387 12.8333 2.33329 12.8333H10.5C10.8094 12.8333 11.1061 12.7104 11.3249 12.4916C11.5437 12.2728 11.6666 11.9761 11.6666 11.6667V7.58334"
        stroke={stroke}
        strokeWidth="0.9625"
      />
      <path
        d="M10.7916 1.45832C11.0237 1.22626 11.3384 1.09589 11.6666 1.09589C11.9948 1.09589 12.3096 1.22626 12.5416 1.45832C12.7737 1.69039 12.9041 2.00513 12.9041 2.33332C12.9041 2.66151 12.7737 2.97626 12.5416 3.20832L6.99996 8.74999L4.66663 9.33332L5.24996 6.99999L10.7916 1.45832Z"
        stroke={stroke}
        strokeWidth="0.9625"
      />
    </svg>
  );
}

type TopbarIconProps = {
  className?: string;
  color?: string;
};

export function DeliveryTruck({
  className,
  color = "var(--pink)",
}: TopbarIconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M7 1.5H1.5C0.947715 1.5 0.5 1.94772 0.5 2.5V7C0.5 7.55229 0.947715 8 1.5 8H7C7.55228 8 8 7.55229 8 7V2.5C8 1.94772 7.55228 1.5 7 1.5Z"
        stroke={color}
        strokeWidth="0.920833"
      />
      <path d="M8 4H10L11.5 6.5V8H8V4Z" stroke={color} strokeWidth="0.920833" />
      <path
        d="M2.75 10.5C3.44036 10.5 4 9.94036 4 9.25C4 8.55964 3.44036 8 2.75 8C2.05964 8 1.5 8.55964 1.5 9.25C1.5 9.94036 2.05964 10.5 2.75 10.5Z"
        stroke={color}
        strokeWidth="0.920833"
      />
      <path
        d="M9.25 10.5C9.94036 10.5 10.5 9.94036 10.5 9.25C10.5 8.55964 9.94036 8 9.25 8C8.55964 8 8 8.55964 8 9.25C8 9.94036 8.55964 10.5 9.25 10.5Z"
        stroke={color}
        strokeWidth="0.920833"
      />
    </svg>
  );
}

export function Umbrella({
  className,
  color = "var(--accent)",
}: TopbarIconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 11 11"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M8.25004 8.70835C8.25004 9.07303 8.10518 9.42276 7.84731 9.68063C7.58945 9.93849 7.23971 10.0834 6.87504 10.0834C6.51037 10.0834 6.16063 9.93849 5.90277 9.68063C5.64491 9.42276 5.50004 9.07303 5.50004 8.70835V5.50002M10.5417 5.50002C10.422 4.24582 9.8391 3.08128 8.90685 2.23378C7.9746 1.38628 6.75994 0.916687 5.50004 0.916687C4.24014 0.916687 3.02548 1.38628 2.09323 2.23378C1.16099 3.08128 0.578093 4.24582 0.458374 5.50002H10.5417Z"
        stroke={color}
        strokeWidth="0.920833"
      />
    </svg>
  );
}

export function FileReport({ className, color = "#7EB0D8" }: TopbarIconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 11 11"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M6.41671 0.916687H2.75004C2.50693 0.916687 2.27377 1.01326 2.10186 1.18517C1.92995 1.35708 1.83337 1.59024 1.83337 1.83335V9.16669C1.83337 9.4098 1.92995 9.64296 2.10186 9.81487C2.27377 9.98678 2.50693 10.0834 2.75004 10.0834H8.25004C8.49316 10.0834 8.72631 9.98678 8.89822 9.81487C9.07013 9.64296 9.16671 9.4098 9.16671 9.16669V3.66669L6.41671 0.916687Z"
        stroke={color}
        strokeWidth="0.920833"
      />
      <path
        d="M6.41663 0.916687V3.66669H9.16663"
        stroke={color}
        strokeWidth="0.920833"
      />
    </svg>
  );
}

export function ShieldCheck({
  className,
  color = "var(--teal)",
}: TopbarIconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 11 11"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M5.50004 10.0834C5.50004 10.0834 9.16671 8.25002 9.16671 5.50002V2.29169L5.50004 0.916687L1.83337 2.29169V5.50002C1.83337 8.25002 5.50004 10.0834 5.50004 10.0834Z"
        stroke={color}
        strokeWidth="0.920833"
      />
    </svg>
  );
}

export function Bell({ className, color = "var(--muted)" }: TopbarIconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M3.5 4.66667C3.5 3.73841 3.86875 2.84817 4.52513 2.19179C5.1815 1.53542 6.07174 1.16667 7 1.16667C7.92826 1.16667 8.8185 1.53542 9.47487 2.19179C10.1313 2.84817 10.5 3.73841 10.5 4.66667C10.5 8.75 12.25 9.91667 12.25 9.91667H1.75C1.75 9.91667 3.5 8.75 3.5 4.66667Z"
        stroke={color}
        strokeWidth="0.991667"
      />
      <path
        d="M6.0083 12.25C6.10594 12.4276 6.24948 12.5757 6.42392 12.6789C6.59836 12.782 6.79731 12.8364 6.99997 12.8364C7.20263 12.8364 7.40157 12.782 7.57601 12.6789C7.75046 12.5757 7.89399 12.4276 7.99163 12.25"
        stroke={color}
        strokeWidth="0.991667"
      />
    </svg>
  );
}

export function UsersGroup({ className }: TopbarIconProps) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M7.08329 8.75V7.91667C7.08329 7.47464 6.9077 7.05072 6.59514 6.73816C6.28258 6.4256 5.85865 6.25 5.41663 6.25H2.08329C1.64127 6.25 1.21734 6.4256 0.904781 6.73816C0.592221 7.05072 0.416626 7.47464 0.416626 7.91667V8.75"
        strokeWidth="0.85"
      />
      <path
        d="M3.75004 4.58333C4.67052 4.58333 5.41671 3.83714 5.41671 2.91667C5.41671 1.99619 4.67052 1.25 3.75004 1.25C2.82957 1.25 2.08337 1.99619 2.08337 2.91667C2.08337 3.83714 2.82957 4.58333 3.75004 4.58333Z"
        strokeWidth="0.85"
      />
      <path
        d="M9.58329 8.75V7.91667C9.58302 7.54739 9.46011 7.18866 9.23386 6.8968C9.00762 6.60494 8.69085 6.39649 8.33329 6.30417M6.66663 1.30417C7.02513 1.39596 7.34289 1.60446 7.56981 1.8968C7.79673 2.18914 7.91989 2.54868 7.91989 2.91875C7.91989 3.28882 7.79673 3.64837 7.56981 3.94071C7.34289 4.23304 7.02513 4.44154 6.66663 4.53334"
        strokeWidth="0.85"
      />
    </svg>
  );
}

export function Car({ className }: TopbarIconProps) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M5.83341 1.25H1.25008C0.789844 1.25 0.416748 1.6231 0.416748 2.08333V5.83333C0.416748 6.29357 0.789844 6.66667 1.25008 6.66667H5.83341C6.29365 6.66667 6.66675 6.29357 6.66675 5.83333V2.08333C6.66675 1.6231 6.29365 1.25 5.83341 1.25Z"
        strokeWidth="0.85"
      />
      <path
        d="M6.66675 3.33333H8.33341L9.58341 5.41666V6.66666H6.66675V3.33333Z"
        strokeWidth="0.85"
      />
      <path
        d="M2.29167 8.75001C2.86696 8.75001 3.33333 8.28364 3.33333 7.70834C3.33333 7.13304 2.86696 6.66667 2.29167 6.66667C1.71637 6.66667 1.25 7.13304 1.25 7.70834C1.25 8.28364 1.71637 8.75001 2.29167 8.75001Z"
        strokeWidth="0.85"
      />
      <path
        d="M7.70841 8.75001C8.28371 8.75001 8.75008 8.28364 8.75008 7.70834C8.75008 7.13304 8.28371 6.66667 7.70841 6.66667C7.13312 6.66667 6.66675 7.13304 6.66675 7.70834C6.66675 8.28364 7.13312 8.75001 7.70841 8.75001Z"
        strokeWidth="0.85"
      />
    </svg>
  );
}

export function StatSunburst({ className }: TopbarIconProps) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M5 6.25C5.69036 6.25 6.25 5.69036 6.25 5C6.25 4.30964 5.69036 3.75 5 3.75C4.30964 3.75 3.75 4.30964 3.75 5C3.75 5.69036 4.30964 6.25 5 6.25Z"
        strokeWidth="0.85"
      />
      <path
        d="M5.00008 0.416672V1.25001M5.00008 8.75001V9.58334M1.75841 1.75834L2.35008 2.35001M7.65008 7.65001L8.24175 8.24167M0.416748 5.00001H1.25008M8.75008 5.00001H9.58342M1.75841 8.24167L2.35008 7.65001M7.65008 2.35001L8.24175 1.75834"
        strokeWidth="0.85"
      />
    </svg>
  );
}

export function ChartBars({ className }: TopbarIconProps) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M9.58342 2.5L5.62508 6.45833L3.54175 4.375L0.416748 7.5"
        strokeWidth="0.85"
      />
      <path d="M7.08325 2.5H9.58325V5" strokeWidth="0.85" />
    </svg>
  );
}

export function BoxIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.4248 0.425003H1.4248C0.87252 0.425003 0.424805 0.872718 0.424805 1.425V8.425C0.424805 8.97729 0.87252 9.425 1.4248 9.425H8.4248C8.97709 9.425 9.4248 8.97729 9.4248 8.425V1.425C9.4248 0.872718 8.97709 0.425003 8.4248 0.425003Z"
        stroke="#D4A847"
        strokeWidth="0.85"
      />
    </svg>
  );
}

export function ActionCheckbox({ className }: TopbarIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={className}
    >
      <path d="M4.5 5.5L6 7L11 2" stroke="var(--accent)" />
      <path
        d="M10.5 6V9.5C10.5 9.76522 10.3946 10.0196 10.2071 10.2071C10.0196 10.3946 9.76522 10.5 9.5 10.5H2.5C2.23478 10.5 1.98043 10.3946 1.79289 10.2071C1.60536 10.0196 1.5 9.76522 1.5 9.5V2.5C1.5 2.23478 1.60536 1.98043 1.79289 1.79289C1.98043 1.60536 2.23478 1.5 2.5 1.5H8"
        stroke="var(--accent)"
      />
    </svg>
  );
}

export function ActionCamera({ className }: TopbarIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M11.5 9.5C11.5 9.76522 11.3946 10.0196 11.2071 10.2071C11.0196 10.3946 10.7652 10.5 10.5 10.5H1.5C1.23478 10.5 0.98043 10.3946 0.792893 10.2071C0.605357 10.0196 0.5 9.76522 0.5 9.5V4C0.5 3.73478 0.605357 3.48043 0.792893 3.29289C0.98043 3.10536 1.23478 3 1.5 3H3.5L4.5 1.5H7.5L8.5 3H10.5C10.7652 3 11.0196 3.10536 11.2071 3.29289C11.3946 3.48043 11.5 3.73478 11.5 4V9.5Z"
        stroke="var(--accent)"
      />
      <path
        d="M6 8.5C7.10457 8.5 8 7.60457 8 6.5C8 5.39543 7.10457 4.5 6 4.5C4.89543 4.5 4 5.39543 4 6.5C4 7.60457 4.89543 8.5 6 8.5Z"
        stroke="var(--accent)"
      />
    </svg>
  );
}

export function ActionMessage({ className }: TopbarIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M10.5 7.5C10.5 7.76522 10.3946 8.01957 10.2071 8.20711C10.0196 8.39464 9.76522 8.5 9.5 8.5H3.5L1.5 10.5V2.5C1.5 2.23478 1.60536 1.98043 1.79289 1.79289C1.98043 1.60536 2.23478 1.5 2.5 1.5H9.5C9.5 1.76522 9.60536 2.01957 9.79289 2.20711C9.98043 2.39464 10.2348 2.5 10.5 2.5V7.5Z"
        stroke="var(--accent)"
      />
    </svg>
  );
}

export function ChevronRight({ className }: TopbarIconProps) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={className}
    >
      <g opacity="0.4">
        <path d="M2.5 6H9.5" stroke="var(--accent)" />
        <path d="M6 2.5L9.5 6L6 9.5" stroke="var(--accent)" />
      </g>
    </svg>
  );
}

export function Crown({ className, color = "#C9A84C" }: TopbarIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <path d="M2.5 11.5H13.5V12.5H2.5V11.5Z" stroke={color} strokeWidth="1" />
      <path
        d="M3.5 11.5L4.5 5.5L8 8.5L11.5 5.5L12.5 11.5"
        stroke={color}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Spray({ className, color = "#C9A84C" }: TopbarIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <path d="M5 3H8V5H5V3Z" stroke={color} strokeWidth="1" />
      <path d="M6.5 5V9" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <path d="M4 9H9V12H4V9Z" stroke={color} strokeWidth="1" />
      <path
        d="M10 6L12 4M11 8L13.5 7.5M10 10L12.5 11"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PackageBox({ className, color = "#C9A84C" }: TopbarIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M2.5 5.5L8 2.5L13.5 5.5V10.5L8 13.5L2.5 10.5V5.5Z"
        stroke={color}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d="M8 8L13.5 5.5M8 8V13.5M8 8L2.5 5.5"
        stroke={color}
        strokeWidth="1"
      />
    </svg>
  );
}

export function Workshop() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.43219 8.20114C8.42734 8.24166 8.41954 8.28227 8.40866 8.32277L8.40841 8.32269C8.40638 8.33015 8.40243 8.34302 8.39663 8.36119C8.35134 8.50313 8.27282 8.6264 8.17172 8.72614C8.48095 8.76615 8.83573 8.72532 9.30427 8.50477L11.0976 7.5389C11.0901 7.50632 11.0765 7.47405 11.0563 7.44336C11.0092 7.37187 10.9359 7.32791 10.852 7.30913C10.7457 7.2853 10.6225 7.29962 10.5058 7.34769L10.5054 7.34682L8.43222 8.20111L8.43219 8.20114ZM2.71616 7.91571L4.45076 7.03463C4.52831 6.99525 4.60702 6.97192 4.6864 6.96427C4.76665 6.95653 4.85132 6.96495 4.93975 6.98919L7.61033 7.72048C7.62769 7.72524 7.63045 7.7257 7.63286 7.72647C7.74188 7.76188 7.8269 7.83181 7.87701 7.91784C7.92378 7.99815 7.93965 8.0938 7.91444 8.18753V8.18854L7.9104 8.20373C7.87782 8.30583 7.80014 8.38737 7.70122 8.43719C7.59833 8.489 7.4749 8.50605 7.3544 8.47741C7.34704 8.47506 7.33961 8.47307 7.33217 8.47143L5.97145 8.11101C5.83497 8.07478 5.69523 8.15703 5.65932 8.29471C5.6234 8.43241 5.70493 8.57338 5.84138 8.60962L7.19883 8.96916C7.26432 8.99351 7.2884 9.00264 7.31266 9.01184C7.91679 9.24112 8.48961 9.4585 9.52594 8.96845L9.53793 8.96238L11.4564 7.92912C11.4674 7.92415 11.478 7.91841 11.4882 7.91196L11.927 7.67561C12.0184 7.62643 12.1242 7.61656 12.2211 7.64031C12.314 7.66307 12.3964 7.71663 12.4459 7.79541L12.4516 7.80438C12.4912 7.87245 12.4979 7.9485 12.4774 8.01868C12.4547 8.09631 12.3999 8.16854 12.3194 8.21994L12.3066 8.22811L8.35121 10.5733C8.2677 10.6228 8.17898 10.6532 8.08735 10.6642C7.99531 10.6753 7.90011 10.6666 7.80404 10.638L6.66745 10.2993C6.63809 10.2906 6.62308 10.2857 6.55464 10.265C6.00514 10.0988 5.66395 9.99556 5.10871 10.3147L4.398 10.7232L2.71616 7.91563V7.91571ZM2.6488 12.8752L0.0367623 8.51477C-0.0361774 8.3927 0.0027978 8.23407 0.123786 8.16047L1.91128 7.07049C2.03227 6.99689 2.1895 7.03622 2.26244 7.15829L2.45108 7.47318L4.22068 6.57434C4.35505 6.50608 4.49461 6.46533 4.63838 6.45148C4.78312 6.43754 4.92857 6.45074 5.07382 6.49053L7.7444 7.22182C7.74968 7.22327 7.76447 7.22794 7.78895 7.2359C8.02134 7.31137 8.20546 7.46558 8.31722 7.65739C8.32277 7.66692 8.32813 7.67654 8.33333 7.68624L10.3137 6.87021V6.8692C10.5227 6.78306 10.7533 6.75964 10.9621 6.8064C11.1709 6.85318 11.357 6.96826 11.4824 7.15867C11.511 7.20196 11.5348 7.24691 11.5541 7.29298L11.6869 7.22141C11.8929 7.11049 12.1281 7.08743 12.3412 7.13968C12.5582 7.19288 12.7546 7.32424 12.878 7.52089C12.8804 7.52466 12.8849 7.53223 12.8918 7.54398C13.007 7.7418 13.0267 7.96175 12.9676 8.16405C12.9107 8.35884 12.78 8.53562 12.5915 8.65602C12.5867 8.65914 12.5778 8.66449 12.5647 8.67228L8.60933 11.0175C8.46261 11.1045 8.30728 11.1578 8.14739 11.177C7.98792 11.1962 7.82411 11.1815 7.66 11.1326L6.4086 10.7596C5.98737 10.6322 5.72584 10.5531 5.36084 10.7629L4.6623 11.1644L4.87451 11.5186C4.94745 11.6407 4.90847 11.7993 4.78748 11.8729L2.99999 12.9629C2.879 13.0365 2.72177 12.9972 2.64883 12.8751L2.6488 12.8752ZM0.607116 8.46891L2.95451 12.3875L4.30413 11.5645L1.95676 7.64594L0.607116 8.46891ZM8.84391 0.516807H8.21727L8.07556 0.962727L8.07535 0.962646C8.04978 1.04271 7.98591 1.10854 7.89949 1.13229C7.8032 1.1588 7.7081 1.19178 7.61474 1.23083C7.52523 1.26827 7.43558 1.31292 7.34633 1.36441L7.34614 1.36408C7.27353 1.40589 7.18206 1.41097 7.10221 1.36946L6.68958 1.1553L6.24674 1.60207L6.45239 2.00541C6.49741 2.08264 6.50125 2.18137 6.45402 2.26469C6.40299 2.35476 6.35868 2.44527 6.32157 2.53561C6.2843 2.62634 6.25261 2.71867 6.22686 2.81216C6.20749 2.89799 6.14498 2.97158 6.05587 3.00044L5.6139 3.14342V3.77565L6.05587 3.91863L6.05579 3.91884C6.13515 3.94464 6.2004 4.00908 6.22393 4.09628C6.2502 4.19343 6.2829 4.28937 6.32157 4.38357C6.35865 4.47388 6.40296 4.56433 6.45399 4.6544L6.45367 4.65459C6.49511 4.72786 6.50014 4.82014 6.459 4.9007L6.24671 5.31703L6.68955 5.76382L7.08932 5.55633C7.16586 5.51091 7.26369 5.50703 7.3463 5.55469C7.43558 5.60617 7.52528 5.65088 7.61485 5.68832C7.70477 5.72589 7.79629 5.75789 7.88895 5.78388C7.97402 5.80342 8.04696 5.86649 8.07556 5.95639L8.21727 6.40232H8.84391L8.98562 5.95639L8.98584 5.95648C9.0114 5.87641 9.07527 5.81058 9.1617 5.78683C9.25798 5.76032 9.35305 5.72734 9.44644 5.68832C9.53596 5.65088 9.62564 5.6062 9.71488 5.55472L9.71507 5.55504C9.78768 5.51323 9.87915 5.50815 9.959 5.54966L10.3716 5.76382L10.8144 5.31705L10.6088 4.91371C10.5638 4.83648 10.5599 4.73778 10.6072 4.65443C10.6582 4.56436 10.7025 4.47385 10.7396 4.38351C10.7769 4.29276 10.8086 4.20042 10.8343 4.10696C10.8537 4.02113 10.9162 3.94754 11.0053 3.91868L11.4473 3.77571V3.14347L11.0053 3.0005L11.0054 3.00028C10.926 2.97448 10.8608 2.91004 10.8373 2.82284C10.811 2.7257 10.7783 2.62975 10.7396 2.53556C10.7025 2.44524 10.6582 2.35476 10.6072 2.26472L10.6075 2.26453C10.5661 2.19126 10.561 2.09898 10.6022 2.01842L10.8144 1.6021L10.3716 1.15533L9.97183 1.36282C9.89529 1.40824 9.79746 1.41212 9.71485 1.36446C9.62943 1.31519 9.54362 1.27215 9.45793 1.23572C9.4537 1.23419 9.44947 1.23258 9.4453 1.23083C9.35419 1.19274 9.26299 1.16074 9.17218 1.13527C9.08713 1.1157 9.01419 1.05263 8.98559 0.962782L8.84388 0.516861L8.84391 0.516807ZM8.03128 0V0.000765151C7.92329 0.000737824 7.82294 0.0703668 7.78817 0.179674L7.63032 0.676423C7.5587 0.699897 7.4888 0.72594 7.42068 0.754442C7.35007 0.783955 7.2819 0.81549 7.21632 0.848966L6.77302 0.618873C6.67449 0.558453 6.54427 0.571187 6.45908 0.657103L5.75293 1.36954L5.7533 1.36993C5.67682 1.44707 5.65469 1.56813 5.70691 1.67033L5.94309 2.13352C5.90991 2.19974 5.87863 2.26854 5.84937 2.33981C5.82118 2.40851 5.79537 2.47902 5.7721 2.55124L5.29969 2.70405C5.18623 2.73062 5.1017 2.83323 5.1017 2.95576V3.96333H5.10245C5.10245 4.07229 5.17144 4.17353 5.27978 4.20862L5.77213 4.36788C5.79539 4.44013 5.82121 4.51066 5.84943 4.57939C5.87868 4.65063 5.90996 4.71941 5.94312 4.7856L5.71506 5.23286C5.65518 5.33227 5.6678 5.46366 5.75295 5.54961L6.45911 6.26207L6.45949 6.26169C6.53595 6.33886 6.65594 6.36119 6.75723 6.3085L7.21635 6.07021C7.28198 6.10369 7.35018 6.13525 7.42081 6.16479C7.48888 6.19324 7.55878 6.21928 7.63034 6.24275L7.7818 6.71939C7.80813 6.83386 7.90983 6.91915 8.03128 6.91915H9.02993V6.91838C9.13792 6.91841 9.23827 6.84878 9.27304 6.73947L9.43089 6.24273C9.50251 6.21925 9.57241 6.19321 9.64053 6.16473C9.71114 6.13522 9.77931 6.10366 9.84491 6.07021L10.2882 6.3003C10.3867 6.36072 10.517 6.34799 10.6022 6.26207L11.3083 5.54963L11.3079 5.54925C11.3844 5.47211 11.4065 5.35105 11.3543 5.24885L11.1181 4.78563C11.1513 4.71941 11.1826 4.65063 11.2118 4.57934C11.2401 4.51064 11.2658 4.44013 11.2891 4.36791L11.7615 4.2151C11.875 4.18853 11.9595 4.08592 11.9595 3.96339V2.95582H11.9588C11.9588 2.84686 11.8898 2.74565 11.7814 2.71053L11.2891 2.55127C11.2658 2.47902 11.24 2.40849 11.2118 2.33976C11.1825 2.26852 11.1512 2.19974 11.1181 2.13355L11.3462 1.68629C11.406 1.58687 11.3934 1.45549 11.3083 1.36954L10.6021 0.657103L10.6017 0.657486C10.5253 0.580315 10.4053 0.557988 10.304 0.610675L9.84489 0.848966C9.78365 0.817731 9.72019 0.788163 9.65456 0.760344C9.65026 0.75824 9.64589 0.756245 9.64143 0.754387C9.57366 0.726049 9.5034 0.699979 9.43084 0.676287L9.27944 0.199787C9.25311 0.0853146 9.1514 2.73119e-05 9.02996 2.73119e-05H8.03131L8.03128 0ZM9.26876 2.71479C9.45765 2.90537 9.5745 3.16869 9.5745 3.45956C9.5745 3.75043 9.45765 4.01375 9.26876 4.20433C9.07987 4.39491 8.81888 4.5128 8.53059 4.5128C8.2423 4.5128 7.98131 4.39491 7.79242 4.20433C7.60353 4.01375 7.48668 3.75043 7.48668 3.45956C7.48668 3.16869 7.60353 2.90537 7.79242 2.71479C7.98131 2.52422 8.2423 2.40633 8.53059 2.40633C8.81888 2.40633 9.07987 2.52422 9.26876 2.71479ZM8.53059 1.88952C8.96027 1.88952 9.34929 2.06526 9.63092 2.3494C9.91252 2.63355 10.0867 3.02605 10.0867 3.45956C10.0867 3.89308 9.91255 4.2856 9.63092 4.56972C9.34929 4.85386 8.96027 5.0296 8.53059 5.0296C8.10092 5.0296 7.7119 4.85386 7.43027 4.56972C7.14867 4.2856 6.97445 3.89308 6.97445 3.45956C6.97445 3.02605 7.14864 2.63355 7.43027 2.3494C7.7119 2.06529 8.10092 1.88952 8.53059 1.88952Z"
        fill="#C9A84C"
      />
    </svg>
  );
}

export function AlertTriangle({
  className,
  color = "#C9A84C",
}: TopbarIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M8 2.5L14 13.5H2L8 2.5Z"
        stroke={color}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d="M8 6.5V9.5"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11.5" r="0.6" fill={color} />
    </svg>
  );
}

export function StarSparkle({ className, color = "#C9A84C" }: TopbarIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M8 2.5L9 6L12.5 7L9 8L8 11.5L7 8L3.5 7L7 6L8 2.5Z"
        stroke={color}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Thermometer({ className, color = "#C9A84C" }: TopbarIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M8.5 2.5V9.5C9.6 10 10.5 11.1 10.5 12.5C10.5 14 9.3 15.2 7.8 15.2C6.3 15.2 5.1 14 5.1 12.5C5.1 11.1 6 10 7.1 9.5V2.5"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="7.8" cy="12.5" r="1.2" stroke={color} strokeWidth="1" />
    </svg>
  );
}

export function ClockSmall({
  className,
  color = "var(--pink)",
}: TopbarIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <circle cx="8" cy="8" r="5.5" stroke={color} strokeWidth="1" />
      <path
        d="M8 5V8L10 9.5"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DownloadArrow({
  className,
  color = "#C9A84C",
}: TopbarIconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M7 2.5V9.2"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M4.5 6.7L7 9.2L9.5 6.7"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.8 11.5H11.2"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function VehicleKey({
  className,
  color = "var(--primary)",
}: TopbarIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <circle cx="5.5" cy="5.5" r="2.5" stroke={color} strokeWidth="0.9" />
      <path
        d="M7.5 7.5L13 13"
        stroke={color}
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <path
        d="M10.5 10.5L13 8"
        stroke={color}
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <path
        d="M11.5 11.5L13 13"
        stroke={color}
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function VehicleClock({
  className,
  color = "var(--dark)",
}: TopbarIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M8 2.5V13.5M10.5 4.5C10.5 3.4 9.4 2.5 8 2.5C6.6 2.5 5.5 3.4 5.5 4.5C5.5 5.6 6.6 6.5 8 6.5C9.4 6.5 10.5 7.4 10.5 8.5C10.5 9.6 9.4 10.5 8 10.5C6.6 10.5 5.5 9.6 5.5 8.5"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function VehicleFleetCar({ className }: TopbarIconProps) {
  return (
    <svg
      width="13"
      height="7"
      viewBox="0 0 13 7"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M5.12516 0L7.22438 0.00206017C7.73793 0.017643 8.18938 0.349847 8.53817 0.687333L10.047 2.13944C10.0658 2.15946 10.0783 2.15264 10.1061 2.1537L11.3031 2.15626C12.1948 2.19725 12.911 2.98386 12.9913 3.8303C13.0068 3.99363 12.9969 4.16525 12.9968 4.3294L12.9985 5.4035C12.9985 5.81489 12.6937 5.83388 12.3876 5.83427L11.8105 5.83277C11.7855 5.84668 11.7767 5.9068 11.7663 5.93361C11.2409 7.28841 9.37788 7.37528 8.71698 6.06228C8.57918 5.78853 8.7163 5.83543 8.33496 5.83469L7.86979 5.83446L4.67154 5.84333C4.48484 6.44535 3.90354 6.929 3.26379 6.98484L2.89142 6.98716C2.17463 6.94031 1.73524 6.45349 1.50216 5.83763C1.40314 5.82859 1.29959 5.83477 1.20003 5.83477H0.656019C0.562964 5.83472 0.403956 5.85519 0.319245 5.8166C0.182382 5.7543 0.0383269 5.63608 0.0212291 5.47861L0.0202874 5.46728C-0.00744188 5.15745 -0.00502547 4.55646 0.017123 4.23918C0.0874271 3.23192 0.818359 2.4377 1.80644 2.20185L2.01671 2.15724C2.14748 2.13201 2.17232 2.08556 2.26125 1.99293L3.20752 1.01917C3.84318 0.364294 4.16415 0.00678775 5.12516 0ZM2.1432 3.01529C1.52936 3.07387 1.01425 3.57646 0.907157 4.16562C0.885765 4.28328 0.890555 4.40821 0.890286 4.52727L0.892008 4.99106L1.51876 4.99315C1.53375 4.95902 1.53806 4.92445 1.54949 4.88953C1.82636 4.04592 2.90827 3.61716 3.71935 3.96326C4.15196 4.14787 4.50976 4.52891 4.62493 4.98105C4.66196 4.9933 4.71324 4.9913 4.75245 4.99172L8.62309 4.99267C8.65229 4.9548 8.65248 4.91436 8.66975 4.87208C8.86917 4.38373 9.27611 4.04579 9.78568 3.89107C10.4494 3.73282 11.0858 3.94519 11.5136 4.4805C11.6112 4.6026 11.7221 4.77987 11.7498 4.93319C11.7722 5.05698 11.9774 4.97389 12.1269 5.00125L12.1268 4.36154C12.1266 4.21374 12.134 4.05974 12.1198 3.9126C12.0795 3.49865 11.7323 3.07514 11.2997 3.01514C11.2144 3.0033 11.1201 3.01078 11.0336 3.01062L2.1432 3.01529ZM5.09427 0.853012L4.79271 0.885208C4.70724 0.90087 4.62146 0.931401 4.54375 0.96909L4.53371 0.973686C4.34678 1.06079 4.21215 1.21643 4.07371 1.36212L3.45503 2.00442C3.40608 2.05297 3.36203 2.10658 3.31332 2.15391L7.04361 2.15489L8.59974 2.15478C8.66862 2.15449 8.73987 2.15798 8.80822 2.15103L8.80193 2.14649C8.74074 2.10143 8.67651 2.01985 8.62056 1.96496L7.93356 1.30021C7.70497 1.07685 7.48825 0.902349 7.15291 0.866139L5.09427 0.853012ZM10.0997 4.70817C9.79733 4.73711 9.51705 5.00389 9.46931 5.29809L9.46695 5.31206C9.4282 5.55856 9.52913 5.80596 9.7219 5.96533L9.7321 5.97386C9.8624 6.08175 10.0624 6.15816 10.2352 6.14223L10.2873 6.13639C10.5265 6.10528 10.7529 5.97946 10.864 5.76441L10.8703 5.75248C11.1386 5.23217 10.687 4.64119 10.0997 4.70817ZM3.05942 4.70782C2.72787 4.72208 2.42636 4.94077 2.35723 5.26508L2.35492 5.27554C2.27498 5.64725 2.53459 6.06202 2.92323 6.12879L3.01596 6.14025C3.04472 6.14585 3.07524 6.14345 3.10441 6.1426C3.54923 6.08795 3.87518 5.76423 3.80616 5.3095L3.79313 5.25684C3.7293 5.03366 3.59393 4.85348 3.37312 4.7612L3.25622 4.7237C3.19323 4.70642 3.12451 4.70542 3.05942 4.70782Z"
        className="fill-[#C9A84C] transition-colors group-hover:fill-[#0A0806]"
      />
    </svg>
  );
}

export function VehicleFleetReady({
  className,
  color = "#D4A847",
}: TopbarIconProps) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={className}
    >
      <g clipPath="url(#vehicle-fleet-ready-clip)">
        <path
          d="M11 5.53999V5.99999C10.9994 7.0782 10.6503 8.12733 10.0047 8.99091C9.35908 9.85448 8.45164 10.4862 7.41768 10.7919C6.38372 11.0977 5.27863 11.0609 4.26724 10.6873C3.25584 10.3136 2.39233 9.62304 1.80548 8.71853C1.21863 7.81401 0.939896 6.74403 1.01084 5.66815C1.08178 4.59228 1.4986 3.56816 2.19914 2.74853C2.89968 1.9289 3.84639 1.35768 4.89809 1.12007C5.9498 0.882448 7.05013 0.991162 8.035 1.42999"
          stroke={color}
          strokeWidth="0.85"
        />
        <path
          d="M11 2L6 7.005L4.5 5.505"
          stroke={color}
          strokeWidth="0.85"
        />
      </g>
      <defs>
        <clipPath id="vehicle-fleet-ready-clip">
          <rect width="12" height="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function VehicleFleetInService({
  className,
  color = "#D4A847",
}: TopbarIconProps) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={className}
    >
      <g clipPath="url(#vehicle-fleet-service-clip)">
        <path
          d="M7.35017 3.15001C7.25856 3.24347 7.20724 3.36913 7.20724 3.50001C7.20724 3.63088 7.25856 3.75654 7.35017 3.85001L8.15017 4.65001C8.24364 4.74162 8.3693 4.79293 8.50017 4.79293C8.63105 4.79293 8.75671 4.74162 8.85017 4.65001L10.7352 2.76501C10.9866 3.3206 11.0627 3.93962 10.9534 4.53958C10.8441 5.13953 10.5545 5.69193 10.1233 6.12314C9.69209 6.55436 9.1397 6.84392 8.53974 6.95323C7.93979 7.06255 7.32077 6.98642 6.76517 6.73501L3.31017 10.19C3.11126 10.3889 2.84148 10.5007 2.56017 10.5007C2.27887 10.5007 2.00908 10.3889 1.81017 10.19C1.61126 9.99109 1.49951 9.72131 1.49951 9.44C1.49951 9.1587 1.61126 8.88892 1.81017 8.69L5.26517 5.23501C5.01375 4.67941 4.93763 4.06039 5.04694 3.46043C5.15626 2.86048 5.44582 2.30808 5.87703 1.87687C6.30825 1.44565 6.86064 1.15609 7.4606 1.04678C8.06055 0.937463 8.67958 1.01359 9.23517 1.26501L7.35517 3.14501L7.35017 3.15001Z"
          stroke={color}
          strokeWidth="0.85"
        />
      </g>
      <defs>
        <clipPath id="vehicle-fleet-service-clip">
          <rect width="12" height="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function VehicleFleetOverdue({
  className,
  color = "#D4A847",
}: TopbarIconProps) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z"
        stroke={color}
        strokeWidth="0.85"
      />
      <path d="M6 4V6" stroke={color} strokeWidth="0.85" />
      <path d="M6 8H6.005" stroke={color} strokeWidth="0.85" />
    </svg>
  );
}

export function ConfirmationPendingClock({
  className,
  color = "#D4A847",
}: TopbarIconProps) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={className}
    >
      <g clipPath="url(#confirmation-pending-clock-clip)">
        <path
          d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z"
          stroke={color}
          strokeWidth="0.85"
        />
        <path d="M6 3V6L8 7" stroke={color} strokeWidth="0.85" />
      </g>
      <defs>
        <clipPath id="confirmation-pending-clock-clip">
          <rect width="12" height="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function ConfirmationSignOffEdit({
  className,
  color = "#D4A847",
}: TopbarIconProps) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={className}
    >
      <g clipPath="url(#confirmation-signoff-edit-clip)">
        <path
          d="M8.5 1.5C8.63132 1.36868 8.78722 1.26451 8.9588 1.19344C9.13038 1.12236 9.31428 1.08578 9.5 1.08578C9.68572 1.08578 9.86962 1.12236 10.0412 1.19344C10.2128 1.26451 10.3687 1.36868 10.5 1.5C10.6313 1.63132 10.7355 1.78722 10.8066 1.9588C10.8776 2.13038 10.9142 2.31428 10.9142 2.5C10.9142 2.68572 10.8776 2.86961 10.8066 3.04119C10.7355 3.21277 10.6313 3.36868 10.5 3.5L3.75 10.25L1 11L1.75 8.25L8.5 1.5Z"
          stroke={color}
          strokeWidth="0.85"
        />
      </g>
      <defs>
        <clipPath id="confirmation-signoff-edit-clip">
          <rect width="12" height="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function ConfirmationShiftProgress({
  className,
  color = "#0A0806",
}: TopbarIconProps) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={className}
    >
      <path d="M1.5 1.5V10.5H10.5" stroke={color} strokeWidth="0.85" />
      <path
        d="M3.5 6L5 4.5L7 6.5L9.5 4"
        stroke={color}
        strokeWidth="0.85"
      />
    </svg>
  );
}

export function ClockIcon({
  className,
  color = "var(--dark)",
}: TopbarIconProps) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.0012 6.25107C12.0012 7.0062 11.8525 7.75394 11.5635 8.45159C11.2745 9.14924 10.851 9.78315 10.317 10.3171C9.78305 10.8511 9.14915 11.2746 8.4515 11.5636C7.75385 11.8526 7.00611 12.0013 6.25098 12.0013C4.72592 12.0013 3.26332 11.3955 2.18494 10.3171C1.10657 9.23872 0.500732 7.77613 0.500732 6.25107C0.500732 4.72601 1.10657 3.26341 2.18494 2.18503C3.26332 1.10665 4.72592 0.500825 6.25098 0.500824C7.00611 0.500824 7.75385 0.649558 8.4515 0.938535C9.14915 1.22751 9.78305 1.65107 10.317 2.18503C10.851 2.71899 11.2745 3.35289 11.5635 4.05054C11.8525 4.7482 12.0012 5.49594 12.0012 6.25107Z"
        stroke="#E89999"
        strokeWidth="1.00165"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.64168 3.28905V5.62773C6.64168 6.28356 6.26 6.69337 5.64398 6.93527L3.979 7.52965"
        stroke="#E89999"
        strokeWidth="1.00165"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VehicleFlag({
  className,
  color = "var(--pink)",
}: TopbarIconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M2.5 2V12.5"
        stroke={color}
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <path
        d="M2.5 2.5H9.5L7.5 5L9.5 7.5H2.5"
        stroke={color}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VehicleHistory({
  className,
  color = "var(--primary)",
}: TopbarIconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M2 7C2 4.23858 4.23858 2 7 2C9.76142 2 12 4.23858 12 7C12 9.76142 9.76142 12 7 12"
        stroke={color}
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <path
        d="M2 4.5V7H4.5"
        stroke={color}
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 5V7.5L8.5 8.5"
        stroke={color}
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function VehicleCalendar({
  className,
  color = "var(--primary)",
}: TopbarIconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <rect
        x="2"
        y="3"
        width="10"
        height="9"
        rx="1"
        stroke={color}
        strokeWidth="0.9"
      />
      <path d="M2 6H12" stroke={color} strokeWidth="0.9" />
      <path
        d="M5 1.5V4"
        stroke={color}
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <path
        d="M9 1.5V4"
        stroke={color}
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function RightArrow({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M8.11699 6L4.38366 9.73333L5.33366 10.6667L10.667 5.33333L5.33366 0L4.38366 0.933333L8.11699 4.66667H0.000325203V6H8.11699Z"
        fill={color}
      />
    </svg>
  );
}


export function VehicleSend({
  className,
  color = "var(--dark)",
}: TopbarIconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M12.5 1.5L6.5 7.5"
        stroke={color}
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <path
        d="M12.5 1.5L8.5 12.5L6.5 7.5L1.5 5.5L12.5 1.5Z"
        stroke={color}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlusSmall({
  className,
  color = "var(--dark)",
}: TopbarIconProps) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M6 2V10"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M2 6H10"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function VehicleCarOutline({
  className,
  color = "var(--primary)",
}: TopbarIconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M3.5 11H4.8L5.8 8.5H12.2L13.2 11H14.5"
        stroke={color}
        strokeWidth="0.95"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 11H15.5V13.5C15.5 14 15 14.5 14.5 14.5H3.5C3 14.5 2.5 14 2.5 13.5V11Z"
        stroke={color}
        strokeWidth="0.95"
      />
      <circle cx="5.5" cy="14" r="0.9" fill={color} />
      <circle cx="12.5" cy="14" r="0.9" fill={color} />
      <path d="M6.5 11V9H11.5V11" stroke={color} strokeWidth="0.95" />
    </svg>
  );
}

export function VehicleListCarIcon({
  className,
  color = "#C9A84C",
}: TopbarIconProps) {
  return (
    <svg
      viewBox="0 0 15 8"
      fill="none"
      aria-hidden
      className={className ?? "h-[10px] w-[19px]"}
    >
      <path
        d="M5.91365 0L8.33583 0.00235448C8.92838 0.0201634 9.44928 0.399825 9.85173 0.785523L11.5926 2.44507C11.6144 2.46795 11.6288 2.46016 11.6609 2.46137L13.042 2.4643C14.071 2.51114 14.8973 3.41013 14.99 4.37749C15.0078 4.56415 14.9964 4.76029 14.9964 4.94788L14.9982 6.17543C14.9982 6.64558 14.6465 6.66729 14.2934 6.66774L13.6275 6.66602C13.5987 6.68193 13.5885 6.75063 13.5765 6.78126C12.9703 8.32961 10.8206 8.42889 10.058 6.92832C9.89905 6.61546 10.0573 6.66907 9.61726 6.66822L9.08052 6.66795L5.39023 6.67809C5.17482 7.36612 4.50408 7.91886 3.76591 7.98267L3.33626 7.98532C2.50919 7.93178 2.0022 7.37542 1.73326 6.67157C1.619 6.66125 1.49953 6.66831 1.38465 6.66831H0.756945C0.649574 6.66825 0.466103 6.69165 0.368359 6.64755C0.210441 6.57634 0.0442233 6.44123 0.0244952 6.26127L0.0234086 6.24832C-0.00858678 5.89423 -0.00579862 5.20738 0.0197573 4.84477C0.100877 3.69362 0.94426 2.78594 2.08436 2.5164L2.32697 2.46541C2.47786 2.43659 2.50652 2.38349 2.60914 2.27764L3.70098 1.16476C4.43444 0.416336 4.80479 0.00775743 5.91365 0ZM2.47293 3.44605C1.76465 3.513 1.17029 4.08738 1.04672 4.76071C1.02204 4.89518 1.02756 5.03795 1.02725 5.17403L1.02924 5.70407L1.75242 5.70645C1.76971 5.66745 1.77468 5.62794 1.78788 5.58804C2.10733 4.62391 3.3557 4.1339 4.29156 4.52943C4.79072 4.74042 5.20357 5.1759 5.33646 5.69263C5.37918 5.70663 5.43836 5.70434 5.4836 5.70482L9.94972 5.70591C9.98341 5.66262 9.98363 5.61641 10.0036 5.56809C10.2337 5.00997 10.7032 4.62376 11.2912 4.44694C12.057 4.26607 12.7913 4.50879 13.2849 5.12057C13.3976 5.26011 13.5255 5.46271 13.5575 5.63793C13.5833 5.77941 13.8201 5.68445 13.9926 5.71572L13.9925 4.98462C13.9923 4.81571 14.0008 4.6397 13.9843 4.47154C13.9379 3.99846 13.5373 3.51445 13.0382 3.44587C12.9397 3.43235 12.8309 3.44089 12.731 3.44071L2.47293 3.44605ZM5.878 0.974871L5.53005 1.01167C5.43144 1.02957 5.33245 1.06446 5.24279 1.10753L5.2312 1.11278C5.01551 1.21233 4.86018 1.39021 4.70043 1.55671L3.98657 2.29077C3.93009 2.34625 3.87926 2.40752 3.82307 2.46161L8.12724 2.46273L9.92277 2.46261C10.0023 2.46228 10.0845 2.46626 10.1633 2.45832L10.1561 2.45313C10.0855 2.40163 10.0114 2.30839 9.9468 2.24567L9.15411 1.48596C8.89035 1.23068 8.64029 1.03126 8.25336 0.989873L5.878 0.974871ZM11.6535 5.38076C11.3046 5.41384 10.9812 5.71874 10.9261 6.05496L10.9234 6.07093C10.8787 6.35264 10.9952 6.63538 11.2176 6.81751L11.2294 6.82726C11.3797 6.95057 11.6105 7.03789 11.8098 7.01969L11.87 7.01302C12.1459 6.97746 12.4072 6.83366 12.5354 6.5879L12.5426 6.57426C12.8523 5.97962 12.3312 5.30421 11.6535 5.38076ZM3.53009 5.38037C3.14755 5.39667 2.79965 5.6466 2.71989 6.01723L2.71722 6.02918C2.62497 6.454 2.92453 6.92802 3.37296 7.00433L3.47995 7.01743C3.51314 7.02383 3.54835 7.02108 3.58201 7.02011C4.09527 6.95766 4.47136 6.58769 4.39172 6.068L4.37669 6.00781C4.30304 5.75275 4.14684 5.54684 3.89206 5.44137L3.75718 5.39851C3.6845 5.37877 3.6052 5.37762 3.53009 5.38037Z"
        fill={color}
      />
    </svg>
  );
}

export function Members({
  active,
  inverted,
  stroke: strokeOverride,
  className,
}: SvgIconProps) {
  const stroke = getNavStroke(active, inverted, strokeOverride);

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M9.33337 12.25V11.0833C9.33337 10.4645 9.08754 9.871 8.64996 9.43342C8.21237 8.99583 7.61887 8.75 7.00004 8.75H3.50004C2.88121 8.75 2.28771 8.99583 1.85012 9.43342C1.41254 9.871 1.16671 10.4645 1.16671 11.0833V12.25"
        stroke={stroke}
        strokeWidth="0.9625"
      />
      <path
        d="M5.25004 6.41667C6.53871 6.41667 7.58337 5.372 7.58337 4.08333C7.58337 2.79467 6.53871 1.75 5.25004 1.75C3.96137 1.75 2.91671 2.79467 2.91671 4.08333C2.91671 5.372 3.96137 6.41667 5.25004 6.41667Z"
        stroke={stroke}
        strokeWidth="0.9625"
      />
      <path
        d="M12.8334 12.25V11.0833C12.8334 10.5233 12.6104 9.98583 12.2145 9.58996C11.8187 9.19408 11.2812 8.97104 10.7212 8.97104"
        stroke={stroke}
        strokeWidth="0.9625"
        strokeLinecap="round"
      />
      <path
        d="M8.75004 1.84604C9.72004 2.10854 10.4412 2.98354 10.4412 4.02421C10.4412 5.06488 9.72004 5.93988 8.75004 6.20238"
        stroke={stroke}
        strokeWidth="0.9625"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function NavCar({
  active,
  inverted,
  stroke: strokeOverride,
  className,
}: SvgIconProps) {
  const stroke = getNavStroke(active, inverted, strokeOverride);

  return (
    <svg
      width="15"
      height="8"
      viewBox="0 0 15 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.91365 0L8.33583 0.00235448C8.92838 0.0201634 9.44928 0.399825 9.85173 0.785523L11.5926 2.44507C11.6144 2.46795 11.6288 2.46016 11.6609 2.46137L13.042 2.4643C14.071 2.51114 14.8973 3.41013 14.99 4.37749C15.0078 4.56415 14.9964 4.76029 14.9964 4.94788L14.9982 6.17543C14.9982 6.64558 14.6465 6.66729 14.2934 6.66774L13.6275 6.66602C13.5987 6.68193 13.5885 6.75063 13.5765 6.78126C12.9703 8.32961 10.8206 8.42889 10.058 6.92832C9.89905 6.61546 10.0573 6.66907 9.61726 6.66822L9.08052 6.66795L5.39023 6.67809C5.17482 7.36612 4.50408 7.91886 3.76591 7.98267L3.33626 7.98532C2.50919 7.93178 2.0022 7.37542 1.73326 6.67157C1.619 6.66125 1.49953 6.66831 1.38465 6.66831H0.756945C0.649574 6.66825 0.466103 6.69165 0.368359 6.64755C0.210441 6.57634 0.0442233 6.44123 0.0244952 6.26127L0.0234086 6.24832C-0.00858678 5.89423 -0.00579862 5.20738 0.0197573 4.84477C0.100877 3.69362 0.94426 2.78594 2.08436 2.5164L2.32697 2.46541C2.47786 2.43659 2.50652 2.38349 2.60914 2.27764L3.70098 1.16476C4.43444 0.416336 4.80479 0.00775743 5.91365 0ZM2.47293 3.44605C1.76465 3.513 1.17029 4.08738 1.04672 4.76071C1.02204 4.89518 1.02756 5.03795 1.02725 5.17403L1.02924 5.70407L1.75242 5.70645C1.76971 5.66745 1.77468 5.62794 1.78788 5.58804C2.10733 4.62391 3.3557 4.1339 4.29156 4.52943C4.79072 4.74042 5.20357 5.1759 5.33646 5.69263C5.37918 5.70663 5.43836 5.70434 5.4836 5.70482L9.94972 5.70591C9.98341 5.66262 9.98363 5.61641 10.0036 5.56809C10.2337 5.00997 10.7032 4.62376 11.2912 4.44694C12.057 4.26607 12.7913 4.50879 13.2849 5.12057C13.3976 5.26011 13.5255 5.46271 13.5575 5.63793C13.5833 5.77941 13.8201 5.68445 13.9926 5.71572L13.9925 4.98462C13.9923 4.81571 14.0008 4.6397 13.9843 4.47154C13.9379 3.99846 13.5373 3.51445 13.0382 3.44587C12.9397 3.43235 12.8309 3.44089 12.731 3.44071L2.47293 3.44605ZM5.878 0.974871L5.53005 1.01167C5.43144 1.02957 5.33245 1.06446 5.24279 1.10753L5.2312 1.11278C5.01551 1.21233 4.86018 1.39021 4.70043 1.55671L3.98657 2.29077C3.93009 2.34625 3.87926 2.40752 3.82307 2.46161L8.12724 2.46273L9.92277 2.46261C10.0023 2.46228 10.0845 2.46626 10.1633 2.45832L10.1561 2.45313C10.0855 2.40163 10.0114 2.30839 9.9468 2.24567L9.15411 1.48596C8.89035 1.23068 8.64029 1.03126 8.25336 0.989873L5.878 0.974871ZM11.6535 5.38076C11.3046 5.41384 10.9812 5.71874 10.9261 6.05496L10.9234 6.07093C10.8787 6.35264 10.9952 6.63538 11.2176 6.81751L11.2294 6.82726C11.3797 6.95057 11.6105 7.03789 11.8098 7.01969L11.87 7.01302C12.1459 6.97746 12.4072 6.83366 12.5354 6.5879L12.5426 6.57426C12.8523 5.97962 12.3312 5.30421 11.6535 5.38076ZM3.53009 5.38037C3.14755 5.39667 2.79965 5.6466 2.71989 6.01723L2.71722 6.02918C2.62497 6.454 2.92453 6.92802 3.37296 7.00433L3.47995 7.01743C3.51314 7.02383 3.54835 7.02108 3.58201 7.02011C4.09527 6.95766 4.47136 6.58769 4.39172 6.068L4.37669 6.00781C4.30304 5.75275 4.14684 5.54684 3.89206 5.44137L3.75718 5.39851C3.6845 5.37877 3.6052 5.37762 3.53009 5.38037Z"
        fill="#B8AE96"
      />
    </svg>
  );
}

export function Calendar({
  active,
  inverted,
  stroke: strokeOverride,
  className,
}: SvgIconProps) {
  const stroke = getNavStroke(active, inverted, strokeOverride);

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <rect
        x="2"
        y="3"
        width="10"
        height="9"
        rx="1.5"
        stroke={stroke}
        strokeWidth="0.9625"
      />
      <path d="M2 5.5H12" stroke={stroke} strokeWidth="0.9625" />
      <path
        d="M4.5 1.75V3.5"
        stroke={stroke}
        strokeWidth="0.9625"
        strokeLinecap="round"
      />
      <path
        d="M9.5 1.75V3.5"
        stroke={stroke}
        strokeWidth="0.9625"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Building({
  active,
  inverted,
  stroke: strokeOverride,
  className,
}: SvgIconProps) {
  const stroke = getNavStroke(active, inverted, strokeOverride);

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M2.5 12.25V5L7 2.5L11.5 5V12.25"
        stroke={stroke}
        strokeWidth="0.9625"
        strokeLinejoin="round"
      />
      <path
        d="M5.25 12.25V8.75H8.75V12.25"
        stroke={stroke}
        strokeWidth="0.9625"
      />
      <path
        d="M5.25 6.5H5.26M7 6.5H7.01M8.75 6.5H8.76"
        stroke={stroke}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Wrench({
  active,
  inverted,
  stroke: strokeOverride,
  className,
}: SvgIconProps) {
  const stroke = getNavStroke(active, inverted, strokeOverride);

  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.29244 2.97713C7.18556 3.08617 7.12569 3.23278 7.12569 3.38547C7.12569 3.53816 7.18556 3.68476 7.29244 3.7938L8.22578 4.72713C8.33482 4.83402 8.48142 4.89388 8.63411 4.89388C8.7868 4.89388 8.9334 4.83402 9.04244 4.72713L11.2416 2.52797C11.5349 3.17616 11.6237 3.89835 11.4962 4.5983C11.3687 5.29825 11.0309 5.94271 10.5278 6.4458C10.0247 6.94888 9.38023 7.2867 8.68028 7.41423C7.98033 7.54177 7.25814 7.45295 6.60994 7.15963L2.57911 11.1905C2.34705 11.4225 2.0323 11.5529 1.70411 11.5529C1.37592 11.5529 1.06118 11.4225 0.829112 11.1905C0.597047 10.9584 0.466675 10.6437 0.466675 10.3155C0.466675 9.98728 0.597047 9.67253 0.829112 9.44047L4.85994 5.40963C4.56662 4.76144 4.47781 4.03925 4.60534 3.3393C4.73288 2.63935 5.0707 1.99489 5.57378 1.4918C6.07687 0.988717 6.72133 0.650898 7.42128 0.523366C8.12122 0.395833 8.84342 0.484645 9.49161 0.777966L7.29828 2.9713L7.29244 2.97713Z"
        stroke="#B8AE96"
        strokeWidth="0.933333"
      />
    </svg>
  );
}

export function Finance({ active, inverted, className }: SvgIconProps) {
  const stroke = getNavStroke(active, inverted);

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <rect
        x="2.5"
        y="4.5"
        width="11"
        height="8"
        rx="1.5"
        stroke={stroke}
        strokeWidth="1"
      />
      <path d="M2.5 7H13.5" stroke={stroke} strokeWidth="1" />
      <path
        d="M5.5 10.5H7"
        stroke={stroke}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Search({
  className,
  color = "var(--secondary)",
}: TopbarIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
        stroke={color}
        strokeWidth="1.1"
      />
      <path
        d="M14 14L11.1 11.1"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Dollar({
  className,
  color = "var(--primary)",
}: TopbarIconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M9 2.25V15.75"
        stroke={color}
        strokeWidth="1.05"
        strokeLinecap="round"
      />
      <path
        d="M12.375 4.875H7.875C7.07625 4.875 6.4275 5.52375 6.4275 6.3225C6.4275 7.12125 7.07625 7.77 7.875 7.77H10.125C10.9238 7.77 11.5725 8.41875 11.5725 9.2175C11.5725 10.0163 10.9238 10.665 10.125 10.665H5.625"
        stroke={color}
        strokeWidth="1.05"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ActivityChat({
  className,
  color = "#C5A059",
}: TopbarIconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M11.6667 8.75C11.6667 9.08152 11.5351 9.39946 11.3017 9.63388C11.0683 9.8683 10.7504 10 10.4167 10H4.58333L2.33333 11.6667V3.33333C2.33333 2.96514 2.47958 2.6127 2.73718 2.3551C2.99478 2.0975 3.34722 1.95125 3.71533 1.95125H10.4167C10.7504 1.95125 11.0683 2.08295 11.3017 2.31737C11.5351 2.55179 11.6667 2.86973 11.6667 3.20125V8.75Z"
        stroke={color}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ActivityAI({ className, color = "#9E8AD4" }: TopbarIconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <circle cx="7" cy="7" r="4.5" stroke={color} strokeWidth="0.9" />
      <path
        d="M5 7H9M7 5V9"
        stroke={color}
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ActivityCheck({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M3.5 7L6 9.5L10.5 4.5"
        stroke={color}
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ActivityUser({
  className,
  color = "#C5A059",
}: TopbarIconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <circle cx="7" cy="5" r="2" stroke={color} strokeWidth="0.9" />
      <path
        d="M3.5 12V11C3.5 9.61929 4.61929 8.5 6 8.5H8C9.38071 8.5 10.5 9.61929 10.5 11V12"
        stroke={color}
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ActivityKey({ className, color = "#C5A059" }: TopbarIconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <circle cx="9" cy="5" r="2" stroke={color} strokeWidth="0.9" />
      <path
        d="M7.5 6.5L2.5 11.5M4.5 9.5L5.5 10.5M6.5 8.5L7.5 9.5"
        stroke={color}
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function NavAnalytics({
  active,
  inverted,
  stroke: strokeOverride,
  className,
}: SvgIconProps) {
  const stroke = getNavStroke(active, inverted, strokeOverride);

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2 2V14H14" stroke="#B8AE96" strokeWidth="0.933333" />
      <path
        d="M4.66663 7.99998L6.66663 5.99998L9.33329 8.66665L12.6666 5.33331"
        stroke="#B8AE96"
        strokeWidth="0.933333"
      />
    </svg>
  );
}

export function NavCommunications({ active, className }: SvgIconProps) {
  const stroke = active ? "var(--accent)" : "var(--muted)";

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <rect
        x="2"
        y="4"
        width="12"
        height="9"
        rx="1.5"
        stroke={stroke}
        strokeWidth="1"
      />
      <path
        d="M2 6.5L8 10L14 6.5"
        stroke={stroke}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MemberUserStat({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <circle cx="8" cy="5.5" r="2.25" stroke={color} strokeWidth="1" />
      <path
        d="M3.5 13.5V12.25C3.5 10.56 4.85 9.25 6.5 9.25H9.5C11.15 9.25 12.5 10.56 12.5 12.25V13.5"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MemberStarStat({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M8 2.5L9.55 6.1L13.5 6.55L10.75 9.15L11.55 13L8 11.15L4.45 13L5.25 9.15L2.5 6.55L6.45 6.1L8 2.5Z"
        stroke={color}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MemberTargetStat({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={className}
    >
      <g clipPath="url(#memberTargetClip)">
        <path
          d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z"
          stroke={color}
          strokeWidth="0.85"
        />
      </g>
      <defs>
        <clipPath id="memberTargetClip">
          <rect width="12" height="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function MemberCheckStat({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M3.5 8.5L6.5 11.5L12.5 4.5"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function DraftIcon({
  className = "",
  color = "#D4A847", // Fallback to your precise brand gold hex
}: TopbarIconProps) {
  return (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Document Body Path */}
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      
      {/* Corner Fold Path */}
      <polyline points="14 2 14 8 20 8" />
      
      {/* Pencil/Edit Line Paths inside the draft */}
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

export function NavConfirmationCheck({
  stroke = "#E7E5E4",
  className,
}: {
  stroke?: string;
  className?: string;
}) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <rect
        x="1.75"
        y="1.75"
        width="10.5"
        height="10.5"
        rx="2"
        stroke={stroke}
        strokeWidth="0.9"
      />
      <path
        d="M4.5 7L6.25 8.75L9.5 5.5"
        stroke={stroke}
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FaintCheck({ className, color = "#4A4540" }: TopbarIconProps) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M2 5L4.25 7.25L8 3.25"
        stroke={color}
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrendUp({ className, color = "#0A0806" }: TopbarIconProps) {
  return (
    <svg
      width="7"
      height="3"
      viewBox="0 0 7 3"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M6.23926 2.51831L3.23926 0.518311L0.239258 2.51831"
        stroke={color}
        strokeWidth="0.8625"
      />
    </svg>
  );
}

export function MemberProfileArrow({
  className,
  color = "var(--primary)",
}: TopbarIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M2.5 6H9.5"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M6 2.5L9.5 6L6 9.5"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CloudUpload({
  className,
  color = "var(--dark)",
}: TopbarIconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M4.08333 10.5H3.5C2.39543 10.5 1.5 9.60457 1.5 8.5C1.5 7.5335 2.2835 6.723 3.23333 6.51717C3.42067 4.46017 5.15417 2.83334 7.29167 2.83334C9.179 2.83334 10.7588 4.1085 11.2083 5.83334C12.1292 5.93384 12.8333 6.71067 12.8333 7.64584C12.8333 8.64917 12.0197 9.45834 11.0167 9.45834H10.5"
        stroke={color}
        strokeWidth="0.95"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 9.91667V5.25"
        stroke={color}
        strokeWidth="0.95"
        strokeLinecap="round"
      />
      <path
        d="M5.25 7.29167L7 5.54167L8.75 7.29167"
        stroke={color}
        strokeWidth="0.95"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function JobSpinner({
  className,
  color = "var(--primary)",
}: TopbarIconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M7 1.75V3.5"
        stroke={color}
        strokeWidth="0.95"
        strokeLinecap="round"
      />
      <path
        d="M7 10.5V12.25"
        stroke={color}
        strokeWidth="0.95"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M11.6667 7H9.91667"
        stroke={color}
        strokeWidth="0.95"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M4.08333 7H2.33333"
        stroke={color}
        strokeWidth="0.95"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M10.2375 3.7625L9.00417 4.99583"
        stroke={color}
        strokeWidth="0.95"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path
        d="M4.99583 9.00417L3.7625 10.2375"
        stroke={color}
        strokeWidth="0.95"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

export function JobCloud({
  className,
  color = "var(--primary)",
}: TopbarIconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M4.08333 9.91667H3.5C2.39543 9.91667 1.5 9.02125 1.5 7.91667C1.5 6.95 2.2835 6.1395 3.23333 5.93367C3.42067 3.87667 5.15417 2.25 7.29167 2.25C9.179 2.25 10.7588 3.52517 11.2083 5.25C12.1292 5.3505 12.8333 6.12733 12.8333 7.0625C12.8333 8.06583 12.0197 8.875 11.0167 8.875H10.5"
        stroke={color}
        strokeWidth="0.95"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronDown({
  className,
  color = "var(--primary)",
}: TopbarIconProps) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Phone({ className, color = "var(--primary)" }: TopbarIconProps) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M10.5 8.25V9.75C10.5006 9.94891 10.4392 10.1427 10.3249 10.3027C10.2106 10.4627 10.0495 10.5799 9.86458 10.6365C9.67967 10.6931 9.48106 10.6861 9.30042 10.6165C9.11979 10.5469 8.96667 10.4186 8.86333 10.2517C7.72833 8.42083 6.57917 7.27833 4.74833 6.14333C4.58143 6.03999 4.45315 5.88687 4.38354 5.70623C4.31393 5.5256 4.30689 5.32699 4.36354 5.14208C4.4202 4.95717 4.53737 4.79608 4.69737 4.68177C4.85737 4.56746 5.05115 4.50608 5.25 4.50667H6.75C7.08152 4.50667 7.39946 4.63839 7.63388 4.87281C7.8683 5.10723 8 5.42517 8 5.75667C8 6.08817 8.13172 6.40611 8.36614 6.64053C8.60056 6.87495 8.9185 7.00667 9.25 7.00667C9.5815 7.00667 9.89944 6.87495 10.1339 6.64053C10.3683 6.40611 10.5 6.08817 10.5 5.75667V4.25667C10.4994 3.92517 10.3677 3.60723 10.1333 3.37281C9.89885 3.13839 9.58091 3.00667 9.24942 3.00667C6.35292 3.00667 4.00333 5.35625 4.00333 8.25275"
        stroke={color}
        strokeWidth="0.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ConciergeGear({
  className,
  color = "var(--primary)",
}: TopbarIconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M7 9.25C8.24264 9.25 9.25 8.24264 9.25 7C9.25 5.75736 8.24264 4.75 7 4.75C5.75736 4.75 4.75 5.75736 4.75 7C4.75 8.24264 5.75736 9.25 7 9.25Z"
        stroke={color}
        strokeWidth="0.9"
      />
      <path
        d="M7 1.75V2.75M7 11.25V12.25M12.25 7H11.25M2.75 7H1.75M10.546 3.454L9.839 4.161M4.161 9.839L3.454 10.546M10.546 10.546L9.839 9.839M4.161 4.161L3.454 3.454"
        stroke={color}
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}
