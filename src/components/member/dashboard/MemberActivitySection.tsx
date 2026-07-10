import Link from "next/link";
import type { MemberActivityItem } from "./types";
import { MemberSectionEmpty } from "./MemberSectionEmpty";
import { dashboardSectionHeadingClass, dashboardSectionHeadingPrefixClass, dashboardSectionHeadingAccentClass, dashboardSectionSubtitleClass } from "./dashboardStyles";

type MemberActivitySectionProps = {
  items: MemberActivityItem[];
};

function splitActivityTitle(title: string): { prefix: string; highlight: string } {
  const dashIdx = title.indexOf("—");
  if (dashIdx !== -1) {
    return {
      prefix: title.slice(0, dashIdx).trim(),
      highlight: title.slice(dashIdx).trim(),
    };
  }

  const lastSpace = title.lastIndexOf(" ");
  if (lastSpace !== -1) {
    return {
      prefix: title.slice(0, lastSpace).trim(),
      highlight: title.slice(lastSpace + 1).trim(),
    };
  }

  return { prefix: title, highlight: "" };
}

function ActivityRow({
  item,
  isLast,
}: {
  item: MemberActivityItem;
  isLast: boolean;
}) {
  const split = splitActivityTitle(item.title);
  const titlePrefix = item.titlePrefix ?? split.prefix;
  const titleHighlight = item.titleHighlight ?? split.highlight;

  return (
    <div className="relative flex gap-4 pb-7 last:pb-0">
      {/* Timeline node + connector */}
      <div className="relative flex w-3.5 shrink-0 justify-center">
        {!isLast && (
          <span
            aria-hidden
            className="absolute top-[14px] h-[calc(100%+0.75rem)] w-px bg-accent/18"
          />
        )}
        <span className="relative z-10 mt-[3px] size-3.5 rounded-full border border-accent/70 bg-background" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 space-y-1.5 pt-0">
        <p className="font-roboto text-[9px] tracking-[0.12em] text-accent uppercase">
          {item.timeLabel}
        </p>
        <h3 className="font-roboto text-[12px] font-bold leading-snug tracking-[0.03em] uppercase">
          <span className="text-foreground">{titlePrefix}</span>
          {titleHighlight && (
            <>
              {" "}
              <span className="text-accent">{titleHighlight}</span>
            </>
          )}
        </h3>
        <p className="font-roboto text-[11px] leading-relaxed text-secondary/70">
          {item.detail}
        </p>
      </div>
    </div>
  );
}

export function MemberActivitySection({ items }: MemberActivitySectionProps) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className={dashboardSectionHeadingClass}>
            <span className={dashboardSectionHeadingPrefixClass}>Recent </span>
            <span className={dashboardSectionHeadingAccentClass}>Activity</span>
          </h2>
          <p className={dashboardSectionSubtitleClass}>
            Your last week
          </p>
        </div>
        <Link
          href="/member/events"
          className="flex shrink-0 items-center gap-1 rounded-full border border-accent/30 bg-transparent px-3 py-1.5 transition-all hover:border-accent/50 hover:bg-accent/5"
        >
          <span className="font-roboto text-[10px] font-semibold tracking-[0.14em] text-accent uppercase">
            Open Diary
          </span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path
              d="M3.5 2L7 5L3.5 8"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-accent"
            />
          </svg>
        </Link>
      </div>

      {/* Timeline */}
      <div className="pl-0.5">
        {items.length === 0 ? (
          <MemberSectionEmpty
            title="No Recent Activity"
            description="Your recent bookings and events will appear here."
          />
        ) : (
          items.map((item, index) => (
            <ActivityRow
              key={item.id}
              item={item}
              isLast={index === items.length - 1}
            />
          ))
        )}
      </div>
    </div>
  );
}
