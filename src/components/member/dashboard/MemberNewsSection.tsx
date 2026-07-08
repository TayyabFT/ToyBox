import Link from "next/link";
import type { MemberNewsItem } from "./types";

type MemberNewsSectionProps = {
  items: MemberNewsItem[];
};

function NewsRow({ item }: { item: MemberNewsItem }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-accent/6 last:border-0">
      {/* Thumbnail */}
      <div className="h-11 w-14 shrink-0 overflow-hidden rounded-lg bg-elevated">
        {item.imageUrl && (
          <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
        )}
      </div>
      {/* Text */}
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="font-roboto truncate text-[11px] font-medium text-foreground">{item.title}</p>
        <p className="font-roboto line-clamp-2 text-[10px] leading-snug tracking-[0.01em] text-secondary/70">{item.subtitle}</p>
      </div>
      {/* Arrow */}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-accent/30">
        <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function MemberNewsSection({ items }: MemberNewsSectionProps) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-1">
        <div className="space-y-0.5">
          <h2 className="font-copperplate text-[11px] tracking-[0.06em] uppercase">
            <span className="text-foreground">From </span>
            <span className="text-primary">The Club</span>
          </h2>
          <p className="font-roboto text-[9px] tracking-[0.14em] text-secondary/70 uppercase">Latest news</p>
        </div>
        <Link
          href="/member"
          className="font-roboto text-[9px] tracking-[0.16em] text-primary uppercase transition-colors hover:text-accent"
        >
          All →
        </Link>
      </div>
      <div className="rounded-xl border border-accent/8 bg-card px-4 py-1">
        {items.map((item) => (
          <NewsRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
