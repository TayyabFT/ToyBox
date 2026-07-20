type SvgIconProps = {
  active?: boolean;
  inverted?: boolean;
  stroke?: string;
  className?: string;
};

function getNavStroke(active?: boolean, inverted?: boolean, stroke?: string) {
  if (stroke) return stroke;
  if (inverted && active) return "var(--dark)";
  return active ? "var(--nav-icon-active)" : "var(--muted)";
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


export function StarMembersIcon({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_2596_33)">
        <path d="M6.99999 1.16663L8.74999 5.24996H12.8333L9.62499 7.58329L10.7917 11.6666L6.99999 9.33329L3.20832 11.6666L4.37499 7.58329L1.16666 5.24996H5.24999L6.99999 1.16663Z" stroke="#D4A847" stroke-width="0.933333" />
      </g>
      <defs>
        <clipPath id="clip0_2596_33">
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
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
      viewBox="0 0 11 11"
      fill="none"
      aria-hidden
      className={className}
    >
      <mask
        id="stat-dollar-mask"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="11"
        height="11"
      >
        <path d="M0 0H11V11H0V0Z" fill="white" strokeWidth={0} />
      </mask>
      <g mask="url(#stat-dollar-mask)">
        <path
          d="M9.37791 1.61348C8.34025 0.575781 6.96094 0 5.49354 0C4.02617 0 2.64688 0.575781 1.60918 1.61348C0.571487 2.65117 0 4.03477 0 5.50215C0 6.96955 0.571487 8.35097 1.60918 9.38868C2.64688 10.4263 4.02617 11 5.49354 11C6.96094 11 8.34025 10.4263 9.37791 9.38868C10.4156 8.35097 10.9871 6.96955 10.9871 5.5C10.9871 4.03262 10.4156 2.65117 9.37791 1.61348ZM8.76993 8.78066C7.89552 9.65507 6.73104 10.1385 5.49143 10.1385C2.93691 10.1363 0.859375 8.05663 0.859375 5.50215C0.859375 4.26465 1.34063 3.10019 2.21719 2.22578C3.09375 1.35137 4.25606 0.867969 5.49569 0.867969C8.05232 0.867969 10.1299 2.94766 10.1299 5.50215C10.1277 6.73965 9.6465 7.9041 8.76993 8.78066Z"
          fill={color}
          strokeWidth={0}
          className="group-hover:fill-[var(--stat-card-hover-fg)]"
        />
        <path
          d="M5.71401 5.07031C5.00075 4.79316 4.77085 4.58047 4.77085 4.1916C4.77085 3.89297 4.99214 3.54278 5.61735 3.54278C5.84725 3.54278 6.07069 3.58145 6.28335 3.65879C6.38648 3.69531 6.49822 3.69102 6.59704 3.64375C6.69585 3.59649 6.76891 3.5127 6.80329 3.40957C6.87419 3.20117 6.76245 2.97344 6.5562 2.90039C6.33065 2.8209 6.0771 2.77578 5.79995 2.7629V2.38477C5.79995 2.14844 5.60663 1.95508 5.37026 1.95508C5.13395 1.95508 4.94058 2.14844 4.94058 2.38477V2.86387C4.72145 2.93477 4.5281 3.04219 4.36267 3.18398C4.04255 3.45898 3.86638 3.84356 3.86638 4.26895C3.86638 4.64494 3.99958 4.9715 4.26384 5.23788C4.49802 5.47424 4.83534 5.66757 5.29725 5.83087C5.95253 6.08222 6.18454 6.32069 6.18454 6.7375C6.18454 7.20372 5.81929 7.49375 5.23065 7.49375C4.87398 7.49375 4.56892 7.39709 4.37771 7.31541C4.27244 7.27032 4.15212 7.27247 4.04685 7.32188C3.94372 7.36913 3.86638 7.45938 3.83415 7.56896L3.832 7.57323C3.77185 7.77091 3.87067 7.98146 4.06189 8.06094C4.324 8.17053 4.64628 8.24354 4.96207 8.26719V8.63674C4.96207 8.87306 5.15544 9.06639 5.39176 9.06639C5.62808 9.06639 5.82145 8.87306 5.82145 8.63674V8.20701C6.13513 8.13184 6.40582 7.9965 6.61423 7.80744C6.92575 7.52597 7.09763 7.12635 7.09763 6.68594C7.09763 5.92754 6.68298 5.44413 5.71401 5.07031Z"
          fill={color}
          strokeWidth={0}
          className="group-hover:fill-[var(--stat-card-hover-fg)]"
        />
      </g>
    </svg>
  );
}

export function StatBuildingIcon({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 11 11"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.2143 9.42858H10.3452C10.5189 9.42858 10.6854 9.49745 10.8083 9.62029C10.9311 9.74312 11 9.90969 11 10.0833V10.3452C11 10.5189 10.9311 10.6855 10.8083 10.8083C10.6854 10.9311 10.5189 11 10.3452 11H0.65476C0.481118 11 0.314546 10.9311 0.191712 10.8083C0.0688794 10.6855 0 10.5189 0 10.3452V10.0833C0 9.90969 0.0688794 9.74312 0.191712 9.62029C0.314546 9.49745 0.481118 9.42858 0.65476 9.42858H0.785713V3.40478C0.785713 2.9708 1.13745 2.61907 1.57143 2.61907H4.97618V0.785738C4.97618 0.511 5.11944 0.256429 5.35437 0.113953C5.58904 -0.0285232 5.88132 -0.0379539 6.12489 0.0888077L9.79155 1.99862C10.0514 2.13402 10.2143 2.40247 10.2143 2.69554V9.42858ZM10.3452 9.95238H0.65476C0.619927 9.95238 0.586664 9.96626 0.562045 9.99062C0.537688 10.0152 0.523808 10.0485 0.523808 10.0833V10.3452C0.523808 10.3801 0.537688 10.4133 0.562045 10.438C0.586664 10.4623 0.619927 10.4762 0.65476 10.4762H10.3452C10.38 10.4762 10.4133 10.4623 10.4379 10.438C10.4623 10.4133 10.4762 10.3801 10.4762 10.3452V10.0833C10.4762 10.0485 10.4623 10.0152 10.4379 9.99062C10.4133 9.96626 10.38 9.95238 10.3452 9.95238ZM4.97618 3.14288H1.57143C1.42685 3.14288 1.30952 3.26021 1.30952 3.40478V9.42858H1.83333V8.38096C1.83333 8.24215 1.88859 8.10884 1.9868 8.01063C2.08502 7.91241 2.21833 7.85715 2.35714 7.85715H3.92856C4.06737 7.85715 4.20068 7.91241 4.2989 8.01063C4.39711 8.10884 4.45237 8.24215 4.45237 8.38096V9.42858H4.97618V3.14288ZM9.69045 9.42858V2.69554C9.69045 2.59785 9.63624 2.50828 9.54955 2.46323L5.88289 0.55343C5.8017 0.511264 5.70427 0.514402 5.62596 0.561807C5.54792 0.609211 5.49999 0.694071 5.49999 0.785738V9.42858H6.2857V7.85715C6.2857 7.56775 6.5201 7.33334 6.80951 7.33334H8.38093C8.67034 7.33334 8.90474 7.56775 8.90474 7.85715V9.42858H9.69045ZM2.35714 9.42858H3.92856V8.38096H2.35714V9.42858ZM7.85713 9.42858H8.38093V7.85715H7.85713V9.42858ZM6.80951 9.42858H7.33332V7.85715H6.80951V9.42858ZM3.66666 7.33334C3.52209 7.33334 3.40475 7.21601 3.40475 7.07144C3.40475 6.92687 3.52209 6.80953 3.66666 6.80953H4.19047C4.33504 6.80953 4.45237 6.92687 4.45237 7.07144C4.45237 7.21601 4.33504 7.33334 4.19047 7.33334H3.66666ZM2.09523 4.19049C1.95066 4.19049 1.83333 4.07316 1.83333 3.92859C1.83333 3.78402 1.95066 3.66668 2.09523 3.66668H2.61904C2.76361 3.66668 2.88095 3.78402 2.88095 3.92859C2.88095 4.07316 2.76361 4.19049 2.61904 4.19049H2.09523ZM2.09523 5.23811C1.95066 5.23811 1.83333 5.12078 1.83333 4.9762C1.83333 4.83163 1.95066 4.7143 2.09523 4.7143H2.61904C2.76361 4.7143 2.88095 4.83163 2.88095 4.9762C2.88095 5.12078 2.76361 5.23811 2.61904 5.23811H2.09523ZM2.09523 7.33334C1.95066 7.33334 1.83333 7.21601 1.83333 7.07144C1.83333 6.92687 1.95066 6.80953 2.09523 6.80953H2.61904C2.76361 6.80953 2.88095 6.92687 2.88095 7.07144C2.88095 7.21601 2.76361 7.33334 2.61904 7.33334H2.09523ZM3.66666 6.28573C3.52209 6.28573 3.40475 6.16839 3.40475 6.02382C3.40475 5.87925 3.52209 5.76192 3.66666 5.76192H4.19047C4.33504 5.76192 4.45237 5.87925 4.45237 6.02382C4.45237 6.16839 4.33504 6.28573 4.19047 6.28573H3.66666ZM2.09523 6.28573C1.95066 6.28573 1.83333 6.16839 1.83333 6.02382C1.83333 5.87925 1.95066 5.76192 2.09523 5.76192H2.61904C2.76361 5.76192 2.88095 5.87925 2.88095 6.02382C2.88095 6.16839 2.76361 6.28573 2.61904 6.28573H2.09523ZM3.66666 4.19049C3.52209 4.19049 3.40475 4.07316 3.40475 3.92859C3.40475 3.78402 3.52209 3.66668 3.66666 3.66668H4.19047C4.33504 3.66668 4.45237 3.78402 4.45237 3.92859C4.45237 4.07316 4.33504 4.19049 4.19047 4.19049H3.66666ZM3.66666 5.23811C3.52209 5.23811 3.40475 5.12078 3.40475 4.9762C3.40475 4.83163 3.52209 4.7143 3.66666 4.7143H4.19047C4.33504 4.7143 4.45237 4.83163 4.45237 4.9762C4.45237 5.12078 4.33504 5.23811 4.19047 5.23811H3.66666ZM8.2107 6.80822C8.06613 6.80822 7.94879 6.69089 7.94879 6.54632C7.94879 6.40175 8.06613 6.28441 8.2107 6.28441H9.03569C9.18027 6.28441 9.2976 6.40175 9.2976 6.54632C9.2976 6.69089 9.18027 6.80822 9.03569 6.80822H8.2107ZM6.2857 3.66537C6.14113 3.66537 6.0238 3.54804 6.0238 3.40347C6.0238 3.2589 6.14113 3.14156 6.2857 3.14156H7.1107C7.25527 3.14156 7.3726 3.2589 7.3726 3.40347C7.3726 3.54804 7.25527 3.66537 7.1107 3.66537H6.2857ZM6.2857 6.80822C6.14113 6.80822 6.0238 6.69089 6.0238 6.54632C6.0238 6.40175 6.14113 6.28441 6.2857 6.28441H7.1107C7.25527 6.28441 7.3726 6.40175 7.3726 6.54632C7.3726 6.69089 7.25527 6.80822 7.1107 6.80822H6.2857ZM8.2107 5.76061C8.06613 5.76061 7.94879 5.64327 7.94879 5.4987C7.94879 5.35413 8.06613 5.2368 8.2107 5.2368H9.03569C9.18027 5.2368 9.2976 5.35413 9.2976 5.4987C9.2976 5.64327 9.18027 5.76061 9.03569 5.76061H8.2107ZM6.2857 4.71299C6.14113 4.71299 6.0238 4.59566 6.0238 4.45109C6.0238 4.30651 6.14113 4.18918 6.2857 4.18918H7.1107C7.25527 4.18918 7.3726 4.30651 7.3726 4.45109C7.3726 4.59566 7.25527 4.71299 7.1107 4.71299H6.2857ZM6.2857 5.76061C6.14113 5.76061 6.0238 5.64327 6.0238 5.4987C6.0238 5.35413 6.14113 5.2368 6.2857 5.2368H7.1107C7.25527 5.2368 7.3726 5.35413 7.3726 5.4987C7.3726 5.64327 7.25527 5.76061 7.1107 5.76061H6.2857ZM8.2107 3.66537C8.06613 3.66537 7.94879 3.54804 7.94879 3.40347C7.94879 3.2589 8.06613 3.14156 8.2107 3.14156H9.03569C9.18027 3.14156 9.2976 3.2589 9.2976 3.40347C9.2976 3.54804 9.18027 3.66537 9.03569 3.66537H8.2107ZM8.2107 4.71299C8.06613 4.71299 7.94879 4.59566 7.94879 4.45109C7.94879 4.30651 8.06613 4.18918 8.2107 4.18918H9.03569C9.18027 4.18918 9.2976 4.30651 9.2976 4.45109C9.2976 4.59566 9.18027 4.71299 9.03569 4.71299H8.2107Z"
        fill={color}
        strokeWidth={0}
        className="group-hover:fill-dark"
      />
    </svg>
  );
}

