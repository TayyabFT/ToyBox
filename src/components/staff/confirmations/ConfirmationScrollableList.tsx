"use client";

import { Fragment, useEffect, useState, type ReactNode } from "react";

const DEFAULT_PREVIEW_COUNT = 6;
const DEFAULT_MAX_HEIGHT = "max-h-[380px]";

type ConfirmationScrollableListProps<T> = {
  items: T[];
  loading?: boolean;
  emptyText: string;
  loadingText?: string;
  previewCount?: number;
  maxHeightClassName?: string;
  listClassName?: string;
  renderItem: (item: T) => ReactNode;
  getItemKey: (item: T) => string;
};

export function ConfirmationScrollableList<T>({
  items,
  loading = false,
  emptyText,
  loadingText = "Loading...",
  previewCount = DEFAULT_PREVIEW_COUNT,
  maxHeightClassName = DEFAULT_MAX_HEIGHT,
  listClassName = "",
  renderItem,
  getItemKey,
}: ConfirmationScrollableListProps<T>) {
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setShowAll(false);
  }, [items]);

  const visibleItems = showAll ? items : items.slice(0, previewCount);
  const hasMore = items.length > previewCount && !showAll;
  const remainingCount = items.length - previewCount;

  return (
    <>
      <div
        className={`Custom__Scrollbar overflow-y-auto ${maxHeightClassName} ${listClassName}`.trim()}
      >
        {loading ? (
          <p className="font-roboto py-6 text-center text-[11px] tracking-[0.06em] text-secondary uppercase">
            {loadingText}
          </p>
        ) : items.length > 0 ? (
          visibleItems.map((item) => (
            <Fragment key={getItemKey(item)}>{renderItem(item)}</Fragment>
          ))
        ) : (
          <p className="font-roboto py-6 text-center text-[11px] tracking-[0.06em] text-secondary uppercase">
            {emptyText}
          </p>
        )}
      </div>

      {hasMore ? (
        <div className="flex shrink-0 justify-end border-t border-accent/8 px-4 py-3">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="font-roboto cursor-pointer rounded-lg border border-accent/20 bg-surface px-4 py-2 text-[10px] font-semibold tracking-[0.1em] text-primary uppercase transition-colors hover:border-primary/35 hover:bg-accent/8"
          >
            Load more ({remainingCount})
          </button>
        </div>
      ) : null}
    </>
  );
}
