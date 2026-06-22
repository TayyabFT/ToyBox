import Link from "next/link";

export type NavBadgeTone = "gold" | "pink" | "teal";

export type SidebarNavItem = {
  id: string;
  label: string;
  href: string;
  badge?: { count: number; tone: NavBadgeTone };
};

const badgeToneClass: Record<NavBadgeTone, string> = {
  gold: "bg-[#F0C566] text-dark",
  pink: "bg-pink text-dark",
  teal: "bg-teal text-dark",
};

type SidebarNavSectionProps = {
  title: string;
  items: SidebarNavItem[];
  pathname: string;
  isActive: (pathname: string, href: string) => boolean;
  icons: Record<string, (active: boolean) => React.ReactNode>;
  activeVariant?: "gradient" | "solid";
};

export function SidebarNavSection({
  title,
  items,
  pathname,
  isActive,
  icons,
  activeVariant = "gradient",
}: SidebarNavSectionProps) {
  return (
    <div className="space-y-2">
      <p className="font-roboto px-3 text-[10px] font-medium tracking-[0.18em] text-section-label uppercase">
        {title}
      </p>

      <ul className="space-y-1">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          const icon = icons[item.id];
          const solidActive = active && activeVariant === "solid";

          return (
            <li key={item.id} className="relative">
              {active && activeVariant === "gradient" && (
                <span
                  aria-hidden
                  className="absolute top-1/2 -left-3 h-6 w-[3px] -translate-y-1/2 rounded-r-lg bg-accent"
                />
              )}

              <Link
                href={item.href}
                className={`relative flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                  solidActive
                    ? "bg-gradient-to-br from-[#F0C566] to-[#C9A227] text-dark"
                    : active
                      ? "bg-gradient-to-r from-accent/13 to-accent/3 text-accent"
                      : "text-primary hover:bg-accent/8 [&_*]:stroke-primary"
                }`}
              >
                <span className="flex size-6 shrink-0 items-center justify-center [&_svg]:size-[16px]">
                  {icon?.(active)}
                </span>

                <span
                  className={`font-roboto flex-1 text-[13px] tracking-[0.04em] ${
                    solidActive
                      ? "font-semibold text-dark"
                      : active
                        ? "font-medium text-primary"
                        : "font-normal"
                  }`}
                >
                  {item.label}
                </span>

                {item.badge && (
                  <span
                    className={`flex h-4 min-w-6 shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none ${
                      solidActive
                        ? "bg-dark/20 text-dark"
                        : badgeToneClass[item.badge.tone]
                    }`}
                  >
                    {item.badge.count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