export function StatCalendarIcon({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 11 11"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M3 1.42105C1.61929 1.42105 0.5 2.54034 0.5 3.92105V8C0.5 9.38071 1.61929 10.5 3 10.5H5.5H8C9.38071 10.5 10.5 9.38071 10.5 8V3.92105C10.5 2.54034 9.38071 1.42105 8 1.42105H6.75H5.5H4.77632M3.52632 2.34211V0.5M7.47368 2.34211V0.5"
        stroke={color}
        strokeLinecap="round"
      />
      <path
        d="M3.91797 6.02085C4.26069 6.34952 4.96081 7.02093 5.01956 7.07727C5.07831 7.13362 6.4149 5.7861 7.07586 5.1053"
        stroke={color}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function StatSuiteIcon({
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
      <path
        d="M9.5 1.5H2.5C1.94772 1.5 1.5 1.94772 1.5 2.5V9.5C1.5 10.0523 1.94772 10.5 2.5 10.5H9.5C10.0523 10.5 10.5 10.0523 10.5 9.5V2.5C10.5 1.94772 10.0523 1.5 9.5 1.5Z"
        stroke={color}
        strokeWidth="0.85"
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

/** Member stat icons — exact SVGs from Figma */
export function MemberStatVehicleIcon({ className, color = "currentColor" }: TopbarIconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M2.91663 9.91671H11.0833L10.2083 5.83337H3.79163L2.91663 9.91671Z" stroke={color} strokeWidth="0.933333" />
      <path d="M4.375 11.0834C4.85825 11.0834 5.25 10.6916 5.25 10.2084C5.25 9.72512 4.85825 9.33337 4.375 9.33337C3.89175 9.33337 3.5 9.72512 3.5 10.2084C3.5 10.6916 3.89175 11.0834 4.375 11.0834Z" stroke={color} strokeWidth="0.933333" />
      <path d="M9.625 11.0834C10.1082 11.0834 10.5 10.6916 10.5 10.2084C10.5 9.72512 10.1082 9.33337 9.625 9.33337C9.14175 9.33337 8.75 9.72512 8.75 10.2084C8.75 10.6916 9.14175 11.0834 9.625 11.0834Z" stroke={color} strokeWidth="0.933333" />
    </svg>
  );
}

export function MemberStatRequestIcon({ className, color = "currentColor" }: TopbarIconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12.25 7.00004C12.25 9.56671 9.91667 11.6667 7 11.6667C6.19842 11.6731 5.40412 11.5143 4.66667 11.2L1.75 12.25L2.8 9.80004C2.15234 9.00715 1.78339 8.02328 1.75 7.00004C1.75 4.43337 4.08333 2.33337 7 2.33337C9.91667 2.33337 12.25 4.43337 12.25 7.00004Z" stroke={color} strokeWidth="0.933333" />
    </svg>
  );
}

export function MemberStatEventIcon({ className, color = "currentColor" }: TopbarIconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M11.0833 2.33337H2.91667C2.27233 2.33337 1.75 2.85571 1.75 3.50004V11.6667C1.75 12.311 2.27233 12.8334 2.91667 12.8334H11.0833C11.7277 12.8334 12.25 12.311 12.25 11.6667V3.50004C12.25 2.85571 11.7277 2.33337 11.0833 2.33337Z" stroke={color} strokeWidth="0.933333" />
      <path d="M4.66667 1.16663V3.49996M9.33333 1.16663V3.49996M1.75 5.83329H12.25" stroke={color} strokeWidth="0.933333" />
    </svg>
  );
}

export function MemberStatDaysIcon({ className, color = "currentColor" }: TopbarIconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className={className} xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#memberDaysClip)">
        <path d="M6.99999 1.16663L8.74999 5.24996H12.8333L9.62499 7.58329L10.7917 11.6666L6.99999 9.33329L3.20832 11.6666L4.37499 7.58329L1.16666 5.24996H5.24999L6.99999 1.16663Z" stroke={color} strokeWidth="0.933333" />
      </g>
      <defs>
        <clipPath id="memberDaysClip">
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
export function ToyBoxLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.54223 17.4952H16.9758C17.8599 17.4952 18.575 16.7843 18.575 15.9055V2.55158C18.575 1.67277 17.8599 0.961834 16.9758 0.961834H3.54223C2.65817 0.961834 1.94299 1.67277 1.94299 2.55158V15.9055C1.94299 16.7843 2.65817 17.4952 3.54223 17.4952Z"
        fill="#C9A84C"
      />
      <g filter="url(#f0)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.63969 8.62933H9.01729C9.37091 8.62933 9.65698 8.34496 9.65698 7.99343V4.63587C9.65698 4.28435 9.37091 3.99997 9.01729 3.99997H5.63969C5.28607 3.99997 5 4.28435 5 4.63587V7.99343C5 8.34496 5.28607 8.62933 5.63969 8.62933Z"
          fill="#0A0A0C"
          fillOpacity="0.94"
          shapeRendering="crispEdges"
        />
      </g>
      <g filter="url(#f1)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.4629 8.69214H14.8405C15.1942 8.69214 15.4802 8.40776 15.4802 8.05624V4.69868C15.4802 4.34715 15.1942 4.06278 14.8405 4.06278H11.4629C11.1093 4.06278 10.8232 4.34715 10.8232 4.69868V8.05624C10.8232 8.40776 11.1093 8.69214 11.4629 8.69214Z"
          fill="#0A0A0C"
          fillOpacity="0.6"
          shapeRendering="crispEdges"
        />
      </g>
      <g filter="url(#f2)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.63969 14.5764H9.01729C9.37091 14.5764 9.65698 14.292 9.65698 13.9405V10.583C9.65698 10.2314 9.37091 9.94706 9.01729 9.94706H5.63969C5.28607 9.94706 5 10.2314 5 10.583V13.9405C5 14.292 5.28607 14.5764 5.63969 14.5764Z"
          fill="#0A0A0C"
        />
      </g>
      <g filter="url(#f3)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.5455 14.528H14.923C15.2767 14.528 15.5627 14.2436 15.5627 13.8921V10.5346C15.5627 10.183 15.2767 9.89866 14.923 9.89866H11.5455C11.1918 9.89866 10.9058 10.183 10.9058 10.5346V13.8921C10.9058 14.2436 11.1918 14.528 11.5455 14.528Z"
          fill="#0A0A0C"
          fillOpacity="0.16"
          shapeRendering="crispEdges"
        />
      </g>
      <defs>
        <filter id="f0" x="0" y="0" width="14.657" height="14.6293" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="1" /><feGaussianBlur stdDeviation="2.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2575_771" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2575_771" result="shape" />
        </filter>
        <filter id="f1" x="5.82324" y="0.0628052" width="14.657" height="14.6293" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="1" /><feGaussianBlur stdDeviation="2.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2575_771" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2575_771" result="shape" />
        </filter>
        <filter id="f2" x="0" y="5.94708" width="14.657" height="14.6293" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="1" /><feGaussianBlur stdDeviation="2.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2575_771" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2575_771" result="shape" />
        </filter>
        <filter id="f3" x="5.90576" y="5.89868" width="14.657" height="14.6293" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="1" /><feGaussianBlur stdDeviation="2.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2575_771" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2575_771" result="shape" />
        </filter>
      </defs>
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

export function NavGarage({
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
      aria-hidden
      className={className}
    >
      <path
        d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
        stroke={stroke}
        strokeWidth="1.06667"
      />
      <path
        d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
        stroke={stroke}
        strokeWidth="1.06667"
      />
    </svg>
  );
}

export function NavParking({
  active,
  inverted,
  stroke: fillOverride,
  className,
}: SvgIconProps) {
  const fill = getNavStroke(active, inverted, fillOverride);

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
        d="M7 0C5.61553 0 4.26216 0.410543 3.11101 1.17971C1.95987 1.94888 1.06266 3.04213 0.532846 4.32122C0.00303306 5.6003 -0.13559 7.00776 0.134506 8.36563C0.404603 9.7235 1.07129 10.9708 2.05026 11.9497C3.02922 12.9287 4.2765 13.5954 5.63437 13.8655C6.99224 14.1356 8.3997 13.997 9.67879 13.4672C10.9579 12.9373 12.0511 12.0401 12.8203 10.889C13.5895 9.73785 14 8.38447 14 7C13.9979 5.14413 13.2597 3.36487 11.9474 2.05257C10.6351 0.740272 8.85587 0.00209975 7 0ZM7 13.0667C5.80013 13.0667 4.6272 12.7109 3.62954 12.0442C2.63189 11.3776 1.85431 10.4301 1.39513 9.32161C0.935962 8.21307 0.815822 6.99327 1.04991 5.81645C1.28399 4.63963 1.86178 3.55866 2.71022 2.71022C3.55866 1.86178 4.63964 1.28399 5.81645 1.0499C6.99327 0.815819 8.21308 0.935959 9.32161 1.39513C10.4302 1.8543 11.3776 2.63188 12.0443 3.62954C12.7109 4.6272 13.0667 5.80013 13.0667 7C13.0648 8.60841 12.4251 10.1504 11.2877 11.2877C10.1504 12.4251 8.60841 13.0648 7 13.0667ZM7.93334 3.73333H5.6C5.47623 3.73333 5.35754 3.7825 5.27002 3.87002C5.1825 3.95753 5.13334 4.07623 5.13334 4.2V10.7333C5.13334 10.8571 5.1825 10.9758 5.27002 11.0633C5.35754 11.1508 5.47623 11.2 5.6 11.2C5.72377 11.2 5.84247 11.1508 5.92999 11.0633C6.0175 10.9758 6.06667 10.8571 6.06667 10.7333V7.93333H7.93334C8.30464 7.93333 8.66073 7.78583 8.92328 7.52328C9.18584 7.26073 9.33333 6.90463 9.33333 6.53333V5.13333C9.33333 4.76203 9.18584 4.40593 8.92328 4.14338C8.66073 3.88083 8.30464 3.73333 7.93334 3.73333ZM8.4 6.53333C8.4 6.6571 8.35084 6.7758 8.26332 6.86332C8.1758 6.95083 8.0571 7 7.93334 7H6.06667V4.66667H7.93334C8.0571 4.66667 8.1758 4.71583 8.26332 4.80335C8.35084 4.89087 8.4 5.00956 8.4 5.13333V6.53333Z"
        fill={fill}
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

export function Menu({ className, color = "var(--muted)" }: TopbarIconProps) {
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
        d="M1.75 3.5H12.25M1.75 7H12.25M1.75 10.5H12.25"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ThemeSun({
  className,
  color = "#B8AE96",
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
        d="M4 8C4 10.24 5.76 12 8 12C10.24 12 12 10.24 12 8C12 5.76 10.24 4 8 4C5.76 4 4 5.76 4 8ZM8 5.6C9.36 5.6 10.4 6.64 10.4 8C10.4 9.36 9.36 10.4 8 10.4C6.64 10.4 5.6 9.36 5.6 8C5.6 6.64 6.64 5.6 8 5.6ZM8.8 2.4V0.8C8.8 0.32 8.48 0 8 0C7.52 0 7.2 0.32 7.2 0.8V2.4C7.2 2.88 7.52 3.2 8 3.2C8.48 3.2 8.8 2.88 8.8 2.4ZM13.68 2.32C13.36 2 12.88 2 12.56 2.32L11.44 3.44C11.12 3.76 11.12 4.24 11.44 4.56C11.6 4.72 11.84 4.8 12 4.8C12.16 4.8 12.4 4.72 12.56 4.56L13.68 3.44C14 3.2 14 2.64 13.68 2.32ZM15.2 7.2H13.6C13.12 7.2 12.8 7.52 12.8 8C12.8 8.48 13.12 8.8 13.6 8.8H15.2C15.68 8.8 16 8.48 16 8C16 7.52 15.68 7.2 15.2 7.2ZM12.56 11.36C12.24 11.04 11.76 11.04 11.44 11.36C11.12 11.68 11.12 12.16 11.44 12.48L12.56 13.6C12.72 13.76 12.96 13.84 13.12 13.84C13.28 13.84 13.52 13.76 13.68 13.6C14 13.28 14 12.8 13.68 12.48L12.56 11.36ZM7.2 13.6V15.2C7.2 15.68 7.52 16 8 16C8.48 16 8.8 15.68 8.8 15.2V13.6C8.8 13.12 8.48 12.8 8 12.8C7.52 12.8 7.2 13.12 7.2 13.6ZM2.32 13.68C2.48 13.84 2.72 13.92 2.88 13.92C3.04 13.92 3.28 13.84 3.44 13.68L4.56 12.56C4.88 12.24 4.88 11.76 4.56 11.44C4.24 11.12 3.76 11.12 3.44 11.44L2.32 12.56C2 12.8 2 13.36 2.32 13.68ZM0 8C0 8.48 0.32 8.8 0.8 8.8H2.4C2.88 8.8 3.2 8.48 3.2 8C3.2 7.52 2.88 7.2 2.4 7.2H0.8C0.32 7.2 0 7.52 0 8ZM3.44 2.32C3.12 2 2.64 2 2.32 2.32C2 2.64 2 3.12 2.32 3.44L3.44 4.56C3.6 4.8 3.84 4.88 4.08 4.88C4.32 4.88 4.48 4.8 4.64 4.64C4.96 4.32 4.96 3.84 4.64 3.52L3.44 2.32Z"
        fill={color}
      />
    </svg>
  );
}

export function ThemeMoon({
  className,
  color = "#3A3530",
}: TopbarIconProps) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M7.98125 1.58333C8.32453 1.41667 8.49617 1 8.41035 0.666667C8.32453 0.333333 7.89543 0 7.46633 0C3.26116 0.0833333 0 3.41667 0 7.5C0 11.6667 3.4328 15 7.72379 15C10.9849 15 13.817 13 14.9327 10.0833C15.1043 9.75 14.9327 9.33333 14.5894 9.08333C14.2461 8.83333 13.817 8.91667 13.5595 9.16667C12.7013 9.91667 11.5857 10.3333 10.3842 10.3333C7.72379 10.3333 5.49247 8.25 5.49247 5.58333C5.49247 4 6.43649 2.41667 7.98125 1.58333ZM10.3842 12C10.8133 12 11.2424 12 11.5857 11.9167C10.5559 12.8333 9.18273 13.3333 7.72379 13.3333C4.37682 13.3333 1.7164 10.75 1.7164 7.5C1.7164 5.41667 2.91788 3.5 4.7201 2.5C4.11936 3.41667 3.8619 4.5 3.8619 5.66667C3.77608 9.16667 6.77977 12 10.3842 12Z"
        fill={color}
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



export function AnalyticsChartBars({ className }: TopbarIconProps) {
  return (
    <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.8274 10.1378H0.56321C0.413838 10.1378 0.270583 10.0784 0.164961 9.97282C0.0593382 9.8672 0 9.72395 0 9.57457V0.56321C0 0.413838 0.0593382 0.270583 0.164961 0.164961C0.270583 0.0593382 0.413838 0 0.56321 0C0.712583 0 0.855838 0.0593382 0.96146 0.164961C1.06708 0.270583 1.12642 0.413838 1.12642 0.56321V9.01136H11.8274C11.9768 9.01136 12.12 9.0707 12.2257 9.17632C12.3313 9.28195 12.3906 9.4252 12.3906 9.57457C12.3906 9.72395 12.3313 9.8672 12.2257 9.97282C12.12 10.0784 11.9768 10.1378 11.8274 10.1378Z" fill="black" />
      <path d="M11.2684 1.69011V3.37974C11.2684 3.52911 11.209 3.67237 11.1034 3.77799C10.9978 3.88361 10.8545 3.94295 10.7052 3.94295C10.5558 3.94295 10.4125 3.88361 10.3069 3.77799C10.2013 3.67237 10.142 3.52911 10.142 3.37974V3.04745L7.72297 5.46644C7.61745 5.57133 7.4747 5.63021 7.32591 5.63021C7.17712 5.63021 7.03437 5.57133 6.92884 5.46644L6.19949 4.73989L2.65408 8.28249C2.60359 8.34144 2.54146 8.38933 2.47158 8.42313C2.40171 8.45694 2.3256 8.47594 2.24803 8.47893C2.17047 8.48193 2.09312 8.46886 2.02085 8.44054C1.94857 8.41223 1.88293 8.36928 1.82805 8.31439C1.77316 8.2595 1.73021 8.19386 1.70189 8.12159C1.67358 8.04932 1.66051 7.97197 1.66351 7.8944C1.6665 7.81684 1.6855 7.74073 1.7193 7.67086C1.75311 7.60098 1.80099 7.53885 1.85995 7.48836L5.80242 3.54589C5.90795 3.44099 6.0507 3.38211 6.19949 3.38211C6.34828 3.38211 6.49103 3.44099 6.59655 3.54589L7.32591 4.27243L9.34783 2.25332H9.01554C8.86617 2.25332 8.72291 2.19398 8.61729 2.08836C8.51167 1.98274 8.45233 1.83948 8.45233 1.69011C8.45233 1.54074 8.51167 1.39748 8.61729 1.29186C8.72291 1.18624 8.86617 1.1269 9.01554 1.1269H10.7052C10.7407 1.1226 10.7766 1.1226 10.8122 1.1269C10.8459 1.13419 10.8789 1.14455 10.9107 1.15788L11.0009 1.20575C11.0588 1.24865 11.11 1.29989 11.1529 1.35782C11.1705 1.38694 11.1865 1.41703 11.2008 1.44793C11.2141 1.47977 11.2245 1.51276 11.2318 1.54649C11.2519 1.59198 11.2643 1.64053 11.2684 1.69011Z" fill="black" />
    </svg>

  );
}


export function BoxIcon({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M8.4248 0.425003H1.4248C0.87252 0.425003 0.424805 0.872718 0.424805 1.425V8.425C0.424805 8.97729 0.87252 9.425 1.4248 9.425H8.4248C8.97709 9.425 9.4248 8.97729 9.4248 8.425V1.425C9.4248 0.872718 8.97709 0.425003 8.4248 0.425003Z"
        stroke={color}
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

export function Workshop({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.43219 8.20114C8.42734 8.24166 8.41954 8.28227 8.40866 8.32277L8.40841 8.32269C8.40638 8.33015 8.40243 8.34302 8.39663 8.36119C8.35134 8.50313 8.27282 8.6264 8.17172 8.72614C8.48095 8.76615 8.83573 8.72532 9.30427 8.50477L11.0976 7.5389C11.0901 7.50632 11.0765 7.47405 11.0563 7.44336C11.0092 7.37187 10.9359 7.32791 10.852 7.30913C10.7457 7.2853 10.6225 7.29962 10.5058 7.34769L10.5054 7.34682L8.43222 8.20111L8.43219 8.20114ZM2.71616 7.91571L4.45076 7.03463C4.52831 6.99525 4.60702 6.97192 4.6864 6.96427C4.76665 6.95653 4.85132 6.96495 4.93975 6.98919L7.61033 7.72048C7.62769 7.72524 7.63045 7.7257 7.63286 7.72647C7.74188 7.76188 7.8269 7.83181 7.87701 7.91784C7.92378 7.99815 7.93965 8.0938 7.91444 8.18753V8.18854L7.9104 8.20373C7.87782 8.30583 7.80014 8.38737 7.70122 8.43719C7.59833 8.489 7.4749 8.50605 7.3544 8.47741C7.34704 8.47506 7.33961 8.47307 7.33217 8.47143L5.97145 8.11101C5.83497 8.07478 5.69523 8.15703 5.65932 8.29471C5.6234 8.43241 5.70493 8.57338 5.84138 8.60962L7.19883 8.96916C7.26432 8.99351 7.2884 9.00264 7.31266 9.01184C7.91679 9.24112 8.48961 9.4585 9.52594 8.96845L9.53793 8.96238L11.4564 7.92912C11.4674 7.92415 11.478 7.91841 11.4882 7.91196L11.927 7.67561C12.0184 7.62643 12.1242 7.61656 12.2211 7.64031C12.314 7.66307 12.3964 7.71663 12.4459 7.79541L12.4516 7.80438C12.4912 7.87245 12.4979 7.9485 12.4774 8.01868C12.4547 8.09631 12.3999 8.16854 12.3194 8.21994L12.3066 8.22811L8.35121 10.5733C8.2677 10.6228 8.17898 10.6532 8.08735 10.6642C7.99531 10.6753 7.90011 10.6666 7.80404 10.638L6.66745 10.2993C6.63809 10.2906 6.62308 10.2857 6.55464 10.265C6.00514 10.0988 5.66395 9.99556 5.10871 10.3147L4.398 10.7232L2.71616 7.91563V7.91571ZM2.6488 12.8752L0.0367623 8.51477C-0.0361774 8.3927 0.0027978 8.23407 0.123786 8.16047L1.91128 7.07049C2.03227 6.99689 2.1895 7.03622 2.26244 7.15829L2.45108 7.47318L4.22068 6.57434C4.35505 6.50608 4.49461 6.46533 4.63838 6.45148C4.78312 6.43754 4.92857 6.45074 5.07382 6.49053L7.7444 7.22182C7.74968 7.22327 7.76447 7.22794 7.78895 7.2359C8.02134 7.31137 8.20546 7.46558 8.31722 7.65739C8.32277 7.66692 8.32813 7.67654 8.33333 7.68624L10.3137 6.87021V6.8692C10.5227 6.78306 10.7533 6.75964 10.9621 6.8064C11.1709 6.85318 11.357 6.96826 11.4824 7.15867C11.511 7.20196 11.5348 7.24691 11.5541 7.29298L11.6869 7.22141C11.8929 7.11049 12.1281 7.08743 12.3412 7.13968C12.5582 7.19288 12.7546 7.32424 12.878 7.52089C12.8804 7.52466 12.8849 7.53223 12.8918 7.54398C13.007 7.7418 13.0267 7.96175 12.9676 8.16405C12.9107 8.35884 12.78 8.53562 12.5915 8.65602C12.5867 8.65914 12.5778 8.66449 12.5647 8.67228L8.60933 11.0175C8.46261 11.1045 8.30728 11.1578 8.14739 11.177C7.98792 11.1962 7.82411 11.1815 7.66 11.1326L6.4086 10.7596C5.98737 10.6322 5.72584 10.5531 5.36084 10.7629L4.6623 11.1644L4.87451 11.5186C4.94745 11.6407 4.90847 11.7993 4.78748 11.8729L2.99999 12.9629C2.879 13.0365 2.72177 12.9972 2.64883 12.8751L2.6488 12.8752ZM0.607116 8.46891L2.95451 12.3875L4.30413 11.5645L1.95676 7.64594L0.607116 8.46891ZM8.84391 0.516807H8.21727L8.07556 0.962727L8.07535 0.962646C8.04978 1.04271 7.98591 1.10854 7.89949 1.13229C7.8032 1.1588 7.7081 1.19178 7.61474 1.23083C7.52523 1.26827 7.43558 1.31292 7.34633 1.36441L7.34614 1.36408C7.27353 1.40589 7.18206 1.41097 7.10221 1.36946L6.68958 1.1553L6.24674 1.60207L6.45239 2.00541C6.49741 2.08264 6.50125 2.18137 6.45402 2.26469C6.40299 2.35476 6.35868 2.44527 6.32157 2.53561C6.2843 2.62634 6.25261 2.71867 6.22686 2.81216C6.20749 2.89799 6.14498 2.97158 6.05587 3.00044L5.6139 3.14342V3.77565L6.05587 3.91863L6.05579 3.91884C6.13515 3.94464 6.2004 4.00908 6.22393 4.09628C6.2502 4.19343 6.2829 4.28937 6.32157 4.38357C6.35865 4.47388 6.40296 4.56433 6.45399 4.6544L6.45367 4.65459C6.49511 4.72786 6.50014 4.82014 6.459 4.9007L6.24671 5.31703L6.68955 5.76382L7.08932 5.55633C7.16586 5.51091 7.26369 5.50703 7.3463 5.55469C7.43558 5.60617 7.52528 5.65088 7.61485 5.68832C7.70477 5.72589 7.79629 5.75789 7.88895 5.78388C7.97402 5.80342 8.04696 5.86649 8.07556 5.95639L8.21727 6.40232H8.84391L8.98562 5.95639L8.98584 5.95648C9.0114 5.87641 9.07527 5.81058 9.1617 5.78683C9.25798 5.76032 9.35305 5.72734 9.44644 5.68832C9.53596 5.65088 9.62564 5.6062 9.71488 5.55472L9.71507 5.55504C9.78768 5.51323 9.87915 5.50815 9.959 5.54966L10.3716 5.76382L10.8144 5.31705L10.6088 4.91371C10.5638 4.83648 10.5599 4.73778 10.6072 4.65443C10.6582 4.56436 10.7025 4.47385 10.7396 4.38351C10.7769 4.29276 10.8086 4.20042 10.8343 4.10696C10.8537 4.02113 10.9162 3.94754 11.0053 3.91868L11.4473 3.77571V3.14347L11.0053 3.0005L11.0054 3.00028C10.926 2.97448 10.8608 2.91004 10.8373 2.82284C10.811 2.7257 10.7783 2.62975 10.7396 2.53556C10.7025 2.44524 10.6582 2.35476 10.6072 2.26472L10.6075 2.26453C10.5661 2.19126 10.561 2.09898 10.6022 2.01842L10.8144 1.6021L10.3716 1.15533L9.97183 1.36282C9.89529 1.40824 9.79746 1.41212 9.71485 1.36446C9.62943 1.31519 9.54362 1.27215 9.45793 1.23572C9.4537 1.23419 9.44947 1.23258 9.4453 1.23083C9.35419 1.19274 9.26299 1.16074 9.17218 1.13527C9.08713 1.1157 9.01419 1.05263 8.98559 0.962782L8.84388 0.516861L8.84391 0.516807ZM8.03128 0V0.000765151C7.92329 0.000737824 7.82294 0.0703668 7.78817 0.179674L7.63032 0.676423C7.5587 0.699897 7.4888 0.72594 7.42068 0.754442C7.35007 0.783955 7.2819 0.81549 7.21632 0.848966L6.77302 0.618873C6.67449 0.558453 6.54427 0.571187 6.45908 0.657103L5.75293 1.36954L5.7533 1.36993C5.67682 1.44707 5.65469 1.56813 5.70691 1.67033L5.94309 2.13352C5.90991 2.19974 5.87863 2.26854 5.84937 2.33981C5.82118 2.40851 5.79537 2.47902 5.7721 2.55124L5.29969 2.70405C5.18623 2.73062 5.1017 2.83323 5.1017 2.95576V3.96333H5.10245C5.10245 4.07229 5.17144 4.17353 5.27978 4.20862L5.77213 4.36788C5.79539 4.44013 5.82121 4.51066 5.84943 4.57939C5.87868 4.65063 5.90996 4.71941 5.94312 4.7856L5.71506 5.23286C5.65518 5.33227 5.6678 5.46366 5.75295 5.54961L6.45911 6.26207L6.45949 6.26169C6.53595 6.33886 6.65594 6.36119 6.75723 6.3085L7.21635 6.07021C7.28198 6.10369 7.35018 6.13525 7.42081 6.16479C7.48888 6.19324 7.55878 6.21928 7.63034 6.24275L7.7818 6.71939C7.80813 6.83386 7.90983 6.91915 8.03128 6.91915H9.02993V6.91838C9.13792 6.91841 9.23827 6.84878 9.27304 6.73947L9.43089 6.24273C9.50251 6.21925 9.57241 6.19321 9.64053 6.16473C9.71114 6.13522 9.77931 6.10366 9.84491 6.07021L10.2882 6.3003C10.3867 6.36072 10.517 6.34799 10.6022 6.26207L11.3083 5.54963L11.3079 5.54925C11.3844 5.47211 11.4065 5.35105 11.3543 5.24885L11.1181 4.78563C11.1513 4.71941 11.1826 4.65063 11.2118 4.57934C11.2401 4.51064 11.2658 4.44013 11.2891 4.36791L11.7615 4.2151C11.875 4.18853 11.9595 4.08592 11.9595 3.96339V2.95582H11.9588C11.9588 2.84686 11.8898 2.74565 11.7814 2.71053L11.2891 2.55127C11.2658 2.47902 11.24 2.40849 11.2118 2.33976C11.1825 2.26852 11.1512 2.19974 11.1181 2.13355L11.3462 1.68629C11.406 1.58687 11.3934 1.45549 11.3083 1.36954L10.6021 0.657103L10.6017 0.657486C10.5253 0.580315 10.4053 0.557988 10.304 0.610675L9.84489 0.848966C9.78365 0.817731 9.72019 0.788163 9.65456 0.760344C9.65026 0.75824 9.64589 0.756245 9.64143 0.754387C9.57366 0.726049 9.5034 0.699979 9.43084 0.676287L9.27944 0.199787C9.25311 0.0853146 9.1514 2.73119e-05 9.02996 2.73119e-05H8.03131L8.03128 0ZM9.26876 2.71479C9.45765 2.90537 9.5745 3.16869 9.5745 3.45956C9.5745 3.75043 9.45765 4.01375 9.26876 4.20433C9.07987 4.39491 8.81888 4.5128 8.53059 4.5128C8.2423 4.5128 7.98131 4.39491 7.79242 4.20433C7.60353 4.01375 7.48668 3.75043 7.48668 3.45956C7.48668 3.16869 7.60353 2.90537 7.79242 2.71479C7.98131 2.52422 8.2423 2.40633 8.53059 2.40633C8.81888 2.40633 9.07987 2.52422 9.26876 2.71479ZM8.53059 1.88952C8.96027 1.88952 9.34929 2.06526 9.63092 2.3494C9.91252 2.63355 10.0867 3.02605 10.0867 3.45956C10.0867 3.89308 9.91255 4.2856 9.63092 4.56972C9.34929 4.85386 8.96027 5.0296 8.53059 5.0296C8.10092 5.0296 7.7119 4.85386 7.43027 4.56972C7.14867 4.2856 6.97445 3.89308 6.97445 3.45956C6.97445 3.02605 7.14864 2.63355 7.43027 2.3494C7.7119 2.06529 8.10092 1.88952 8.53059 1.88952Z"
        fill={color}
      />
    </svg>
  );
}

export function AlertTriangle({
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
  color = "currentColor",
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
  color = "currentColor",
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

export function NavClubhouse({
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
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.75 7L7 1.75L12.25 7"
        stroke={stroke}
        strokeWidth="1.06667"
      />
      <path
        d="M2.91675 5.83337V11.6667H11.0834V5.83337"
        stroke={stroke}
        strokeWidth="1.06667"
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
  color = "currentColor",
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
        d="M11.6667 8.75C11.6667 9.08152 11.5351 9.39946 11.3017 9.63388C11.0683 9.8683 10.7504 10 10.4167 10H4.58333L2.33333 11.6667V3.33333C2.33333 2.96514 2.47958 2.6127 2.73718 2.3551C2.99478 2.0975 3.34722 1.95125 3.71533 1.95125H10.4167C10.7504 1.95125 11.0683 2.08295 11.3017 2.31737C11.5351 2.55179 11.6667 2.86973 11.6667 3.20125V8.75Z"
        stroke={color}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ActivityAI({
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

export function ActivityKey({
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
export function AttendanceIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Calendar */}
      <rect
        x="3"
        y="5"
        width="11"
        height="11"
        rx="2"
        stroke="#C9A84C"
        strokeWidth="1.5"
      />

      <path
        d="M6 3.5V6.5M11 3.5V6.5"
        stroke="#C9A84C"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M3 8.5H14"
        stroke="#C9A84C"
        strokeWidth="1.5"
      />

      {/* User (increased size) */}
      <circle
        cx="17"
        cy="13"
        r="3.2"
        stroke="#C9A84C"
        strokeWidth="1.5"
      />

      <path
        d="M13.8 19.2C14.2 17.2 15.7 16 17 16C18.3 16 19.8 17.2 20.2 19.2"
        stroke="#C9A84C"
        strokeWidth="1.5"
        strokeLinecap="round"
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

export function TrendUp({ className, color = "currentColor" }: TopbarIconProps) {
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

export function StarFilled({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path
        d="M8 2.5L9.55 6.1L13.5 6.55L10.75 9.15L11.55 13L8 11.15L4.45 13L5.25 9.15L2.5 6.55L6.45 6.1L8 2.5Z"
        fill={color}
      />
    </svg>
  );
}

export function EditPencil({ className, color = "#C9A84C" }: TopbarIconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path
        d="M10.8 2.6 13.4 5.2 5.6 13 3 13.4 3.4 10.8 10.8 2.6Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ActionGarage({ className, color = "#D4A847" }: TopbarIconProps) {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden className={className}>
      <path
        d="M2.25 6.75L9 2.25L15.75 6.75V15C15.75 15.3978 15.592 15.7794 15.3107 16.0607C15.0294 16.342 14.6478 16.5 14.25 16.5H3.75C3.35218 16.5 2.97064 16.342 2.68934 16.0607C2.40804 15.7794 2.25 15.3978 2.25 15V6.75Z"
        stroke={color}
        strokeWidth="1.2"
      />
    </svg>
  );
}

export function ActionConcierge({ className, color = "#D4A847" }: TopbarIconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path
        d="M15.75 9C15.75 12.3 12.75 15 9 15C7.9694 15.0083 6.94815 14.804 6 14.4L2.25 15.75L3.6 12.6C2.76729 11.5806 2.29293 10.3156 2.25 9C2.25 5.7 5.25 3 9 3C12.75 3 15.75 5.7 15.75 9Z"
        stroke={color}
        strokeWidth="1.2"
      />
    </svg>
  );
}

export function ActionBook({ className, color = "#D4A847" }: TopbarIconProps) {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden className={className}>
      <path
        d="M14.25 3H3.75C2.92157 3 2.25 3.67157 2.25 4.5V15C2.25 15.8284 2.92157 16.5 3.75 16.5H14.25C15.0784 16.5 15.75 15.8284 15.75 15V4.5C15.75 3.67157 15.0784 3 14.25 3Z"
        stroke={color}
        strokeWidth="1.2"
      />
    </svg>
  );
}

export function ActionSource({ className, color = "#D4A847" }: TopbarIconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden className={className}>
      <path
        d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z"
        stroke={color}
        strokeWidth="1.2"
      />
      <path
        d="M15.75 15.75L12.4875 12.4875"
        stroke={color}
        strokeWidth="1.2"
      />
    </svg>
  );
}

export type DetailGlyphName =
  | "mail"
  | "phone"
  | "id"
  | "location"
  | "calendar";

export function DetailGlyph({
  icon,
  className = "size-[15px]",
  color = "#C9A84C",
}: TopbarIconProps & { icon: DetailGlyphName }) {
  const common = {
    stroke: color,
    strokeWidth: 1.15,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };

  return (
    <svg viewBox="0 0 16 16" aria-hidden className={className}>
      {icon === "mail" && (
        <>
          <rect x="2.2" y="3.8" width="11.6" height="8.4" rx="1.6" {...common} />
          <path d="M3 5L8 8.6L13 5" {...common} />
        </>
      )}
      {icon === "phone" && (
        <path
          d="M6.2 3.2 7 5c.12.3.02.62-.2.82l-.9.7c.62 1.2 1.5 2.08 2.7 2.7l.7-.9c.2-.22.52-.32.82-.2l1.78.78c.3.13.5.42.5.74v1.66c0 .42-.36.78-.78.72C7.4 12.4 3.6 8.6 3.06 4.06c-.06-.42.3-.78.72-.78h1.6c.34 0 .68.2.82.5z"
          {...common}
        />
      )}
      {icon === "id" && (
        <>
          <rect x="2.2" y="3.5" width="11.6" height="9" rx="1.6" {...common} />
          <circle cx="5.9" cy="7" r="1.5" {...common} />
          <path
            d="M3.7 11c.25-1.05 1.1-1.6 2.2-1.6s1.95.55 2.2 1.6"
            {...common}
          />
          <path d="M10 6.4h2.4M10 8.4h2.4" {...common} />
        </>
      )}
      {icon === "location" && (
        <>
          <path
            d="M8 13.6s4-3.4 4-6.8A4 4 0 0 0 8 2.8 4 4 0 0 0 4 6.8c0 3.4 4 6.8 4 6.8z"
            {...common}
          />
          <circle cx="8" cy="6.8" r="1.5" {...common} />
        </>
      )}
      {icon === "calendar" && (
        <>
          <rect x="2.2" y="3.4" width="11.6" height="9.2" rx="1.6" {...common} />
          <path d="M2.2 6.3h11.6M5.4 2.2v2.3M10.6 2.2v2.3" {...common} />
        </>
      )}
    </svg>
  );
}

export function CommunicationsOpenRateIcon({
  className,
  color = "#D4A847",
}: TopbarIconProps) {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.77797 9.77774H1.22203V1.22226H5.04167V0H1.22203C0.549742 0 0 0.549914 0 1.22226V9.77774C0 10.4501 0.549742 11 1.22203 11H9.77797C10.4503 11 11 10.4501 11 9.77774V5.95833H9.77797V9.77774ZM6.41667 0V1.22226H8.92243L2.74997 7.39443L3.60551 8.24997L9.778 2.07765V4.58333H11V0H6.41667Z" fill="#D4A847" />
    </svg>


  );
}

export function CommunicationsClickRateIcon({
  className,
  color = "var(--primary)",
}: TopbarIconProps) {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.54891 1.91892V0.47148C5.54891 0.346436 5.5994 0.226513 5.68926 0.138093C5.77912 0.0496735 5.901 0 6.02809 0C6.15518 0 6.27706 0.0496735 6.36692 0.138093C6.45679 0.226513 6.50727 0.346436 6.50727 0.47148V1.91892C6.50727 2.04397 6.45679 2.16389 6.36692 2.25231C6.27706 2.34073 6.15518 2.3904 6.02809 2.3904C5.901 2.3904 5.77912 2.34073 5.68926 2.25231C5.5994 2.16389 5.54891 2.04397 5.54891 1.91892ZM8.90317 3.56439C8.96624 3.56475 9.02875 3.55285 9.08713 3.52939C9.14552 3.50593 9.19862 3.47136 9.24339 3.42766L10.2928 2.40455C10.382 2.31621 10.4321 2.19671 10.4321 2.07215C10.4321 1.9476 10.382 1.8281 10.2928 1.73976C10.203 1.65195 10.0816 1.60266 9.95498 1.60266C9.82838 1.60266 9.70693 1.65195 9.61715 1.73976L8.57733 2.76287C8.51166 2.82877 8.4671 2.91218 8.44915 3.00277C8.43121 3.09336 8.44069 3.18713 8.4764 3.27247C8.51211 3.35781 8.5725 3.43096 8.65006 3.48285C8.72763 3.53474 8.81897 3.56309 8.91276 3.56439H8.90317ZM2.80321 8.43949L1.76338 9.4626C1.71847 9.50643 1.68282 9.55858 1.6585 9.61603C1.63417 9.67349 1.62164 9.73511 1.62164 9.79735C1.62164 9.85959 1.63417 9.92122 1.6585 9.97867C1.68282 10.0361 1.71847 10.0883 1.76338 10.1321C1.80793 10.1763 1.86093 10.2114 1.91932 10.2353C1.97771 10.2592 2.04034 10.2716 2.1036 10.2716C2.16686 10.2716 2.22949 10.2592 2.28788 10.2353C2.34628 10.2114 2.39927 10.1763 2.44382 10.1321L3.48364 9.10899C3.52832 9.06503 3.56376 9.01284 3.58794 8.95541C3.61212 8.89797 3.62457 8.83641 3.62457 8.77424C3.62457 8.71207 3.61212 8.65051 3.58794 8.59307C3.56376 8.53564 3.52832 8.48345 3.48364 8.43949C3.43896 8.39553 3.38592 8.36066 3.32755 8.33687C3.26917 8.31308 3.20661 8.30083 3.14342 8.30083C3.08024 8.30083 3.01767 8.31308 2.9593 8.33687C2.90092 8.36066 2.84788 8.39553 2.80321 8.43949ZM2.42465 5.95951C2.42465 5.83446 2.37417 5.71454 2.2843 5.62612C2.19444 5.5377 2.07256 5.48803 1.94547 5.48803H0.479181C0.352094 5.48803 0.230213 5.5377 0.140349 5.62612C0.050485 5.71454 0 5.83446 0 5.95951C0 6.08455 0.050485 6.20447 0.140349 6.29289C0.230213 6.38131 0.352094 6.43099 0.479181 6.43099H1.94547C2.07256 6.43099 2.19444 6.38131 2.2843 6.29289C2.37417 6.20447 2.42465 6.08455 2.42465 5.95951ZM2.42465 1.76333C2.33351 1.70932 2.22668 1.68669 2.12102 1.69902C2.01535 1.71134 1.91687 1.75792 1.84108 1.83141C1.7653 1.90489 1.71652 2.00111 1.70246 2.10488C1.68839 2.20866 1.70982 2.31409 1.76338 2.40455L2.80321 3.42766C2.84798 3.47136 2.90108 3.50593 2.95946 3.52939C3.01785 3.55285 3.08036 3.56475 3.14342 3.56439C3.20649 3.56475 3.269 3.55285 3.32738 3.52939C3.38577 3.50593 3.43887 3.47136 3.48364 3.42766C3.57289 3.33932 3.62298 3.21982 3.62298 3.09527C3.62298 2.97071 3.57289 2.85121 3.48364 2.76287L2.42465 1.76333ZM10.8439 10.8629C10.7541 10.9507 10.6326 11 10.506 11C10.3794 11 10.258 10.9507 10.1682 10.8629L8.42879 9.15143L7.1925 10.7309C7.14786 10.7879 7.09053 10.8342 7.02491 10.8661C6.95929 10.8979 6.88713 10.9146 6.81395 10.9148H6.73249C6.64639 10.8999 6.56606 10.8622 6.50018 10.8057C6.4343 10.7492 6.38539 10.6761 6.35873 10.5942L4.6768 5.34658C4.64951 5.26389 4.64598 5.17539 4.66661 5.09085C4.68724 5.00631 4.73123 4.92903 4.79371 4.86755C4.8562 4.80607 4.93474 4.76279 5.02066 4.74249C5.10658 4.72219 5.19653 4.72566 5.28057 4.75252L10.5851 6.43099C10.6691 6.45665 10.7443 6.50457 10.8024 6.56948C10.8606 6.63439 10.8995 6.7138 10.9148 6.79901C10.9301 6.88422 10.9214 6.97193 10.8894 7.05255C10.8574 7.13317 10.8036 7.20358 10.7336 7.25608L9.12839 8.47249L10.863 10.1793C10.9508 10.2674 11 10.3859 11 10.5093C11 10.6327 10.9508 10.7512 10.863 10.8393L10.8439 10.8629ZM8.02148 8.12831L8.05502 8.10003L8.08857 8.07174L9.40152 7.07691L5.85079 5.95951L6.98645 9.44846L8.02148 8.12831Z" fill="#D4A847" />
    </svg>

  );
}

export function CaptureModePhoto({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className ?? "size-5"}
    >
      <path
        d="M15.3332 12.6667C15.3332 13.0203 15.1927 13.3594 14.9426 13.6095C14.6926 13.8595 14.3535 14 13.9998 14H1.99984C1.64622 14 1.30708 13.8595 1.05703 13.6095C0.80698 13.3594 0.666504 13.0203 0.666504 12.6667V5.33333C0.666504 4.97971 0.80698 4.64057 1.05703 4.39052C1.30708 4.14048 1.64622 4 1.99984 4H4.6665L5.99984 2H9.99984L11.3332 4H13.9998C14.3535 4 14.6926 4.14048 14.9426 4.39052C15.1927 4.64057 15.3332 4.97971 15.3332 5.33333V12.6667Z"
        stroke={color}
        strokeWidth="1.06667"
      />
      <path
        d="M8.00016 11.3333C9.47292 11.3333 10.6668 10.1394 10.6668 8.66667C10.6668 7.19391 9.47292 6 8.00016 6C6.5274 6 5.3335 7.19391 5.3335 8.66667C5.3335 10.1394 6.5274 11.3333 8.00016 11.3333Z"
        stroke={color}
        strokeWidth="1.06667"
      />
    </svg>
  );
}

export function CaptureModeVideo({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className ?? "size-5"}
    >
      <path
        d="M15.3332 4.66669L10.6665 8.00002L15.3332 11.3334V4.66669Z"
        stroke={color}
        strokeWidth="1.06667"
      />
      <path
        d="M9.33317 3.33331H1.99984C1.26346 3.33331 0.666504 3.93027 0.666504 4.66665V11.3333C0.666504 12.0697 1.26346 12.6666 1.99984 12.6666H9.33317C10.0696 12.6666 10.6665 12.0697 10.6665 11.3333V4.66665C10.6665 3.93027 10.0696 3.33331 9.33317 3.33331Z"
        stroke={color}
        strokeWidth="1.06667"
      />
    </svg>
  );
}

export function CaptureModeBurst({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className ?? "size-5"}
    >
      <path
        d="M8.00016 14.6667C11.6821 14.6667 14.6668 11.6819 14.6668 8.00001C14.6668 4.31811 11.6821 1.33334 8.00016 1.33334C4.31826 1.33334 1.3335 4.31811 1.3335 8.00001C1.3335 11.6819 4.31826 14.6667 8.00016 14.6667Z"
        stroke={color}
        strokeWidth="1.06667"
      />
      <path
        d="M8 5.33331V7.99998L10 9.99998"
        stroke={color}
        strokeWidth="1.06667"
      />
    </svg>
  );
}

export function CaptureShutterButton({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      className={className ?? "size-[22px]"}
    >
      <path
        d="M17.25 14.25C17.25 14.6478 17.092 15.0294 16.8107 15.3107C16.5294 15.592 16.1478 15.75 15.75 15.75H2.25C1.85218 15.75 1.47064 15.592 1.18934 15.3107C0.908035 15.0294 0.75 14.6478 0.75 14.25V6C0.75 5.60218 0.908035 5.22064 1.18934 4.93934C1.47064 4.65804 1.85218 4.5 2.25 4.5H5.25L6.75 2.25H11.25L12.75 4.5H15.75C16.1478 4.5 16.5294 4.65804 16.8107 4.93934C17.092 5.22064 17.25 5.60218 17.25 6V14.25Z"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M9 12.75C10.6569 12.75 12 11.4069 12 9.75C12 8.09315 10.6569 6.75 9 6.75C7.34315 6.75 6 8.09315 6 9.75C6 11.4069 7.34315 12.75 9 12.75Z"
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function CaptureModeZoom({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className ?? "size-5"}
    >
      <path d="M10 2H14V6" stroke={color} strokeWidth="1.06667" />
      <path d="M6 14H2V10" stroke={color} strokeWidth="1.06667" />
      <path d="M14.0002 2L9.3335 6.66667" stroke={color} strokeWidth="1.06667" />
      <path d="M2 14L6.66667 9.33331" stroke={color} strokeWidth="1.06667" />
    </svg>
  );
}

export function CaptureModeFlash({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className ?? "size-5"}
    >
      <path
        d="M13.9999 8.52667C13.8951 9.66147 13.4692 10.7429 12.7721 11.6445C12.075 12.5461 11.1356 13.2305 10.0637 13.6177C8.99188 14.0049 7.83192 14.0787 6.7196 13.8307C5.60728 13.5827 4.5886 13.023 3.78275 12.2172C2.97691 11.4113 2.41723 10.3927 2.16921 9.28033C1.92118 8.16801 1.99508 7.00806 2.38224 5.9362C2.7694 4.86434 3.45382 3.92491 4.35541 3.22784C5.257 2.53076 6.33847 2.10487 7.47327 2C6.80888 2.89884 6.48917 4.0063 6.57229 5.12094C6.65541 6.23559 7.13584 7.28337 7.9262 8.07373C8.71656 8.86409 9.76435 9.34452 10.879 9.42765C11.9936 9.51077 13.1011 9.19106 13.9999 8.52667Z"
        stroke={color}
        strokeWidth="1.06667"
      />
    </svg>
  );
}

export function CaptureModeScan({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className ?? "size-5"}
    >
      <path
        d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
        stroke={color}
        strokeWidth="1.06667"
      />
      <path
        d="M14.0001 14L11.1001 11.1"
        stroke={color}
        strokeWidth="1.06667"
      />
    </svg>
  );
}

export function CaptureServicePreService({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      viewBox="0 0 9 8"
      fill="none"
      aria-hidden
      className={className ?? "h-2.5 w-3 shrink-0"}
    >
      <path
        d="M2.81445 3.59235L3.98116 4.75902L7.87019 0.870132"
        stroke={color}
        strokeWidth="0.9625"
      />
      <path
        d="M7.48169 3.98125V6.70347C7.48169 6.90975 7.39975 7.10758 7.25388 7.25344C7.10801 7.3993 6.91018 7.48125 6.70389 7.48125H1.25925C1.05296 7.48125 0.855126 7.3993 0.709259 7.25344C0.563392 7.10758 0.481445 6.90975 0.481445 6.70347V1.25902C0.481445 1.05275 0.563392 0.854914 0.709259 0.709053C0.855126 0.563191 1.05296 0.481247 1.25925 0.481247H5.53718"
        stroke={color}
        strokeWidth="0.9625"
      />
    </svg>
  );
}

export function CaptureServiceDetailing({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      viewBox="0 0 8 9"
      fill="none"
      aria-hidden
      className={className ?? "h-3 w-2.5 shrink-0"}
    >
      <path
        d="M7.79294 2.63475L5.24471 0.198C5.11245 0.0713768 4.93303 0.000157547 4.74588 0H0.705882C0.518671 0 0.339127 0.0711159 0.206748 0.197703C0.0743696 0.32429 0 0.495979 0 0.675V1.8C0 1.85967 0.0247899 1.9169 0.0689161 1.9591C0.113042 2.00129 0.17289 2.025 0.235294 2.025C0.297698 2.025 0.357546 2.00129 0.401672 1.9591C0.445798 1.9169 0.470588 1.85967 0.470588 1.8V0.675C0.470588 0.615326 0.495378 0.558097 0.539504 0.515901C0.583631 0.473705 0.643478 0.45 0.705882 0.45H4.70588V2.475C4.70588 2.65402 4.78025 2.82571 4.91263 2.9523C5.04501 3.07888 5.22455 3.15 5.41176 3.15H7.52941V8.325C7.52941 8.38467 7.50462 8.4419 7.4605 8.4841C7.41637 8.52629 7.35652 8.55 7.29412 8.55H0.705882C0.643478 8.55 0.583631 8.52629 0.539504 8.4841C0.495378 8.4419 0.470588 8.38467 0.470588 8.325V2.7C0.470588 2.64033 0.445798 2.5831 0.401672 2.5409C0.357546 2.49871 0.297698 2.475 0.235294 2.475C0.17289 2.475 0.113042 2.49871 0.0689161 2.5409C0.0247899 2.5831 0 2.64033 0 2.7V8.325C0 8.50402 0.0743696 8.67571 0.206748 8.8023C0.339127 8.92888 0.518671 9 0.705882 9H7.29412C7.48133 9 7.66087 8.92888 7.79325 8.8023C7.92563 8.67571 8 8.50402 8 8.325V3.11175C7.99984 2.93279 7.92536 2.76122 7.79294 2.63475ZM5.17647 2.475V0.76725L7.19765 2.7H5.41176C5.34936 2.7 5.28951 2.67629 5.24539 2.6341C5.20126 2.5919 5.17647 2.53467 5.17647 2.475ZM1.64706 4.275C1.64706 4.21533 1.67185 4.1581 1.71597 4.1159C1.7601 4.07371 1.81995 4.05 1.88235 4.05H4C4.0624 4.05 4.12225 4.07371 4.16638 4.1159C4.2105 4.1581 4.23529 4.21533 4.23529 4.275C4.23529 4.33467 4.2105 4.3919 4.16638 4.4341C4.12225 4.47629 4.0624 4.5 4 4.5H1.88235C1.81995 4.5 1.7601 4.47629 1.71597 4.4341C1.67185 4.3919 1.64706 4.33467 1.64706 4.275ZM1.88235 5.4H6.11765C6.18005 5.4 6.2399 5.42371 6.28403 5.4659C6.32815 5.5081 6.35294 5.56533 6.35294 5.625C6.35294 5.68467 6.32815 5.7419 6.28403 5.7841C6.2399 5.82629 6.18005 5.85 6.11765 5.85H1.88235C1.81995 5.85 1.7601 5.82629 1.71597 5.7841C1.67185 5.7419 1.64706 5.68467 1.64706 5.625C1.64706 5.56533 1.67185 5.5081 1.71597 5.4659C1.7601 5.42371 1.81995 5.4 1.88235 5.4ZM6.35294 6.975C6.35294 7.03467 6.32815 7.0919 6.28403 7.1341C6.2399 7.17629 6.18005 7.2 6.11765 7.2H1.88235C1.81995 7.2 1.7601 7.17629 1.71597 7.1341C1.67185 7.0919 1.64706 7.03467 1.64706 6.975C1.64706 6.91533 1.67185 6.8581 1.71597 6.8159C1.7601 6.77371 1.81995 6.75 1.88235 6.75H6.11765C6.18005 6.75 6.2399 6.77371 6.28403 6.8159C6.32815 6.8581 6.35294 6.91533 6.35294 6.975Z"
        fill={color}
      />
    </svg>
  );
}

export function CaptureServiceTransport({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      viewBox="0 0 11 6"
      fill="none"
      aria-hidden
      className={className ?? "h-2 w-3.5 shrink-0"}
    >
      <path
        d="M4.33668 0L6.11294 0.00176586C6.54748 0.0151225 6.92947 0.299869 7.2246 0.589142L8.50127 1.8338C8.51721 1.85096 8.52782 1.84512 8.55132 1.84603L9.56412 1.84822C10.3187 1.88336 10.9247 2.5576 10.9926 3.28311C11.0058 3.42311 10.9974 3.57021 10.9973 3.71091L10.9987 4.63157C10.9987 4.98419 10.7408 5.00046 10.4818 5.0008L9.99347 4.99951C9.97237 5.01144 9.96492 5.06297 9.95613 5.08595C9.51157 6.24721 7.93513 6.32167 7.3759 5.19624C7.2593 4.96159 7.37533 5.0018 7.05265 5.00117L6.65905 5.00096L3.95284 5.00857C3.79487 5.52459 3.30299 5.93915 2.76166 5.987L2.44659 5.98899C1.84007 5.94883 1.46828 5.53156 1.27106 5.00368C1.18727 4.99594 1.09966 5.00123 1.01541 5.00123H0.555093C0.476354 5.00119 0.341809 5.01873 0.27013 4.98566C0.154323 4.93226 0.0324304 4.83093 0.0179631 4.69596L0.0171663 4.68624C-0.00629697 4.42067 -0.00425232 3.90554 0.0144887 3.63358C0.0739768 2.77022 0.692457 2.08946 1.52853 1.8873L1.70644 1.84906C1.8171 1.82744 1.83812 1.78762 1.91337 1.70823L2.71406 0.873572C3.25192 0.312252 3.52351 0.00581807 4.33668 0ZM1.81348 2.58454C1.29408 2.63475 0.858214 3.06554 0.767595 3.57053C0.749493 3.67139 0.753546 3.77847 0.753319 3.88052L0.754776 4.27805L1.28511 4.27984C1.29779 4.25059 1.30143 4.22096 1.31111 4.19103C1.54538 3.46793 2.46084 3.10042 3.14714 3.39708C3.5132 3.55532 3.81595 3.88192 3.9134 4.26947C3.94473 4.27997 3.98813 4.27825 4.0213 4.27862L7.29646 4.27943C7.32117 4.24697 7.32133 4.21231 7.33594 4.17606C7.50468 3.75748 7.84902 3.46782 8.28019 3.33521C8.84183 3.19956 9.38026 3.38159 9.74229 3.84043C9.82489 3.94508 9.91872 4.09703 9.94215 4.22845C9.96105 4.33456 10.1347 4.26333 10.2612 4.28679L10.2611 3.73846C10.261 3.61178 10.2673 3.47977 10.2552 3.35366C10.2211 2.99884 9.92735 2.63584 9.56132 2.5844C9.48915 2.57426 9.40932 2.58067 9.33609 2.58053L1.81348 2.58454ZM4.31054 0.731153L4.05537 0.758749C3.98305 0.772174 3.91047 0.798344 3.84471 0.830649L3.83622 0.834588C3.67804 0.90925 3.56413 1.04266 3.44698 1.16753L2.92348 1.71808C2.88207 1.75968 2.84479 1.80564 2.80358 1.84621L5.95998 1.84705L7.2767 1.84696C7.33499 1.84671 7.39528 1.84969 7.45311 1.84374L7.44778 1.83985C7.39601 1.80123 7.34166 1.7313 7.29432 1.68425L6.71301 1.11447C6.51959 0.923014 6.33621 0.773442 6.05246 0.742404L4.31054 0.731153ZM8.54588 4.03557C8.29005 4.06038 8.05289 4.28905 8.0125 4.54122L8.01049 4.5532C7.97771 4.76448 8.06311 4.97654 8.22623 5.11314L8.23486 5.12045C8.3451 5.21293 8.51437 5.27842 8.66052 5.26477L8.70467 5.25977C8.90701 5.2331 9.09859 5.12525 9.1926 4.94093L9.19791 4.93069C9.425 4.48472 9.04288 3.97816 8.54588 4.03557ZM2.58874 4.03528C2.3082 4.0475 2.05308 4.23495 1.99458 4.51292L1.99263 4.52189C1.92498 4.8405 2.14465 5.19602 2.4735 5.25325L2.55196 5.26307C2.5763 5.26787 2.60212 5.26581 2.62681 5.26509C3.0032 5.21825 3.279 4.94077 3.22059 4.551L3.20957 4.50586C3.15557 4.31457 3.04102 4.16013 2.85417 4.08103L2.75527 4.04888C2.70196 4.03408 2.64381 4.03322 2.58874 4.03528Z"
        fill={color}
      />
    </svg>
  );
}

export function CaptureServiceDamageReport({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      viewBox="0 0 8 10"
      fill="none"
      aria-hidden
      className={className ?? "h-3 w-2.5 shrink-0"}
    >
      <path
        d="M4 5.38053C4.32691 5.38005 4.64892 5.30377 4.93887 5.15813C5.22881 5.01249 5.47821 4.80175 5.66603 4.54368C5.6693 4.53947 5.67421 4.5379 5.67749 4.53368L5.68131 4.52579C5.93952 4.16295 6.06425 3.72715 6.0356 3.28794C6.00695 2.84873 5.82656 2.43144 5.52323 2.10268C5.2199 1.77392 4.81112 1.55265 4.36215 1.47418C3.91317 1.39572 3.44988 1.46458 3.04624 1.66979C2.64259 1.87499 2.32186 2.2047 2.13524 2.60629C1.94862 3.00788 1.90687 3.45819 2.01666 3.88534C2.12645 4.31248 2.38144 4.69185 2.74094 4.96286C3.10044 5.23388 3.54371 5.38092 4 5.38053ZM5.49795 3.40947C5.49774 3.61413 5.45216 3.81637 5.36426 4.00263L4.27285 3.27158V1.99105C4.61652 2.05256 4.92709 2.228 5.15081 2.48703C5.37453 2.74605 5.49733 3.07235 5.49795 3.40947ZM3.72715 1.99105V3.40947C3.72722 3.4519 3.73793 3.49368 3.75836 3.53125C3.77879 3.56883 3.80833 3.60108 3.84447 3.62526L5.05266 4.43526C4.88632 4.5946 4.6835 4.71402 4.46055 4.78391C4.23759 4.85381 4.00073 4.87221 3.76905 4.83765C3.53736 4.80309 3.31734 4.71652 3.12669 4.58493C2.93605 4.45334 2.78012 4.2804 2.67146 4.08004C2.56281 3.87968 2.50447 3.65751 2.50114 3.43142C2.49781 3.20534 2.54959 2.98166 2.65231 2.77841C2.75502 2.57516 2.9058 2.39802 3.09249 2.26126C3.27919 2.1245 3.49658 2.03194 3.72715 1.99105ZM1.62292 6.51211C1.62292 6.44231 1.65167 6.37538 1.70284 6.32602C1.754 6.27667 1.82341 6.24895 1.89577 6.24895H4C4.07236 6.24895 4.14177 6.27667 4.19293 6.32602C4.2441 6.37538 4.27285 6.44231 4.27285 6.51211C4.27285 6.5819 4.2441 6.64883 4.19293 6.69819C4.14177 6.74754 4.07236 6.77526 4 6.77526H1.89577C1.85994 6.77526 1.82446 6.76846 1.79136 6.75523C1.75825 6.74201 1.72817 6.72262 1.70284 6.69819C1.6775 6.67375 1.6574 6.64474 1.64369 6.61281C1.62998 6.58088 1.62292 6.54666 1.62292 6.51211ZM6.37708 7.45947C6.37708 7.52927 6.34833 7.5962 6.29716 7.64556C6.24599 7.69491 6.17659 7.72263 6.10423 7.72263H1.89577C1.82341 7.72263 1.754 7.69491 1.70284 7.64556C1.65167 7.5962 1.62292 7.52927 1.62292 7.45947C1.62292 7.38968 1.65167 7.32274 1.70284 7.27339C1.754 7.22404 1.82341 7.19632 1.89577 7.19632H6.10423C6.17622 7.19631 6.24529 7.22375 6.2964 7.27265C6.3475 7.32154 6.3765 7.38794 6.37708 7.45737V7.45947ZM6.37708 8.40684C6.37708 8.47664 6.34833 8.54357 6.29716 8.59292C6.24599 8.64227 6.17659 8.67 6.10423 8.67H1.89577C1.82341 8.67 1.754 8.64227 1.70284 8.59292C1.65167 8.54357 1.62292 8.47664 1.62292 8.40684C1.62292 8.33705 1.65167 8.27011 1.70284 8.22076C1.754 8.17141 1.82341 8.14368 1.89577 8.14368H6.10423C6.17584 8.14368 6.24459 8.17082 6.29564 8.21927C6.34668 8.26771 6.37593 8.33357 6.37708 8.40263V8.40684ZM7.97872 1.73105C7.96494 1.6988 7.94473 1.66947 7.91923 1.64474L6.30014 0.078421C6.27496 0.0533974 6.24467 0.0336839 6.21119 0.0205263C6.17801 0.00708716 6.1424 0.000111139 6.10641 0H0.818554C0.60146 0 0.393257 0.0831765 0.239749 0.231232C0.0862401 0.379287 0 0.580092 0 0.789474V9.21053C0 9.41991 0.0862401 9.62071 0.239749 9.76877C0.393257 9.91682 0.60146 10 0.818554 10H7.18145C7.39854 10 7.60674 9.91682 7.76025 9.76877C7.91376 9.62071 8 9.41991 8 9.21053V1.83158C8.00011 1.79702 7.99287 1.7628 7.97872 1.73105ZM6.37926 0.9L7.07012 1.56842H6.65211C6.57975 1.56842 6.51035 1.5407 6.45918 1.49134C6.40801 1.44199 6.37926 1.37506 6.37926 1.30526V0.9ZM7.18145 9.47368H0.818554C0.746189 9.47368 0.676788 9.44596 0.625619 9.39661C0.574449 9.34726 0.545703 9.28032 0.545703 9.21053V0.789474C0.545703 0.71968 0.574449 0.652745 0.625619 0.603393C0.676788 0.554041 0.746189 0.526316 0.818554 0.526316H5.83356V1.30526C5.83356 1.51464 5.9198 1.71545 6.07331 1.86351C6.22682 2.01156 6.43502 2.09474 6.65211 2.09474H7.4543V9.21053C7.4543 9.28032 7.42555 9.34726 7.37438 9.39661C7.32321 9.44596 7.25381 9.47368 7.18145 9.47368Z"
        fill={color}
      />
    </svg>
  );
}

export function CaptureServiceSignOff({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      viewBox="0 0 8 8"
      fill="none"
      aria-hidden
      className={className ?? "size-2.5 shrink-0"}
    >
      <path
        d="M5.83057 2.32954L7.50035 4L5.83057 5.67045"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.04395 4H7.49672"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.0451 7.5H0.818137C0.733762 7.5 0.652843 7.46648 0.59318 7.40681C0.533518 7.34714 0.5 7.26621 0.5 7.18182V0.818182C0.5 0.733795 0.533518 0.652864 0.59318 0.593193C0.652843 0.533523 0.733762 0.5 0.818137 0.5H3.0451"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type MemberVehicleRequestIconProps = {
  className?: string;
  highlighted?: boolean;
};

const MEMBER_REQUEST_ICON_MUTED = "#3A3A42";
const MEMBER_REQUEST_ICON_ACCENT = "#FB923C";
const MEMBER_REQUEST_ICON_GOLD = "#C9A86C";

export function MemberVehicleTransportIcon({
  className,
  highlighted = false,
}: MemberVehicleRequestIconProps) {
  const activeStroke = highlighted ? MEMBER_REQUEST_ICON_ACCENT : MEMBER_REQUEST_ICON_MUTED;
  const trackStroke = highlighted ? MEMBER_REQUEST_ICON_GOLD : MEMBER_REQUEST_ICON_MUTED;

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 10C3 6.13 6.13 3 10 3"
        stroke={activeStroke}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M10 3C13.87 3 17 6.13 17 10C17 13.87 13.87 17 10 17"
        stroke={trackStroke}
        strokeOpacity={0.4}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M10 7V10L12.5 12.5"
        stroke={activeStroke}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MemberVehicleDetailingIcon({
  className,
  highlighted = false,
}: MemberVehicleRequestIconProps) {
  const fill = highlighted ? MEMBER_REQUEST_ICON_GOLD : MEMBER_REQUEST_ICON_MUTED;

  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="member-vehicle-detailing-mask"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="19"
        height="19"
      >
        <path d="M0 0H18.8423V18.8423H0V0Z" fill="white" />
      </mask>
      <g mask="url(#member-vehicle-detailing-mask)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.11785 6.49524C6.0618 6.51897 5.0181 6.57326 4.35996 6.69756C4.16385 6.73459 3.94546 6.81344 3.72742 7.06893C3.4689 7.37188 2.90725 8.52885 2.59291 9.21448C2.56819 9.26835 2.5435 9.32182 2.51835 9.37463H2.05225L2.22166 9.05284C2.24376 9.01086 2.21684 8.95904 2.17121 8.95663C1.31119 8.91123 0.500239 9.09112 0.0649182 9.56559C-0.0279249 9.66681 -0.0216091 9.82844 0.088302 9.90858C0.411372 10.1442 0.964148 10.204 1.66148 10.182C1.70827 10.1805 1.75018 10.1513 1.77001 10.1068L1.87479 9.87154H2.23907C2.18887 9.94338 2.13406 10.0129 2.07299 10.0797C1.94875 10.2157 1.67038 10.3534 1.4007 10.4868C1.23439 10.5691 1.07128 10.6498 0.949745 10.7274C0.914646 10.7498 0.879946 10.772 0.845889 10.7938C0.568104 10.9722 0.381636 11.227 0.25648 11.5234C0.16882 11.731 0.111238 11.959 0.0734272 12.1956C0.000883567 12.6495 0.00111614 13.1346 0.0013233 13.5668C0.0013779 13.6807 0.0014306 13.7909 0.000151145 13.8958L7.63295e-05 14.0469C-0.000152457 14.3553 -0.000389899 14.6753 0.00774171 14.9985C0.0263236 15.737 0.088607 16.4917 0.29456 17.1604C0.29456 17.7017 0.416377 18.8417 1.13115 18.8417H3.53305C4.03465 18.8643 4.12175 17.9736 4.12175 17.6645H14.7206C14.7206 18.2827 14.7206 18.8417 15.3094 18.8417H17.7113C18.1733 18.8417 18.5479 18.1497 18.5479 17.2961V17.1604C18.5534 17.1427 18.558 17.1246 18.5619 17.1063C18.782 16.0689 18.8423 14.9244 18.8423 13.8958C18.8295 12.846 18.8097 11.316 17.9966 10.7938C17.963 10.7723 17.9288 10.7505 17.8943 10.7284L17.8927 10.7274C17.7712 10.6498 17.6081 10.5691 17.4417 10.4868C17.172 10.3534 16.8937 10.2157 16.7695 10.0797C16.7104 10.015 16.6572 9.94791 16.6083 9.87861L16.9618 9.87855L17.0665 10.1138C17.0864 10.1583 17.1283 10.1875 17.1751 10.189C17.8724 10.2111 18.4252 10.1512 18.7483 9.91558C18.8582 9.83545 18.8645 9.67382 18.7716 9.5726C18.3363 9.09812 17.5254 8.9183 16.6654 8.96364C16.6197 8.96605 16.5928 9.01787 16.6149 9.05985L16.7843 9.3817H16.3274C16.3011 9.32653 16.2753 9.27077 16.2495 9.21448C15.9352 8.52885 15.3735 7.37188 15.115 7.06893C14.897 6.81344 14.6798 6.72759 14.4825 6.69756C14.3443 6.6766 14.2003 6.65758 14.0515 6.64038C14.0258 6.7585 13.9943 6.87438 13.9572 6.98779C14.2896 7.02577 14.5319 7.06828 14.6342 7.1145C15.0288 7.29292 15.6459 8.46167 16.1748 9.83533C16.2428 10.0117 16.1069 10.1989 15.9241 10.1854C10.9281 9.96987 7.90687 9.97782 2.91842 10.1856C2.73566 10.199 2.59985 10.0119 2.66749 9.83539C3.19357 8.46308 3.79416 7.30187 4.20851 7.1145C4.49309 6.9859 5.83654 6.88616 7.19328 6.83181C7.16284 6.7217 7.13758 6.60941 7.11785 6.49524ZM2.91842 17.1063C2.85209 16.567 2.30352 16.054 1.65931 15.788C1.3066 15.6423 0.923048 15.484 0.571073 15.2545C0.59614 15.8015 0.706073 16.383 1.49299 16.6385L2.91842 17.1063ZM1.09349 12.3462L0.983567 12.3157C0.893136 12.2905 0.795922 12.3137 0.753962 12.4015C0.704077 12.5059 0.661405 12.6526 0.627796 12.7935C0.561158 13.0728 0.596877 13.2743 0.798836 13.5808C1.17777 14.1556 1.77006 14.1556 2.66749 14.1556C3.23864 14.1556 3.87957 13.9636 4.12187 13.8267C3.63796 13.053 2.4193 12.7145 1.09349 12.3462ZM15.9057 17.1063C15.9721 16.567 16.5309 16.054 17.1751 15.788C17.5278 15.6423 17.9113 15.484 18.2634 15.2545C18.2383 15.8015 18.1181 16.383 17.3311 16.6385L15.9057 17.1063ZM14.7206 13.8267C15.2179 13.0316 16.4909 12.6707 17.8589 12.2902C17.9493 12.2652 18.0466 12.2883 18.0885 12.3761C18.1383 12.4805 18.181 12.6272 18.2147 12.7681C18.2813 13.0474 18.2456 13.249 18.0436 13.5553C17.6646 14.1303 17.0665 14.1328 16.1748 14.1303C15.6097 14.1303 14.9629 13.9636 14.7206 13.8267ZM5.75737 16.4868C5.52611 16.4868 4.71057 16.6626 4.71057 16.8794C4.71057 16.9878 4.80431 17.0757 4.91993 17.0757H13.9223C14.038 17.0757 14.1317 16.9878 14.1317 16.8794C14.1317 16.6626 13.3162 16.4868 13.0849 16.4868H5.75737ZM4.71057 13.8371C4.71057 13.6746 4.84238 13.5427 5.00498 13.5427H13.8373C13.9999 13.5427 14.1317 13.6746 14.1317 13.8371C14.1317 14.6501 13.4726 15.3092 12.6597 15.3092H6.18262C5.36963 15.3092 4.71057 14.6501 4.71057 13.8371Z"
          fill={fill}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.121 1.17744C15.8678 1.17744 15.625 1.27803 15.4459 1.45706L13.9415 2.96151L14.1316 3.15157L13.3351 3.94806L13.521 4.1339C13.6383 4.2512 13.6383 4.44139 13.521 4.55869L13.3191 4.7605C13.4632 5.10778 13.5428 5.48861 13.5428 5.88802C13.5428 7.51399 12.2246 8.83212 10.5986 8.83212C8.97268 8.83212 7.65454 7.51399 7.65454 5.88802C7.65454 4.26203 8.97268 2.94391 10.5986 2.94391C10.998 2.94391 11.3789 3.02344 11.7262 3.16754L11.928 2.96572C12.0453 2.84842 12.2355 2.84842 12.3527 2.96572L12.5386 3.15157L13.3351 2.35509L13.5251 2.54515L15.0296 1.0407C15.3191 0.751238 15.7117 0.588623 16.121 0.588623H16.2069C17.0119 0.588623 17.6645 1.2412 17.6645 2.04619C17.6645 2.29985 17.5983 2.54912 17.4724 2.76935L17.1784 3.28393C16.9652 3.65716 17.2347 4.12155 17.6645 4.12155H18.5477C18.7103 4.12155 18.8421 4.25337 18.8421 4.41596C18.8421 4.57856 18.7103 4.71037 18.5477 4.71037H17.6645C16.7825 4.71037 16.2296 3.75757 16.6672 2.99179L16.9612 2.47721C17.0362 2.34595 17.0757 2.19738 17.0757 2.04619C17.0757 1.5664 16.6867 1.17744 16.2069 1.17744H16.121ZM10.7645 4.12923C10.7099 4.12415 10.6546 4.12155 10.5986 4.12155C9.62303 4.12155 8.83218 4.91243 8.83218 5.88802C8.83218 6.86363 9.62303 7.65448 10.5986 7.65448C11.5743 7.65448 12.3651 6.86363 12.3651 5.88802C12.3651 5.8321 12.3625 5.77679 12.3575 5.7222L11.3439 6.73574C10.904 7.17565 10.1908 7.17565 9.75092 6.73574C9.31101 6.29583 9.31101 5.58266 9.75092 5.14278L10.7645 4.12923Z"
          fill={fill}
        />
        <path
          d="M5.00501 1.76648L5.4026 2.84094L6.47707 3.23853L5.4026 3.63612L5.00501 4.71059L4.60742 3.63612L3.53296 3.23853L4.60742 2.84094L5.00501 1.76648Z"
          fill={fill}
        />
        <path
          d="M1.4721 4.71057L1.71065 5.35525L2.35533 5.5938L1.71065 5.83236L1.4721 6.47704L1.23354 5.83236L0.588867 5.5938L1.23354 5.35525L1.4721 4.71057Z"
          fill={fill}
        />
        <path
          d="M1.76631 1.17737L1.92535 1.60715L2.35513 1.76619L1.92535 1.92522L1.76631 2.35501L1.60728 1.92522L1.17749 1.76619L1.60728 1.60715L1.76631 1.17737Z"
          fill={fill}
        />
      </g>
    </svg>
  );
}

export function MemberVehicleMaintenanceIcon({
  className,
  highlighted = false,
}: MemberVehicleRequestIconProps) {
  const fill = highlighted ? MEMBER_REQUEST_ICON_GOLD : MEMBER_REQUEST_ICON_MUTED;

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.00371 18.9759C1.54895 19.521 2.48695 19.5506 3.04121 18.9963L8.73918 13.2983C9.13078 13.4481 9.55578 13.5304 10 13.5304C11.9496 13.5304 13.5305 11.9496 13.5305 9.99995C13.5305 9.4562 13.4074 8.94136 13.1879 8.48159L10.4895 11.18H9.51328L8.82305 10.4894V9.51362L11.5227 6.81401C11.0617 6.59331 10.5453 6.46948 10 6.46948C8.05039 6.46948 6.46953 8.05034 6.46953 9.99995C6.46953 10.4442 6.55184 10.8692 6.70164 11.2608L1.00371 16.9588C0.44668 17.5158 0.44668 18.4189 1.00371 18.9759Z"
        fill={fill}
      />
      <path
        d="M20 11.25V8.75L18.6348 8.5793C18.5402 8.00273 18.3898 7.44531 18.1891 6.9125L19.2852 6.08242L18.0352 3.91758L16.7668 4.45273C16.4012 4.00742 15.9926 3.59883 15.5473 3.2332L16.0824 1.96484L13.9176 0.714844L13.0875 1.81094C12.5547 1.61016 11.9973 1.45977 11.4207 1.36523L11.25 0H8.75L8.5793 1.36523C8.00273 1.45977 7.44531 1.61016 6.9125 1.81094L6.08242 0.714844L3.91758 1.96484L4.45273 3.2332C4.00742 3.59883 3.59883 4.00742 3.2332 4.45273L1.96484 3.91758L0.714844 6.08242L1.81094 6.9125C1.61016 7.44531 1.45977 8.00273 1.36523 8.5793L0 8.75V11.25L1.36523 11.4207C1.45977 11.9973 1.61016 12.5547 1.81094 13.0875L0.714844 13.9176L1.32715 14.978L3.96754 12.3377C3.68539 11.6123 3.53027 10.8239 3.53027 10C3.53027 6.43258 6.43258 3.53027 10 3.53027C13.5674 3.53027 16.4697 6.43258 16.4697 10C16.4697 13.5674 13.5674 16.4697 10 16.4697C9.17605 16.4697 8.38781 16.3145 7.66246 16.0323L5.02199 18.6728L6.08242 19.2852L6.9125 18.1891C7.44531 18.3898 8.00273 18.5402 8.5793 18.6348L8.75 20H11.25L11.4207 18.6348C11.9973 18.5402 12.5547 18.3898 13.0875 18.1891L13.9176 19.2852L16.0824 18.0352L15.5473 16.7668C15.9926 16.4012 16.4012 15.9926 16.7668 15.5473L18.0352 16.0824L19.2852 13.9176L18.1891 13.0875C18.3898 12.5547 18.5402 11.9973 18.6348 11.4207L20 11.25Z"
        fill={fill}
      />
    </svg>
  );
}

export function MemberVehicleSourcingIcon({
  className,
  highlighted = false,
}: MemberVehicleRequestIconProps) {
  const fill = highlighted ? MEMBER_REQUEST_ICON_GOLD : MEMBER_REQUEST_ICON_MUTED;

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.8529 16.3664C20.3434 15.4021 20.1977 14.1973 19.3908 13.3909C18.3886 12.3883 16.7625 12.3883 15.7605 13.3909C14.7579 14.3931 14.7579 16.0192 15.7605 17.0212C16.5667 17.8281 17.7715 17.9741 18.736 17.4833L20.2107 18.9582L21.3278 17.8411L19.8529 16.3664ZM17.5758 16.1934C17.0303 16.1934 16.5883 15.7514 16.5883 15.2062C16.5883 14.6606 17.0303 14.2187 17.5758 14.2187C18.1211 14.2187 18.563 14.6606 18.563 15.2062C18.563 15.7514 18.1211 16.1934 17.5758 16.1934Z"
        fill={fill}
      />
      <path
        d="M13.4287 16.5885V14.2187C13.4287 12.4807 14.8503 11.0591 16.5883 11.0591H21.3278V4.73962H15.0084L10.2688 9.47917L2.36963 11.0591V16.5885H4.34436V16.1935C4.34436 14.0159 6.11624 12.244 8.29407 12.244C10.4719 12.244 12.2438 14.0159 12.2438 16.1935V16.5885H13.4287Z"
        fill={fill}
      />
      <path
        d="M8.29411 13.429C6.7675 13.429 5.5293 14.6672 5.5293 16.1935C5.5293 17.7201 6.7675 18.9584 8.29411 18.9584C9.82072 18.9584 11.0589 17.7201 11.0589 16.1935C11.0589 14.6672 9.82072 13.429 8.29411 13.429ZM8.29411 17.3784C7.64006 17.3784 7.10923 16.8478 7.10923 16.1935C7.10923 15.5395 7.64006 15.0086 8.29411 15.0086C8.94817 15.0086 9.479 15.5395 9.479 16.1935C9.479 16.8478 8.94817 17.3784 8.29411 17.3784Z"
        fill={fill}
      />
    </svg>
  );
}

export function MemberGarageChevronRight({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M4.5 2.5L8 6L4.5 9.5"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MemberGarageRefreshIcon({
  className,
  color = "currentColor",
}: TopbarIconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M13.5 8A5.5 5.5 0 1 1 8 2.5"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M13.5 3.5V6.5H10.5"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MemberGarageSuccessCheck({
  className,
  color = "#0D0D0D",
}: TopbarIconProps) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M7 14.5L11.5 19L21 9.5"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MemberGarageTransportSuccessCheck({
  className,
  color = "white",
}: TopbarIconProps) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M6.5 13.5L10.5 17.5L19.5 8"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MemberGarageReviewTargetIcon({
  className,
  color = "#C9A84C",
}: TopbarIconProps) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M11 15C13.2091 15 15 13.2091 15 11C15 8.79086 13.2091 7 11 7C8.79086 7 7 8.79086 7 11C7 13.2091 8.79086 15 11 15Z"
        stroke={color}
        strokeWidth="1.4"
      />
      <path d="M11 1V4.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M11 17.5V21" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M1 11H4.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M17.5 11H21" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function MemberGarageConciergeChatIcon({
  className,
  color = "#C9A84C",
}: TopbarIconProps) {
  return (
    <svg
      width="15"
      height="13"
      viewBox="0 0 15 13"
      fill="none"
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.1499 0.650391H13.1499C13.2825 0.650391 13.4097 0.703069 13.5035 0.796837C13.5972 0.890606 13.6499 1.01778 13.6499 1.15039V8.15039C13.6499 8.283 13.5972 8.41018 13.5035 8.50394C13.4097 8.59771 13.2825 8.65039 13.1499 8.65039H3.6499L0.649902 11.1504V1.15039C0.649902 1.01778 0.702581 0.890606 0.796349 0.796837C0.890117 0.703069 1.01729 0.650391 1.1499 0.650391Z"
        stroke={color}
        strokeWidth="1.3"
      />
    </svg>
  );
}

