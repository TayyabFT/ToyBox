"use client";

import type { MessageInboxFilter } from "./types";

const filters: { id: MessageInboxFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
];

type MessageInboxTabsProps = {
  active: MessageInboxFilter;
  onChange: (filter: MessageInboxFilter) => void;
};

export function MessageInboxTabs({ active, onChange }: MessageInboxTabsProps) {
  return (
    <div className="flex items-center gap-1 border-b border-accent/8 px-5 py-4">
      {filters.map((filter) => {
        const isActive = active === filter.id;

        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onChange(filter.id)}
            className={`font-roboto cursor-pointer rounded-full border px-5 py-2 text-[11px] font-medium tracking-[0.12em] uppercase transition-colors ${
              isActive
                ? "border-accent/50 bg-transparent text-accent"
                : "border-accent/12 bg-transparent text-secondary hover:text-section-label"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
