import Link from "next/link";

const actions = [
  {
    id: "garage",
    title: "Garage",
    subtitle: "View your cars",
    href: "/member/vehicles",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2.5 10H4L5 7.5H11L12 10H13.5" stroke="var(--accent)" strokeWidth="1" />
        <path d="M2.5 10H13.5V12C13.5 12.28 13.28 12.5 13 12.5H3C2.72 12.5 2.5 12.28 2.5 12V10Z" stroke="var(--accent)" strokeWidth="1" />
        <circle cx="5" cy="11.75" r="0.75" fill="var(--accent)" />
        <circle cx="11" cy="11.75" r="0.75" fill="var(--accent)" />
      </svg>
    ),
  },
  {
    id: "concierge",
    title: "Concierge",
    subtitle: "Talk to us",
    href: "/member/concierge",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M13 9.5C13 10 12.5 10.5 12 10.5H5L3 12.5V4.5C3 4 3.5 3.5 4 3.5H12C12.5 3.5 13 4 13 4.5V9.5Z" stroke="var(--accent)" strokeWidth="1" />
      </svg>
    ),
  },
  {
    id: "book",
    title: "Book",
    subtitle: "Reserve a slot",
    href: "/member/concierge",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="3" y="4" width="10" height="9" rx="1" stroke="var(--accent)" strokeWidth="1" />
        <path d="M5.5 2.5V5M10.5 2.5V5" stroke="var(--accent)" strokeWidth="1" strokeLinecap="round" />
        <path d="M3 6.5H13" stroke="var(--accent)" strokeWidth="1" />
      </svg>
    ),
  },
  {
    id: "source",
    title: "Source",
    subtitle: "Find a car",
    href: "/member/marketplace",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="7" cy="7" r="4.5" stroke="var(--accent)" strokeWidth="1" />
        <path d="M10.5 10.5L13.5 13.5" stroke="var(--accent)" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function MemberQuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.id}
          href={action.href}
          className="flex items-center gap-3 rounded-xl border border-accent/10 bg-card px-4 py-4 transition-colors hover:border-primary/30 cursor-pointer"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-accent/22 bg-accent/6">
            {action.icon}
          </span>
          <span className="min-w-0 flex-1">
            <span className="font-copperplate block text-[11px] leading-tight text-foreground uppercase">
              {action.title}
            </span>
            <span className="font-roboto block text-[9px] tracking-[0.08em] text-secondary uppercase">
              {action.subtitle}
            </span>
          </span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 opacity-30">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      ))}
    </div>
  );
}