export function MemberServiceCentreStarIcon({
  className,
  color = "#C9A84C",
}: TopbarIconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.00002 2L10.5 5.5H14L11.3 7.7L12.3 11L9.00002 9.2L5.70002 11L6.70002 7.7L3.90002 5.5H7.50002L9.00002 2Z" stroke="#C9A84C" stroke-width="1.3" stroke-linejoin="round" />
      <path d="M9 13V16M6 16H12" stroke="#C9A84C" stroke-width="1.3" stroke-linecap="round" />
    </svg>

  );
}

export function MemberServiceCentreWorkshopIcon({
  className,
  color = "#C9A84C",
}: TopbarIconProps) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 8H3C2.44772 8 2 8.44772 2 9V15C2 15.5523 2.44772 16 3 16H15C15.5523 16 16 15.5523 16 15V9C16 8.44772 15.5523 8 15 8Z" stroke="#F1EAD7" stroke-opacity="0.6" stroke-width="1.3" />
      <path d="M5 8V6C5 4.93913 5.42143 3.92172 6.17157 3.17157C6.92172 2.42143 7.93913 2 9 2C10.0609 2 11.0783 2.42143 11.8284 3.17157C12.5786 3.92172 13 4.93913 13 6V8" stroke="#F1EAD7" stroke-opacity="0.6" stroke-width="1.3" stroke-linecap="round" />
      <path d="M9 13.5C9.82843 13.5 10.5 12.8284 10.5 12C10.5 11.1716 9.82843 10.5 9 10.5C8.17157 10.5 7.5 11.1716 7.5 12C7.5 12.8284 8.17157 13.5 9 13.5Z" fill="#F1EAD7" fill-opacity="0.6" />
    </svg>

  );
}

