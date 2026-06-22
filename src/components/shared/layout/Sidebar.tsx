import type { ReactNode } from "react";

type SidebarProps = {
  /** Color classes for the aside (border + background) — differs per portal. */
  className?: string;
  /** Top section (logo + portal badge), fully owned by each portal. */
  header: ReactNode;
  /** Padding/border classes for the scrollable nav container — differs per portal. */
  navWrapperClassName?: string;
  /** Nav sections. */
  children: ReactNode;
  /** Optional bottom section (e.g. staff shift card). */
  footer?: ReactNode;
};

export function Sidebar({
  className = "",
  header,
  navWrapperClassName = "",
  children,
  footer,
}: SidebarProps) {
  return (
    <aside
      className={`sidebar fixed flex h-screen w-[330px] shrink-0 flex-col overflow-hidden border-r ${className}`}
    >
      {header}

      <div
        className={`Custom__Scrollbar min-h-0 flex-1 overflow-y-auto ${navWrapperClassName}`}
      >
        <nav className="space-y-7">{children}</nav>
      </div>

      {footer}
    </aside>
  );
}
