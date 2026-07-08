import Link from "next/link";
import type { MemberActivityItem } from "./types";

const toneDotClass: Record<string, string> = {
  gold: "bg-primary shadow-[0_0_5px_rgba(201,168,76,0.6)]",
  teal: "bg-teal shadow-[0_0_5px_rgba(125,191,160,0.6)]",
  pink: "bg-pink shadow-[0_0_5px_rgba(216,153,153,0.6)]",
  default: "bg-secondary/35",
};

const toneTitleClass: Record<string, string> = {
  gold: "text-primary",
  teal: "text-teal",
  pink: "text-pink",
  default: "text-foreground/80",
};

type MemberActivitySectionProps = {
  items: MemberActivityItem[];
};

function ActivityRow({ item }: { item: MemberActivityItem }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-accent/6 last:border-0">
      {/* Dot */}
      <div className="pt-[5px] shrink-0">
        <span className={`block size-2 rounded-full ${toneDotClass[item.tone]}`} />
      </div>
      {/* Content */}
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className={`font-roboto text-[11px] font-medium leading-snug ${toneTitleClass[item.tone]}`}>
          {item.title}
        </p>
        <p className="font-roboto text-[10px] leading-snug tracking-[0.01em] text-secondary/60 line-clamp-2">
          {item.detail}
        </p>
        <p className="font-roboto text-[8px] tracking-[0.1em] text-secondary/40 uppercase pt-0.5">
          {item.timeLabel}
        </p>
      </div>
    </div>
  );
}

export function MemberActivitySection({ items }: MemberActivitySectionProps) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-1">
        <div className="space-y-0.5">
          <h2 className="font-copperplate text-[11px] tracking-[0.06em] uppercase">
            <span className="text-foreground">Recent </span>
            <span className="text-primary">Activity</span>
          </h2>
          <p className="font-roboto text-[9px] tracking-[0.14em] text-secondary/70 uppercase">Your latest interactions</p>
        </div>
        <Link
          href="/member"
          className="font-roboto text-[9px] tracking-[0.16em] text-primary uppercase transition-colors hover:text-accent"
        >
          View All →
        </Link>
      </div>
      <div className="rounded-xl border border-accent/8 bg-card px-4 py-1">
        {items.map((item) => (
          <ActivityRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
