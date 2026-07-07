"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FeedCheckIcon,
  FeedFlagIcon,
  FeedInspectIcon,
  FeedTruckIcon,
  FeedWrenchIcon,
  MegaphoneIcon,
} from "./icons";
import type { FeedStatus, FeedTag, ShiftFeedItem } from "./types";

type ShiftUpdateFeedProps = {
  items: ShiftFeedItem[];
  loading?: boolean;
  pinningId?: string;
  onTogglePin?: (id: string, isPinned: boolean) => void;
};

const INITIAL_VISIBLE_COUNT = 5;

export function ShiftUpdateFeed({
  items,
  loading = false,
  pinningId = "",
  onTogglePin,
}: ShiftUpdateFeedProps) {
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setShowAll(false);
  }, [items]);

  const visibleItems = useMemo(
    () => (showAll ? items : items.slice(0, INITIAL_VISIBLE_COUNT)),
    [items, showAll],
  );

  const hasMore = items.length > INITIAL_VISIBLE_COUNT;
  const hiddenCount = Math.max(items.length - INITIAL_VISIBLE_COUNT, 0);

  return (
    <section className="rounded-2xl border border-accent/10 bg-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-roboto text-[11px] tracking-[0.14em] text-secondary uppercase">
          Shift Update Feed
        </h2>
        <span className="font-roboto flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.12em] text-teal uppercase">
          <span className="size-1.5 rounded-full bg-teal" />
          Live
        </span>
      </div>

      {loading && items.length === 0 ? (
        <p className="font-roboto py-10 text-center text-sm text-secondary">
          Loading shift updates...
        </p>
      ) : null}

      {!loading && items.length === 0 ? (
        <p className="font-roboto py-10 text-center text-sm text-secondary">
          No updates match this filter.
        </p>
      ) : null}

      {visibleItems.length > 0 ? (
        <div className="space-y-3">
          {visibleItems.map((item) => (
            <FeedItemCard
              key={item.id}
              item={item}
              pinning={pinningId === item.id}
              onTogglePin={onTogglePin}
            />
          ))}
        </div>
      ) : null}

      {hasMore ? (
        <div className="mt-4 flex justify-end border-t border-accent/8 pt-4">
          <button
            type="button"
            onClick={() => setShowAll((current) => !current)}
            className="font-roboto cursor-pointer rounded-lg border border-accent/20 bg-surface px-4 py-2 text-[10px] font-semibold tracking-[0.1em] text-primary uppercase transition-colors hover:border-primary/35 hover:bg-accent/8"
          >
            {showAll
              ? "Show Less"
              : `View All (${hiddenCount} more)`}
          </button>
        </div>
      ) : null}
    </section>
  );
}

function FeedItemCard({
  item,
  pinning = false,
  onTogglePin,
}: {
  item: ShiftFeedItem;
  pinning?: boolean;
  onTogglePin?: (id: string, isPinned: boolean) => void;
}) {
  return (
    <article className="rounded-xl border border-accent/10 bg-surface p-4">
      <div className="flex items-start gap-3">
        <FeedIcon type={item.icon} status={item.status} />

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-roboto text-[13px] font-semibold text-foreground">
                {item.author}
              </p>
              <StatusBadge status={item.status} label={item.statusLabel} />
              {item.isPinned ? (
                <span className="font-roboto rounded-full border border-primary/25 bg-primary/8 px-2 py-0.5 text-[9px] font-bold tracking-[0.1em] text-primary uppercase">
                  Pinned
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              {onTogglePin && item.canPin !== false ? (
                <button
                  type="button"
                  disabled={pinning}
                  onClick={() => onTogglePin(item.id, Boolean(item.isPinned))}
                  className="font-roboto cursor-pointer rounded-md border border-accent/15 bg-card px-2 py-1 text-[9px] font-semibold tracking-[0.08em] text-secondary uppercase transition-colors hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {pinning ? "..." : item.isPinned ? "Unpin" : "Pin"}
                </button>
              ) : null}
              <span className="font-roboto text-[11px] tracking-[0.06em] text-secondary">
                {item.time}
              </span>
            </div>
          </div>

          <p className="font-roboto text-[12px] leading-relaxed tracking-[0.02em] text-secondary">
            {item.body}
          </p>

          {item.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <FeedTagPill key={tag.label} tag={tag} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function FeedIcon({
  type,
  status,
}: {
  type: ShiftFeedItem["icon"];
  status: FeedStatus;
}) {
  const iconClass = "size-4";

  const shellClass = {
    issue: "border-pink/30 bg-pink/10 text-pink",
    completed: "border-teal/30 bg-teal/10 text-teal",
    "in-transit": "border-primary/30 bg-primary/10 text-primary",
    "in-progress": "border-accent/25 bg-card text-secondary",
    management: "border-primary/35 bg-primary/10 text-primary",
    inspection: "border-teal/25 bg-teal/8 text-teal",
  }[status];

  const icon =
    type === "flag" ? (
      <FeedFlagIcon className={iconClass} />
    ) : type === "check" ? (
      <FeedCheckIcon className={iconClass} />
    ) : type === "truck" ? (
      <FeedTruckIcon className={iconClass} />
    ) : type === "wrench" ? (
      <FeedWrenchIcon className={iconClass} />
    ) : type === "megaphone" ? (
      <MegaphoneIcon className={iconClass} />
    ) : (
      <FeedInspectIcon className={iconClass} />
    );

  return (
    <span
      className={`flex size-10 shrink-0 items-center justify-center rounded-full border ${shellClass}`}
    >
      {icon}
    </span>
  );
}

function StatusBadge({
  status,
  label,
}: {
  status: FeedStatus;
  label: string;
}) {
  const className = {
    issue: "border-pink/30 bg-pink/10 text-pink",
    completed: "border-teal/30 bg-teal/10 text-teal",
    "in-transit": "border-primary/30 bg-primary/10 text-primary",
    "in-progress": "border-accent/20 bg-card text-secondary",
    management: "border-primary/35 bg-primary/10 text-primary",
    inspection: "border-teal/25 bg-teal/8 text-teal",
  }[status];

  return (
    <span
      className={`font-roboto rounded-full border px-2.5 py-0.5 text-[9px] font-bold tracking-[0.12em] uppercase ${className}`}
    >
      {label}
    </span>
  );
}

function FeedTagPill({ tag }: { tag: FeedTag }) {
  const toneClass = {
    default: "border-accent/15 bg-card text-secondary",
    gold: "border-primary/25 bg-primary/8 text-primary",
    pink: "border-pink/25 bg-pink/8 text-pink",
    teal: "border-teal/25 bg-teal/8 text-teal",
  }[tag.tone ?? "default"];

  return (
    <span
      className={`font-roboto rounded-md border px-2 py-1 text-[9px] font-semibold tracking-[0.1em] uppercase ${toneClass}`}
    >
      {tag.label}
    </span>
  );
}