export function MemberGarageReviewLockIcon({
  className,
  color = "#C9A84C",
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
        d="M5.5 8V5.75C5.5 3.95507 6.95507 2.5 8.75 2.5H9.25C11.0449 2.5 12.5 3.95507 12.5 5.75V8"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M4.5 8H13.5C14.3284 8 15 8.67157 15 9.5V13.5C15 14.3284 14.3284 15 13.5 15H4.5C3.67157 15 3 14.3284 3 13.5V9.5C3 8.67157 3.67157 8 4.5 8Z"
        stroke={color}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M9 11.25V12.75"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MemberGarageSourcingReviewIcon({
  className,
  color = "#C9A84C",
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
        d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z"
        stroke={color}
        strokeWidth="1.275"
      />
      <path
        d="M15.7498 15.75L12.4873 12.4875"
        stroke={color}
        strokeWidth="1.275"
      />
    </svg>
  );
}

export function MemberGarageUploadOutlineIcon({
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
        d="M7 9.91667V4.08333"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M4.66667 6.41667L7 4.08333L9.33333 6.41667"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.91667 11.0833H11.0833"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MemberVehicleDocumentFileIcon({
  className,
  color = "currentColor",
  showCheck = false,
}: TopbarIconProps & { showCheck?: boolean }) {
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
        d="M10.5 1.5H4.5C3.67157 1.5 3 2.17157 3 3V15C3 15.8284 3.67157 16.5 4.5 16.5H13.5C14.3284 16.5 15 15.8284 15 15V6L10.5 1.5Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 1.5V6H15"
        stroke={color}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {showCheck ? (
        <path
          d="M6.75 11.25L7.875 12.375L11.25 9"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <>
          <path d="M6.75 9.75H11.25" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
          <path d="M6.75 12H9.75" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export function HelpCall({
  stroke = "#0A0806",
  className,
}: {
  stroke?: string;
  className?: string;
}) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M18.3332 14.1V16.6C18.3341 16.8321 18.2866 17.0618 18.1936 17.2745C18.1006 17.4871 17.9643 17.678 17.7933 17.8349C17.6222 17.9918 17.4203 18.1113 17.2005 18.1856C16.9806 18.26 16.7477 18.2876 16.5165 18.2667C13.9522 17.9881 11.489 17.1118 9.32486 15.7084C7.31139 14.4289 5.60431 12.7219 4.32486 10.7084C2.91651 8.53438 2.04007 6.0592 1.76653 3.48337C1.7457 3.25293 1.77309 3.02067 1.84695 2.80139C1.9208 2.58211 2.03951 2.38061 2.1955 2.20972C2.3515 2.03883 2.54137 1.9023 2.75302 1.80881C2.96468 1.71532 3.19348 1.66692 3.42486 1.66671H5.92486C6.32928 1.66273 6.72136 1.80594 7.028 2.06965C7.33464 2.33336 7.53493 2.69958 7.59153 3.10004C7.69705 3.9001 7.89274 4.68565 8.17486 5.44171C8.28698 5.73998 8.31125 6.06414 8.24478 6.37577C8.17832 6.68741 8.02392 6.97347 7.79986 7.20004L6.74153 8.25837C7.92783 10.3447 9.65524 12.0721 11.7415 13.2584L12.7999 12.2C13.0264 11.976 13.3125 11.8216 13.6241 11.7551C13.9358 11.6887 14.2599 11.7129 14.5582 11.825C15.3143 12.1072 16.0998 12.3029 16.8999 12.4084C17.3047 12.4655 17.6744 12.6694 17.9386 12.9813C18.2029 13.2932 18.3433 13.6914 18.3332 14.1Z"
        stroke={stroke}
        strokeWidth="1.33333"
      />
    </svg>
  );
}

export function HelpMessage({
  stroke = "#D4A847",
  className,
}: {
  stroke?: string;
  className?: string;
}) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M17.5 10C17.5 13.6667 14.1667 16.6667 10 16.6667C8.85489 16.6759 7.72017 16.4489 6.66667 16L2.5 17.5L4 14C3.07477 12.8673 2.5477 11.4618 2.5 10C2.5 6.33337 5.83333 3.33337 10 3.33337C14.1667 3.33337 17.5 6.33337 17.5 10Z"
        stroke={stroke}
        strokeWidth="1.33333"
      />
    </svg>
  );
}

export function HelpRequest({
  stroke = "#D4A847",
  className,
}: {
  stroke?: string;
  className?: string;
}) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M11.6663 1.66663H4.99967C4.55765 1.66663 4.13372 1.84222 3.82116 2.15478C3.5086 2.46734 3.33301 2.89127 3.33301 3.33329V16.6666C3.33301 17.1087 3.5086 17.5326 3.82116 17.8451C4.13372 18.1577 4.55765 18.3333 4.99967 18.3333H14.9997C15.4417 18.3333 15.8656 18.1577 16.1782 17.8451C16.4907 17.5326 16.6663 17.1087 16.6663 16.6666V6.66663L11.6663 1.66663Z"
        stroke={stroke}
        strokeWidth="1.33333"
      />
      <path
        d="M11.667 1.66663V6.66663H16.667"
        stroke={stroke}
        strokeWidth="1.33333"
      />
    </svg>
  );
}

