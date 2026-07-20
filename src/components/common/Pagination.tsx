"use client";

import { useMemo } from "react";

const ELLIPSIS = "…";

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={direction === "left" ? "rotate-180" : undefined}
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type PageToken = number | typeof ELLIPSIS;

function getPageTokens(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): PageToken[] {
  const totalSlots = siblingCount * 2 + 5;

  if (totalPages <= totalSlots) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRangeSize = 3 + siblingCount * 2;
    const leftRange = Array.from({ length: leftRangeSize }, (_, i) => i + 1);
    return [...leftRange, ELLIPSIS, totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRangeSize = 3 + siblingCount * 2;
    const rightRange = Array.from(
      { length: rightRangeSize },
      (_, i) => totalPages - rightRangeSize + 1 + i,
    );
    return [1, ELLIPSIS, ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSibling - leftSibling + 1 },
    (_, i) => leftSibling + i,
  );
  return [1, ELLIPSIS, ...middleRange, ELLIPSIS, totalPages];
}

type PaginationProps = {
  /** 1-indexed current page */
  currentPage: number;
  /** Total number of items across all pages */
  totalItems: number;
  /** Items rendered per page */
  pageSize: number;
  onPageChange: (page: number) => void;
  /** Page buttons kept on each side of the current page before collapsing into an ellipsis */
  siblingCount?: number;
  /** Noun used in the summary text, e.g. "vehicles" */
  itemLabel?: string;
  /** Show the "Showing X–Y of Z" summary text */
  showSummary?: boolean;
  /** Render nothing when everything fits on a single page */
  hideOnSinglePage?: boolean;
  /** Disable all controls, e.g. while a request is in flight */
  disabled?: boolean;
  /** Offer a page-size selector; requires onPageSizeChange */
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
};

export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  siblingCount = 1,
  itemLabel = "items",
  showSummary = true,
  hideOnSinglePage = true,
  disabled = false,
  pageSizeOptions,
  onPageSizeChange,
  className = "",
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / Math.max(pageSize, 1)));
  const page = Math.min(Math.max(currentPage, 1), totalPages);

  const tokens = useMemo(
    () => getPageTokens(page, totalPages, siblingCount),
    [page, totalPages, siblingCount],
  );

  if (totalItems <= 0 || (hideOnSinglePage && totalPages <= 1)) {
    return null;
  }

  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);

  function goTo(target: number) {
    if (disabled || target === page || target < 1 || target > totalPages) return;
    onPageChange(target);
  }

  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      {showSummary ? (
        <p className="font-roboto text-[10px] tracking-[0.08em] text-secondary uppercase">
          Showing {rangeStart}–{rangeEnd} of {totalItems} {itemLabel}
        </p>
      ) : (
        <span />
      )}

      <div className="flex flex-wrap items-center gap-3">
        {pageSizeOptions && onPageSizeChange ? (
          <div className="flex items-center gap-1.5">
            <span className="font-roboto text-[9px] tracking-[0.1em] text-secondary uppercase">
              Per page
            </span>
            <select
              value={pageSize}
              disabled={disabled}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className="font-roboto cursor-pointer rounded-full border border-accent/25 bg-card px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] text-secondary outline-none transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous page"
            disabled={disabled || page <= 1}
            onClick={() => goTo(page - 1)}
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-accent/25 text-secondary transition-colors hover:border-accent/50 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-accent/25 disabled:hover:text-secondary"
          >
            <ChevronIcon direction="left" />
          </button>

          {tokens.map((token, index) =>
            token === ELLIPSIS ? (
              <span
                key={`dots-${index}`}
                className="font-roboto flex size-9 select-none items-center justify-center text-[13px] text-secondary"
              >
                {ELLIPSIS}
              </span>
            ) : (
              <button
                key={token}
                type="button"
                aria-label={`Go to page ${token}`}
                aria-current={token === page ? "page" : undefined}
                disabled={disabled}
                onClick={() => goTo(token)}
                className={`font-roboto flex size-9 shrink-0 cursor-pointer items-center justify-center text-[13px] font-medium transition-colors disabled:cursor-not-allowed ${
                  token === page
                    ? "admin-gold-cta rounded-lg font-semibold"
                    : "rounded-lg text-secondary hover:text-foreground"
                }`}
              >
                {token}
              </button>
            ),
          )}

          <button
            type="button"
            aria-label="Next page"
            disabled={disabled || page >= totalPages}
            onClick={() => goTo(page + 1)}
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-accent/25 text-secondary transition-colors hover:border-accent/50 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-accent/25 disabled:hover:text-secondary"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>
    </div>
  );
}
