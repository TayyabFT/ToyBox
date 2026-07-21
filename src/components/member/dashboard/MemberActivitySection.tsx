import Link from "next/link";
import type { MemberActivityItem } from "./types";
import { MemberSectionEmpty } from "./MemberSectionEmpty";
import {
  dashboardSectionHeadingClass,
  dashboardSectionHeadingPrefixClass,
  dashboardSectionHeadingAccentClass,
  dashboardSectionSubtitleClass,
} from "./dashboardStyles";

type MemberActivitySectionProps = {
  items: MemberActivityItem[];
};

function splitActivityTitle(title: string): { prefix: string; highlight: string } {
  const dashIdx = title.indexOf("—");
  if (dashIdx !== -1) {
    return {
      prefix: title.slice(0, dashIdx).trim(),
      highlight: title.slice(dashIdx + 1).trim(),
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
    <div className="relative flex gap-3 sm:gap-5">
      {/* Timeline column — node + connector */}
      <div className="relative flex w-5 shrink-0 flex-col items-center">
        {/* Outer ring + inner filled dot */}
        <span className="relative z-10 mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-accent/60">
          <span className="size-2.5 rounded-full bg-accent shadow-[0_0_6px_rgba(201,168,76,0.55)]" />
        </span>

        {/* Connector line — below node (hidden for last) */}
        {!isLast ? (
          <div className="mt-1 w-px flex-1 bg-accent/25" style={{ minHeight: 48 }} />
        ) : (
          <div className="flex-1" />
        )}
      </div>

      {/* Content */}
      <div className={`min-w-0 flex-1 ${isLast ? "pb-2" : "pb-10"}`}>
        {/* Time label */}
        <p className="font-roboto text-[9px] font-semibold tracking-[0.16em] text-accent uppercase">
          {item.timeLabel}
        </p>

        {/* Title — Copperplate, prefix foreground + em-dash + highlight gold */}
        <h3 className="font-copperplate mt-0.5 text-[12px] sm:text-[14px] leading-snug tracking-[0.03em] text-foreground uppercase">
          {titlePrefix}
          {titleHighlight && (
            <>
              {" "}
              <span className="text-accent">— {titleHighlight}</span>
            </>
          )}
        </h3>

        {/* Detail */}
        <p className="font-roboto mt-1 sm:mt-1.5 text-[11px] sm:text-[12px] leading-relaxed text-secondary/70">
          {item.detail}
        </p>
      </div>
    </div>
  );
}

export function MemberActivitySection({ items }: MemberActivitySectionProps) {
  console.log("items",items)
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className={dashboardSectionHeadingClass}>
            <span className={dashboardSectionHeadingPrefixClass}>Recent </span>
            <span className={dashboardSectionHeadingAccentClass}>Activity</span>
          </h2>
          <p className={dashboardSectionSubtitleClass}>Your last week</p>
        </div>
        <Link
          href="/member/diary"
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
      <div className="pl-0.5 pt-1">
        {items.length === 0 ? (
          <MemberSectionEmpty
            title="No Recent Activity"
            description="Your recent bookings and events will appear here."
          />
        ) : (
          <div className="flex flex-col">
            {items.map((item, index) => (
              <ActivityRow
                key={item.id}
                item={item}
                isLast={index === items.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