export function HelpTopicVehicles({
  stroke = "#D4A847",
  className,
}: {
  stroke?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={className ?? "size-5"}
    >
      <path
        d="M4.16699 14.1667H15.8337L14.5837 8.33337H5.41699L4.16699 14.1667Z"
        stroke={stroke}
      />
      <path
        d="M6.25 15.8333C6.94036 15.8333 7.5 15.2736 7.5 14.5833C7.5 13.8929 6.94036 13.3333 6.25 13.3333C5.55964 13.3333 5 13.8929 5 14.5833C5 15.2736 5.55964 15.8333 6.25 15.8333Z"
        stroke={stroke}
      />
      <path
        d="M13.75 15.8333C14.4404 15.8333 15 15.2736 15 14.5833C15 13.8929 14.4404 13.3333 13.75 13.3333C13.0596 13.3333 12.5 13.8929 12.5 14.5833C12.5 15.2736 13.0596 15.8333 13.75 15.8333Z"
        stroke={stroke}
      />
    </svg>
  );
}

export function HelpTopicEvents({
  stroke = "#D4A847",
  className,
}: {
  stroke?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className ?? "size-5"}
    >
      <path
        d="M12.6667 2.66663H3.33333C2.59695 2.66663 2 3.26358 2 3.99996V13.3333C2 14.0697 2.59695 14.6666 3.33333 14.6666H12.6667C13.403 14.6666 14 14.0697 14 13.3333V3.99996C14 3.26358 13.403 2.66663 12.6667 2.66663Z"
        stroke={stroke}
      />
    </svg>
  );
}

