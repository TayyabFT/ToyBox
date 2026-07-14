import Link from "next/link";
import type { MemberNewsItem } from "./types";
import { MemberSectionEmpty } from "./MemberSectionEmpty";
import { dashboardSectionHeadingClass, dashboardSectionHeadingPrefixClass, dashboardSectionHeadingAccentClass, dashboardSectionSubtitleClass } from "./dashboardStyles";

type MemberNewsSectionProps = {
  items: MemberNewsItem[];
};

function NewsCard({ item }: { item: MemberNewsItem }) {
  const titlePrefix = item.titlePrefix ?? item.title;
  const titleHighlight = item.titleHighlight;

  return (
    <Link
      href="/member"
      className="group relative block overflow-hidden rounded-2xl border border-accent/15 card-view transition-colors hover:border-accent/28 news-card-shell"
    >
      {/* Layered gradient — visible in dark, subtle in light */}
      <div aria-hidden className="pointer-events-none absolute inset-0 news-card-gradient" />
      <div aria-hidden className="pointer-events-none absolute inset-0 news-card-gradient" />

      <div aria-hidden className="pointer-events-none absolute inset-0 news-card-gradient-secondary opacity-70" />
 

      <div className="relative flex gap-4 p-4">
        {/* Thumbnail */}
        <div className="size-[72px] shrink-0 overflow-hidden rounded-xl bg-elevated flex items-center justify-center">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                const img = e.currentTarget;
                img.style.display = "none";
                const placeholder = img.nextElementSibling as HTMLElement | null;
                if (placeholder) placeholder.style.display = "flex";
              }}
            />
          ) : null}
          {/* Placeholder shown when no image or broken URL */}
          <div
            className="h-full w-full flex-col items-center justify-center gap-1.5 rounded-xl"
            style={{ display: item.imageUrl ? "none" : "flex", background: "rgba(235, 160, 21, 0.06)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="3" y="5" width="18" height="14" rx="3" stroke="rgba(197,160,89,0.45)" strokeWidth="1.2" />
              <path d="M3 17L7 13L10 16L14 11L21 17" stroke="rgba(197,160,89,0.45)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="8.5" cy="9.5" r="1.5" fill="rgba(197,160,89,0.45)" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-1.5 pr-4">
          <p className="font-roboto text-[9px] tracking-[0.1em] uppercase">
            <span className="font-semibold text-accent">{item.category}</span>
            <span className="text-secondary/50"> · {item.timeLabel}</span>
          </p>

          <h3 className="font-roboto text-[12px] font-bold leading-snug tracking-[0.03em] text-foreground uppercase">
            {titlePrefix}
            {titleHighlight && (
              <>
                {" "}
                <span className="text-accent">{titleHighlight}</span>
              </>
            )}
          </h3>

          <p className="font-roboto line-clamp-2 text-[11px] leading-relaxed text-secondary/75">
            {item.subtitle}
          </p>
        </div>
      </div>

      {/* Unread indicator */}
      {item.isUnread && (
        <span
          aria-label="Unread"
          className="absolute right-3.5 top-3.5 size-2 rounded-full bg-accent shadow-[0_0_6px_rgba(212,168,71,0.55)]"
        />
      )}
    </Link>
  );
}

export function MemberNewsSection({ items }: MemberNewsSectionProps) {
  const unreadCount = items.filter((item) => item.isUnread).length;

  return (
    <div className="space-y-4 ">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className={dashboardSectionHeadingClass}>
            <span className={dashboardSectionHeadingPrefixClass}>From The </span>
            <span className={dashboardSectionHeadingAccentClass}>Club</span>
          </h2>
          <p className={dashboardSectionSubtitleClass}>
            {unreadCount} unread bulletins
          </p>
        </div>
        <Link
          href="/member"
          className="flex shrink-0 items-center gap-1 rounded-full border border-accent/30 bg-transparent px-3 py-1.5 transition-all hover:border-accent/50 hover:bg-accent/5"
        >
          <span className="font-roboto text-[10px] font-semibold tracking-[0.16em] text-accent uppercase">
            All
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

      {/* Bulletin cards */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <MemberSectionEmpty
            title="No Bulletins"
            description="Club news and announcements will show up here."
          />
        ) : (
          items.map((item) => <NewsCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}
