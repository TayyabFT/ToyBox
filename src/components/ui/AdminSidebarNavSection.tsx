import Link from "next/link";
import type { AdminNavItem } from "@/lib/adminNav";

export type AdminNavBadgeTone = "gold" | "pink" | "teal";

const badgeToneClass: Record<AdminNavBadgeTone, string> = {
  gold: "bg-[#EAB308] text-[#0A0806]",
  pink: "bg-[#E57373] text-[#0A0806]",
  teal: "bg-[#EAB308] text-[#0A0806]",
};

type AdminSidebarNavSectionProps = {
  title: string;
  items: AdminNavItem[];
  pathname: string;
  isActive: (pathname: string, href: string) => boolean;
  icons: Record<string, (active: boolean) => React.ReactNode>;
  childIcons?: Record<string, (active: boolean) => React.ReactNode>;
};

export function AdminSidebarNavSection({
  title,
  items,
  pathname,
  isActive,
  icons,
  childIcons = {},
}: AdminSidebarNavSectionProps) {
  return (
    <div className="space-y-2">
      <p className="font-roboto px-3 text-[10px] font-medium tracking-[0.18em] text-[#57534E] uppercase">
        {title}
      </p>

      <ul className="space-y-0.5">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          const childActive = item.children?.some((child) =>
            isActive(pathname, child.href),
          );
          const icon = icons[item.id];

          return (
            <li key={item.id}>
              <div className="relative">
                {(active || childActive) && (
                  <span
                    aria-hidden
                    className="absolute top-1/2 -left-4 h-6 w-[3px] -translate-y-1/2 rounded-r-sm bg-[#D9B067]"
                  />
                )}

                <Link
                  href={item.href}
                  className={`relative flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                    active || childActive
                      ? "bg-[#1C1917] text-[#D9B067]"
                      : "text-[#E7E5E4] hover:bg-[#1C1917]"
                  }`}
                >
                  <span className="flex size-6 shrink-0 items-center justify-center [&_svg]:size-[16px]">
                    {icon?.(active || !!childActive)}
                  </span>

                  <span
                    className={`font-roboto flex-1 text-[13px] tracking-[0.04em] ${
                      active || childActive
                        ? "font-medium text-[#D9B067]"
                        : "font-normal text-[#E7E5E4]"
                    }`}
                  >
                    {item.label}
                  </span>

                  {item.badge && (
                    <span
                      className={`flex h-[18px] min-w-[22px] shrink-0 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold leading-none ${badgeToneClass[item.badge.tone]}`}
                    >
                      {item.badge.count}
                    </span>
                  )}
                </Link>
              </div>

              {item.children && item.children.length > 0 && (
                <ul className="mt-0.5 space-y-0.5 pl-9">
                  {item.children.map((child) => {
                    const subActive = isActive(pathname, child.href);
                    const childIcon = child.icon ? childIcons[child.icon] : undefined;

                    return (
                      <li key={child.id}>
                        <Link
                          href={child.href}
                          className={`font-roboto flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] tracking-[0.04em] transition-colors ${
                            subActive
                              ? "bg-[#1C1917] font-medium text-[#D9B067]"
                              : "text-[#A8A29E] hover:bg-[#1C1917] hover:text-[#E7E5E4]"
                          }`}
                        >
                          {childIcon && (
                            <span className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-[14px]">
                              {childIcon(subActive)}
                            </span>
                          )}
                          {child.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function adminNavStroke(active: boolean) {
  return active ? "#D9B067" : "#E7E5E4";
}