export function HelpTopicBilling({
  stroke = "#D4A847",
  className,
}: {
  stroke?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className ?? "size-5"}
    >
      <path
        d="M12.6667 3.33337H3.33333C2.59695 3.33337 2 3.93033 2 4.66671V11.3334C2 12.0698 2.59695 12.6667 3.33333 12.6667H12.6667C13.403 12.6667 14 12.0698 14 11.3334V4.66671C14 3.93033 13.403 3.33337 12.6667 3.33337Z"
        stroke={stroke}
      />
      <path d="M2 6.66663H14" stroke={stroke} />
    </svg>
  );
}

export function HelpTopicMembership({
  stroke = "#D4A847",
  className,
}: {
  stroke?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className ?? "size-5"}
    >
      <g clipPath="url(#help-topic-membership-clip)">
        <path
          d="M7.99967 1.33337L9.99967 6.00004H14.6663L10.9997 8.66671L12.333 13.3334L7.99967 10.6667L3.66634 13.3334L4.99967 8.66671L1.33301 6.00004H5.99967L7.99967 1.33337Z"
          stroke={stroke}
        />
      </g>
      <defs>
        <clipPath id="help-topic-membership-clip">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function HelpSearch({
  stroke = "#D4A847",
  className,
}: {
  stroke?: string;
  className?: string;
}) {
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
        d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z"
        stroke={stroke}
        strokeWidth="1.275"
      />
      <path
        d="M15.7498 15.75L12.4873 12.4875"
        stroke={stroke}
        strokeWidth="1.275"
      />
    </svg>
  );
}

