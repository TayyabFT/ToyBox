"use client";

import { termsNavItems, type TermsSectionId } from "./mockData";

type TermsOnThisPageNavProps = {
  activeId: TermsSectionId;
  onSelect: (id: TermsSectionId) => void;
};

export function TermsOnThisPageNav({
  activeId,
  onSelect,
}: TermsOnThisPageNavProps) {
  return (
    <nav className="space-y-4">
      <p className="font-roboto text-[11px] tracking-[0.18em] text-secondary uppercase">
        On this page
      </p>

      <ul className="space-y-1">
        {termsNavItems.map((item) => {
          const isActive = item.id === activeId;

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className={`font-roboto flex w-full cursor-pointer items-center border-l-2 py-2 pl-3 text-left text-[13px] leading-snug tracking-[0.02em] transition-colors ${
                  isActive
                    ? "border-l-primary text-primary"
                    : "border-l-transparent text-secondary hover:text-muted"
                }`}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