export function HelpFaqChevron({
  open = false,
  stroke = "#D4A847",
  className,
}: {
  open?: boolean;
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
      className={`shrink-0 transition-transform ${open ? "rotate-180" : ""} ${className ?? ""}`}
    >
      <path
        d="M3.5 5.25L7 8.75L10.5 5.25"
        stroke={stroke}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getNavFill(active?: boolean, inverted?: boolean, fill?: string) {
  if (fill) return fill;
  if (inverted && active) return "var(--dark)";
  return active ? "var(--nav-icon-active)" : "var(--muted)";
}

export function TermsPrivacy({
  active,
  inverted,
  stroke: fillOverride,
  className,
}: SvgIconProps) {
  const fill = getNavFill(active, inverted, fillOverride);

  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      aria-hidden
      className={className}
    >
      <g clipPath="url(#terms-privacy-clip)">
        <path
          d="M11.6924 2.11755L6.84023 0.0939209C6.64219 0.00759277 6.41367 0.00759277 6.21309 0.0939209L1.36348 2.11501C1.06133 2.24197 0.863281 2.53396 0.863281 2.8615V7.34802C0.863281 10.4685 3.40488 13.0051 6.52539 13.0051C9.6459 13.0051 12.1875 10.466 12.1875 7.34802V2.8615C12.1875 2.5365 11.992 2.24451 11.6924 2.11755ZM11.1719 7.35056C11.1719 9.90994 9.08477 11.992 6.52539 11.992C3.96602 11.992 1.87891 9.90994 1.87891 7.35056V3.00115L6.52539 1.06384L11.1719 3.00115V7.35056Z"
          fill={fill}
        />
        <path
          d="M4.62617 6.11916C4.45098 5.9008 4.13105 5.86525 3.91269 6.04045C3.69433 6.21564 3.65879 6.53556 3.83398 6.75392L4.97148 8.17326C4.97402 8.1758 4.97656 8.17834 4.97656 8.18088C4.9791 8.18595 4.98418 8.18849 4.98672 8.19357C4.98926 8.19611 4.9918 8.20119 4.99687 8.20373L5.00957 8.21642C5.01211 8.21896 5.01719 8.2215 5.01973 8.22658L5.03242 8.23927L5.04258 8.24943C5.04765 8.25197 5.05019 8.25705 5.05527 8.25959C5.06289 8.26466 5.07051 8.27228 5.07812 8.27736C5.08066 8.27736 5.08066 8.2799 5.0832 8.2799C5.09082 8.28498 5.09844 8.29005 5.10351 8.29259C5.10605 8.29513 5.10859 8.29513 5.11113 8.29767C5.11875 8.30021 5.12383 8.30529 5.13144 8.30783C5.13398 8.31037 5.13652 8.31037 5.13906 8.31291C5.14414 8.31545 5.15176 8.31798 5.15683 8.32306C5.15937 8.3256 5.16191 8.3256 5.16445 8.32814C5.16953 8.33068 5.17715 8.33322 5.18223 8.33576C5.18476 8.33576 5.1873 8.3383 5.19238 8.3383C5.19746 8.34084 5.20508 8.34338 5.21015 8.34338C5.21269 8.34338 5.21777 8.34591 5.22031 8.34591C5.22539 8.34845 5.23301 8.34845 5.23808 8.35099C5.24062 8.35099 5.2457 8.35353 5.24824 8.35353C5.25332 8.35607 5.26094 8.35607 5.26601 8.35861C5.26855 8.35861 5.27363 8.36115 5.27617 8.36115C5.28125 8.36115 5.28887 8.36369 5.29394 8.36369C5.29902 8.36369 5.30156 8.36369 5.30664 8.36623C5.31172 8.36623 5.3168 8.36623 5.32441 8.36877H5.36504C5.37773 8.36877 5.39043 8.36877 5.40566 8.36623H5.41582C5.42598 8.36623 5.43613 8.36369 5.44629 8.36369C5.45137 8.36369 5.4539 8.36115 5.45898 8.36115C5.4666 8.35861 5.47676 8.35861 5.48437 8.35607C5.48945 8.35607 5.49453 8.35353 5.49961 8.35099L5.52246 8.34338C5.52754 8.34084 5.53262 8.34084 5.53769 8.3383L5.56055 8.33068L5.57578 8.32306C5.5834 8.32052 5.59101 8.31545 5.59609 8.31291L5.61133 8.30529C5.62402 8.29767 5.63418 8.29259 5.64687 8.28498L9.30566 5.85255C9.53926 5.69767 9.60273 5.38283 9.44785 5.14923C9.29297 4.91564 8.97812 4.85216 8.74453 5.00705L5.47168 7.18302L4.62617 6.11916Z"
          fill={fill}
        />
      </g>
      <defs>
        <clipPath id="terms-privacy-clip">
          <rect width="13" height="13" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function HelpSupport({
  active,
  inverted,
  stroke: strokeOverride,
  className,
}: SvgIconProps) {
  const stroke = getNavStroke(active, inverted, strokeOverride);

  return (
    <svg
      width="15"
      height="14"
      viewBox="0 0 15 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M7.0127 13.5C10.6096 13.5 13.5254 10.5899 13.5254 7C13.5254 3.41015 10.6096 0.5 7.0127 0.5C3.41583 0.5 0.5 3.41015 0.5 7C0.5 10.5899 3.41583 13.5 7.0127 13.5Z"
        stroke={stroke}
      />
      <path
        d="M4.95508 5.44537C4.95508 4.3419 5.84717 3.44739 6.94765 3.44739C8.04812 3.44739 8.96464 4.20806 8.94026 5.44537C8.96464 7.41028 6.95669 7.02161 6.95669 8.58168"
        stroke={stroke}
        strokeLinecap="round"
      />
      <path
        d="M7.03027 10.3739V10.7466"
        stroke={stroke}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AskSteve({
  active,
  className,
}: {
  active?: boolean;
  className?: string;
}) {
  if (active) {
    return (
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        aria-hidden
        className={className}
      >
        <g filter="url(#ask-steve-active-filter)">
          <rect
            x="6"
            y="4"
            width="18"
            height="18"
            rx="9"
            fill="url(#ask-steve-active-gradient)"
            shapeRendering="crispEdges"
          />
          <rect
            x="6.05"
            y="4.05"
            width="17.9"
            height="17.9"
            rx="8.95"
            stroke="var(--primary)"
            strokeWidth="0.1"
            shapeRendering="crispEdges"
          />
        </g>
        <defs>
          <filter
            id="ask-steve-active-filter"
            x="0"
            y="0"
            width="30"
            height="30"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="3" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.831373 0 0 0 0 0.658824 0 0 0 0 0.278431 0 0 0 0.4 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="-1" />
            <feGaussianBlur stdDeviation="1" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
            />
            <feBlend mode="normal" in2="shape" result="effect2_innerShadow" />
          </filter>
          <radialGradient
            id="ask-steve-active-gradient"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(15 13) scale(12.7279)"
          >
            <stop stopColor="var(--muted)" stopOpacity="0.32" />
            <stop offset="0.65" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    );
  }

  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      aria-hidden
      className={className}
    >
      <g filter="url(#ask-steve-default-filter)">
        <rect
          x="6"
          y="4"
          width="18"
          height="18"
          rx="9"
          fill="url(#ask-steve-default-gradient)"
          shapeRendering="crispEdges"
        />
        <rect
          x="6.05"
          y="4.05"
          width="17.9"
          height="17.9"
          rx="8.95"
          stroke="#C9A84C"
          strokeWidth="0.1"
          shapeRendering="crispEdges"
        />
      </g>
      <defs>
        <filter
          id="ask-steve-default-filter"
          x="0"
          y="0"
          width="30"
          height="30"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.831373 0 0 0 0 0.658824 0 0 0 0 0.278431 0 0 0 0.4 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="-1" />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
          />
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow" />
        </filter>
        <radialGradient
          id="ask-steve-default-gradient"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(15 13) scale(12.7279)"
        >
          <stop stopColor="#B8AE96" stopOpacity="0.32" />
          <stop offset="0.65" stopColor="#C9A84C" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function AskStevePromptActivity({
  stroke = "currentColor",
  className,
}: {
  stroke?: string;
  className?: string;
}) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <g clipPath="url(#ask-steve-prompt-activity-clip)">
        <path
          d="M7.99967 14.6667C11.6816 14.6667 14.6663 11.6819 14.6663 8.00004C14.6663 4.31814 11.6816 1.33337 7.99967 1.33337C4.31778 1.33337 1.33301 4.31814 1.33301 8.00004C1.33301 11.6819 4.31778 14.6667 7.99967 14.6667Z"
          stroke={stroke}
          strokeWidth="1.06667"
        />
        <path d="M8 4V8L10.6667 9.33333" stroke={stroke} strokeWidth="1.06667" />
      </g>
      <defs>
        <clipPath id="ask-steve-prompt-activity-clip">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function AskStevePromptDrive({
  stroke = "currentColor",
  className,
}: {
  stroke?: string;
  className?: string;
}) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <g clipPath="url(#ask-steve-prompt-drive-clip)">
        <path
          d="M14 6.66663C14 11.3333 8 15.3333 8 15.3333C8 15.3333 2 11.3333 2 6.66663C2 5.07533 2.63214 3.5492 3.75736 2.42399C4.88258 1.29877 6.4087 0.666626 8 0.666626C9.5913 0.666626 11.1174 1.29877 12.2426 2.42399C13.3679 3.5492 14 5.07533 14 6.66663Z"
          stroke={stroke}
          strokeWidth="1.06667"
        />
        <path
          d="M8 8.66663C9.10457 8.66663 10 7.7712 10 6.66663C10 5.56206 9.10457 4.66663 8 4.66663C6.89543 4.66663 6 5.56206 6 6.66663C6 7.7712 6.89543 8.66663 8 8.66663Z"
          stroke={stroke}
          strokeWidth="1.06667"
        />
      </g>
      <defs>
        <clipPath id="ask-steve-prompt-drive-clip">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function AskStevePromptAcquisition({
  stroke = "currentColor",
  className,
}: {
  stroke?: string;
  className?: string;
}) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path
        d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
        stroke={stroke}
        strokeWidth="1.06667"
      />
      <path d="M13.9996 14L11.0996 11.1" stroke={stroke} strokeWidth="1.06667" />
    </svg>
  );
}

export function AskStevePromptRecommendations({
  stroke = "currentColor",
  className,
}: {
  stroke?: string;
  className?: string;
}) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path
        d="M12.6667 2.66663H3.33333C2.59695 2.66663 2 3.26358 2 3.99996V13.3333C2 14.0697 2.59695 14.6666 3.33333 14.6666H12.6667C13.403 14.6666 14 14.0697 14 13.3333V3.99996C14 3.26358 13.403 2.66663 12.6667 2.66663Z"
        stroke={stroke}
        strokeWidth="1.06667"
      />
    </svg>
  );
}

export function AskStevePromptVehicles({
  stroke = "currentColor",
  className,
}: {
  stroke?: string;
  className?: string;
}) {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" aria-hidden className={className ?? "size-4"}>
      <path
        d="M3.95801 13.4583H15.0413L13.8538 7.91663H5.14551L3.95801 13.4583Z"
        stroke={stroke}
        strokeWidth="1.06667"
      />
      <path
        d="M5.9375 15.0416C6.59334 15.0416 7.125 14.51 7.125 13.8541C7.125 13.1983 6.59334 12.6666 5.9375 12.6666C5.28166 12.6666 4.75 13.1983 4.75 13.8541C4.75 14.51 5.28166 15.0416 5.9375 15.0416Z"
        stroke={stroke}
        strokeWidth="1.06667"
      />
      <path
        d="M13.0625 15.0416C13.7183 15.0416 14.25 14.51 14.25 13.8541C14.25 13.1983 13.7183 12.6666 13.0625 12.6666C12.4067 12.6666 11.875 13.1983 11.875 13.8541C11.875 14.51 12.4067 15.0416 13.0625 15.0416Z"
        stroke={stroke}
        strokeWidth="1.06667"
      />
    </svg>
  );
}

export function AskStevePromptAdvisory({
  stroke = "currentColor",
  className,
}: {
  stroke?: string;
  className?: string;
}) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <g clipPath="url(#ask-steve-prompt-advisory-clip)">
        <path
          d="M7.99967 1.33337L9.99967 6.00004H14.6663L10.9997 8.66671L12.333 13.3334L7.99967 10.6667L3.66634 13.3334L4.99967 8.66671L1.33301 6.00004H5.99967L7.99967 1.33337Z"
          stroke={stroke}
          strokeWidth="1.06667"
        />
      </g>
      <defs>
        <clipPath id="ask-steve-prompt-advisory-clip">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function AskSteveSuggestionArrow({
  stroke = "currentColor",
  className,
}: {
  stroke?: string;
  className?: string;
}) {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden className={className}>
      <g opacity="0.6">
        <path
          d="M2.70801 6.50004H10.2913M6.49967 10.2917L10.2913 6.50004L6.49967 2.70837"
          stroke={stroke}
          strokeWidth="0.866667"
        />
      </g>
    </svg>
  );
}

export function IconSelectArea({ className }: { className?: string }) {
  return (
    <svg
      width="15"
      height="17"
      viewBox="0 0 13 15"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M7.86721 15C7.66005 14.9987 7.45657 14.9451 7.27561 14.8443C7.09465 14.7434 6.94205 14.5985 6.83196 14.423C5.63511 12.5419 4.55788 10.5873 3.60667 8.57075L3.24894 8.48338C2.89939 8.38782 2.57732 8.21111 2.30892 7.96763C2.04052 7.72414 1.83337 7.42075 1.7043 7.08213L0.154712 3.01437C0.0300604 2.69245 -0.0202998 2.34653 0.00738774 2.00243C0.0350753 1.65833 0.140096 1.32492 0.314617 1.02707L0.510788 0.689117C0.581554 0.568046 0.682949 0.46774 0.804778 0.398288C0.926607 0.328835 1.06457 0.292684 1.20481 0.29347H1.2147C1.35701 0.294269 1.49656 0.332846 1.61907 0.405257C1.74159 0.477668 1.84268 0.581315 1.91201 0.705603L8.9544 13.2048C9.03243 13.343 9.08112 13.4957 9.09743 13.6536C9.11374 13.8115 9.09731 13.971 9.04919 14.1222C8.95545 14.4259 8.74899 14.6822 8.47221 14.8385C8.28794 14.9438 8.07947 14.9995 7.86721 15ZM1.20481 0.911669C1.1724 0.911271 1.14047 0.919448 1.11224 0.935371C1.08401 0.951294 1.0605 0.974397 1.04408 1.00234L0.84873 1.33864C0.720748 1.55707 0.643816 1.80161 0.62369 2.05398C0.603564 2.30634 0.640766 2.55999 0.732511 2.79594L2.28292 6.86452C2.37677 7.11211 2.52785 7.334 2.72381 7.51206C2.91978 7.69012 3.15508 7.81931 3.4105 7.88908L3.90505 8.01932C3.94827 8.03089 3.98851 8.0516 4.02306 8.08003C4.05761 8.10847 4.08567 8.14398 4.10534 8.18417C5.06201 10.2194 6.14669 12.192 7.35288 14.09C7.43505 14.2241 7.56598 14.3211 7.71816 14.3606C7.87033 14.4001 8.0319 14.379 8.16889 14.3019C8.30914 14.2245 8.41378 14.0956 8.46067 13.9425C8.48334 13.8714 8.49108 13.7965 8.48342 13.7223C8.47576 13.6481 8.45286 13.5763 8.41616 13.5114L1.37378 1.01058C1.35811 0.979587 1.33384 0.95377 1.30387 0.936226C1.2739 0.918682 1.2395 0.910155 1.20481 0.911669Z"
        fill="#C9A84C"
      />
      <path
        d="M2.68336 15C2.45983 15.0005 2.24069 14.938 2.05116 14.8194C1.78103 14.6582 1.5837 14.3987 1.50044 14.0953C1.41718 13.7919 1.45443 13.4681 1.60442 13.1915C2.30997 11.8933 3.15236 10.4871 4.0409 9.12129C4.08571 9.05254 4.156 9.00441 4.2363 8.98748C4.31661 8.97056 4.40034 8.98622 4.4691 9.03104C4.53785 9.07585 4.58598 9.14614 4.60291 9.22645C4.61983 9.30675 4.60416 9.39049 4.55935 9.45924C3.67988 10.8102 2.84574 12.2032 2.15254 13.485C2.07861 13.6224 2.06066 13.7831 2.10244 13.9335C2.14422 14.0839 2.2425 14.2123 2.37674 14.2919C2.50844 14.374 2.66715 14.401 2.8186 14.3671C2.97005 14.3332 3.10207 14.241 3.18615 14.1106C3.77879 13.2154 4.40522 12.1975 5.0506 11.0814C5.09307 11.0135 5.16026 10.9646 5.238 10.9453C5.31575 10.9259 5.39798 10.9375 5.46736 10.9776C5.53673 11.0177 5.58783 11.0831 5.60988 11.1602C5.63193 11.2372 5.6232 11.3198 5.58554 11.3905C4.93356 12.5173 4.30136 13.546 3.7046 14.4477C3.5946 14.6183 3.44334 14.7583 3.26482 14.8548C3.0863 14.9514 2.8863 15.0013 2.68336 15ZM5.42976 7.88902C5.38939 7.88945 5.34934 7.88189 5.31191 7.86677C5.27448 7.85165 5.24042 7.82927 5.21168 7.80091C5.18295 7.77256 5.16011 7.7388 5.14449 7.70158C5.12887 7.66435 5.12077 7.62441 5.12066 7.58404V7.57662C5.1208 7.51435 5.13945 7.45352 5.17424 7.40188C5.6317 6.73587 6.02322 6.17949 6.31335 5.76818C6.07527 5.56851 5.91577 5.29082 5.86325 4.98456C5.81072 4.6783 5.86858 4.36334 6.02651 4.09574L8.40035 0.139264C8.44437 0.072534 8.51247 0.0253947 8.59043 0.00769382C8.66838 -0.010007 8.75016 0.00309988 8.81868 0.0442765C8.8872 0.0854531 8.93716 0.151514 8.95813 0.228659C8.97909 0.305803 8.96943 0.388064 8.93117 0.458255L6.55733 4.41473C6.51054 4.49241 6.47963 4.5786 6.46641 4.66831C6.45318 4.75802 6.4579 4.84946 6.48029 4.93733C6.50268 5.0252 6.54229 5.10776 6.59683 5.1802C6.65137 5.25264 6.71976 5.31353 6.79801 5.35934L6.90764 5.42693C6.9435 5.44909 6.97445 5.47837 6.99855 5.51297C7.02265 5.54756 7.0394 5.58673 7.04776 5.62805C7.05637 5.66934 7.05635 5.71196 7.0477 5.75324C7.03905 5.79452 7.02195 5.83356 6.99748 5.86792L6.91506 5.99156C6.62162 6.40369 6.19961 7.00458 5.69682 7.73735C5.66925 7.7836 5.63015 7.8219 5.58333 7.84848C5.53652 7.87507 5.4836 7.88904 5.42976 7.88902ZM6.3933 9.59195C6.34237 9.5917 6.29228 9.57896 6.24741 9.55486C6.17536 9.51608 6.12162 9.45031 6.09798 9.37197C6.07434 9.29364 6.08273 9.20912 6.1213 9.13696C6.74526 7.97227 7.30328 6.88836 7.61484 6.23884C7.63341 6.19936 7.66012 6.16426 7.69322 6.13585C7.72632 6.10744 7.76506 6.08635 7.80689 6.07398C7.84807 6.06147 7.89145 6.05794 7.93411 6.06363C7.97677 6.06932 8.01771 6.08409 8.05417 6.10695L8.16132 6.17289C8.2385 6.22049 8.32437 6.25228 8.41393 6.26643C8.50349 6.28058 8.59498 6.2768 8.68307 6.25532C8.7701 6.23364 8.85194 6.19485 8.92383 6.14121C8.99572 6.08758 9.05621 6.02017 9.10179 5.94292L11.4756 1.98645C11.5196 1.91971 11.5877 1.87258 11.6657 1.85487C11.7437 1.83717 11.8254 1.85028 11.894 1.89146C11.9625 1.93263 12.0124 1.9987 12.0334 2.07584C12.0544 2.15298 12.0447 2.23524 12.0064 2.30544L9.63425 6.25779C9.54688 6.4047 9.43122 6.5328 9.29398 6.63467C9.15674 6.73655 9.00064 6.81017 8.83473 6.85127C8.5673 6.91704 8.28599 6.89744 8.03026 6.79522C7.70056 7.4604 7.20602 8.41325 6.66613 9.42545C6.64022 9.47549 6.60108 9.51747 6.55298 9.54682C6.50488 9.57618 6.44966 9.59179 6.3933 9.59195Z"
        fill="#C9A84C"
      />
      <path
        d="M7.89372 4.22182C7.83765 4.22157 7.78269 4.20619 7.73464 4.17731C7.66463 4.13519 7.61414 4.06707 7.59422 3.98783C7.57429 3.90859 7.58655 3.82469 7.62831 3.75446L9.426 0.755781C9.46808 0.685388 9.5364 0.634597 9.61593 0.614579C9.69546 0.594561 9.77968 0.606956 9.85007 0.649038C9.92046 0.69112 9.97126 0.759442 9.99127 0.838974C10.0113 0.918505 9.9989 1.00273 9.95681 1.07312L8.15913 4.07098C8.13191 4.11711 8.09309 4.15531 8.04653 4.18178C7.99996 4.20824 7.94728 4.22205 7.89372 4.22182ZM8.91826 4.8359C8.86242 4.83591 8.80765 4.82051 8.76 4.79139C8.72526 4.77061 8.69494 4.74319 8.67079 4.71069C8.64664 4.67819 8.62913 4.64126 8.61925 4.60199C8.60938 4.56272 8.60734 4.5219 8.61324 4.48184C8.61915 4.44179 8.63289 4.40329 8.65368 4.36854L10.4514 1.36986C10.4713 1.33339 10.4985 1.30132 10.5311 1.27558C10.5638 1.24984 10.6013 1.23096 10.6415 1.22006C10.6816 1.20917 10.7235 1.20648 10.7647 1.21217C10.8059 1.21786 10.8455 1.23181 10.8812 1.25317C10.9169 1.27454 10.9479 1.30288 10.9724 1.33651C10.9968 1.37014 11.0143 1.40836 11.0236 1.44889C11.033 1.48941 11.0341 1.5314 11.0268 1.57235C11.0195 1.6133 11.0041 1.65237 10.9814 1.6872L9.18449 4.68506C9.15709 4.7312 9.11811 4.76939 9.07141 4.79584C9.02472 4.8223 8.97193 4.83611 8.91826 4.8359Z"
        fill="#C9A84C"
      />
    </svg>
  );
}

export function IconCalendar({ className }: { className?: string }) {
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
        d="M11.9 1.4H10.5V0.7C10.5 0.514348 10.4263 0.336301 10.295 0.205025C10.1637 0.0737498 9.98565 0 9.8 0C9.61435 0 9.4363 0.0737498 9.30503 0.205025C9.17375 0.336301 9.1 0.514348 9.1 0.7V1.4H4.9V0.7C4.9 0.514348 4.82625 0.336301 4.69497 0.205025C4.5637 0.0737498 4.38565 0 4.2 0C4.01435 0 3.8363 0.0737498 3.70503 0.205025C3.57375 0.336301 3.5 0.514348 3.5 0.7V1.4H2.1C1.54305 1.4 1.0089 1.62125 0.615076 2.01508C0.221249 2.4089 0 2.94305 0 3.5V11.9C0 12.457 0.221249 12.9911 0.615076 13.3849C1.0089 13.7788 1.54305 14 2.1 14H11.9C12.457 14 12.9911 13.7788 13.3849 13.3849C13.7788 12.9911 14 12.457 14 11.9V3.5C14 2.94305 13.7788 2.4089 13.3849 2.01508C12.9911 1.62125 12.457 1.4 11.9 1.4ZM12.6 11.9C12.6 12.0857 12.5263 12.2637 12.395 12.395C12.2637 12.5263 12.0857 12.6 11.9 12.6H2.1C1.91435 12.6 1.7363 12.5263 1.60503 12.395C1.47375 12.2637 1.4 12.0857 1.4 11.9V7H12.6V11.9ZM12.6 5.6H1.4V3.5C1.4 3.31435 1.47375 3.1363 1.60503 3.00503C1.7363 2.87375 1.91435 2.8 2.1 2.8H3.5V3.5C3.5 3.68565 3.57375 3.8637 3.70503 3.99497C3.8363 4.12625 4.01435 4.2 4.2 4.2C4.38565 4.2 4.5637 4.12625 4.69497 3.99497C4.82625 3.8637 4.9 3.68565 4.9 3.5V2.8H9.1V3.5C9.1 3.68565 9.17375 3.8637 9.30503 3.99497C9.4363 4.12625 9.61435 4.2 9.8 4.2C9.98565 4.2 10.1637 4.12625 10.295 3.99497C10.4263 3.8637 10.5 3.68565 10.5 3.5V2.8H11.9C12.0857 2.8 12.2637 2.87375 12.395 3.00503C12.5263 3.1363 12.6 3.31435 12.6 3.5V5.6Z"
        fill="#C9A84C"
      />
    </svg>
  );
}
