"use client";

import { useEffect, useState } from "react";
import type { ServiceHistoryEntry } from "./types";

const DEFAULT_PREVIEW_LIMIT = 3;

type ServiceHistoryProps = {
  entries: ServiceHistoryEntry[];
  previewLimit?: number;
};

export function ServiceHistory({
  entries,
  previewLimit = DEFAULT_PREVIEW_LIMIT,
}: ServiceHistoryProps) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = entries.length > previewLimit;
  const hiddenCount = entries.length - previewLimit;
  const visibleEntries =
    expanded || !hasMore ? entries : entries.slice(0, previewLimit);

  useEffect(() => {
    setExpanded(false);
  }, [entries]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-accent/10 pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-copperplate text-[12px] tracking-[0.06em] text-foreground">
            Service History
          </h3>
          {entries.length > 0 ? (
            <span className="font-roboto rounded-full border border-primary/25 bg-primary/8 px-2.5 py-0.5 text-[8px] font-semibold tracking-[0.12em] text-primary uppercase">
              {entries.length} {entries.length === 1 ? "Record" : "Records"}
            </span>
          ) : null}
        </div>

        {hasMore && !expanded ? (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="font-roboto cursor-pointer rounded-lg border border-primary/30 bg-primary/8 px-4 py-2 text-[9px] font-semibold tracking-[0.12em] text-primary uppercase transition-colors hover:border-primary/45 hover:bg-primary/12"
          >
            View All ({hiddenCount} more)
          </button>
        ) : null}
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-accent/18 bg-elevated/35 px-6 py-12 text-center">
          <p className="font-copperplate text-[12px] tracking-[0.06em] text-foreground">
            No Service Records
          </p>
          <p className="font-roboto mt-2 text-[11px] text-secondary">
            Service history not found.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleEntries.map((entry, index) => {
            const isLatest = index === 0;
            const isLast = index === visibleEntries.length - 1;

            return (
              <article key={entry.id} className="relative flex gap-4">
                <div className="flex w-7 shrink-0 flex-col items-center">
                  <span
                    className={
                      isLatest
                        ? "relative z-[1] size-3 rounded-full bg-gradient-to-br from-gold-bright to-primary shadow-[0_0_12px_color-mix(in_srgb,var(--primary)_35%,transparent)]"
                        : "relative z-[1] size-2.5 rounded-full border border-primary/35 bg-surface"
                    }
                  />
                  {!isLast ? (
                    <span
                      className="mt-2 w-px flex-1 min-h-6 bg-gradient-to-b from-primary/35 via-accent/20 to-transparent"
                      aria-hidden
                    />
                  ) : null}
                </div>

                <div
                  className={`min-w-0 flex-1 rounded-2xl border px-4 py-4 transition-colors sm:px-5 sm:py-4 ${
                    isLatest
                      ? "border-primary/25 bg-gradient-to-br from-primary/[0.08] via-card to-card shadow-[inset_0_1px_0_color-mix(in_srgb,var(--primary)_12%,transparent)]"
                      : "border-accent/12 bg-elevated/45 hover:border-accent/20"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {isLatest ? (
                          <span className="font-roboto rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[7px] font-semibold tracking-[0.12em] text-primary uppercase">
                            Latest
                          </span>
                        ) : null}
                        <h4 className="font-copperplate text-[13px] leading-tight tracking-[0.04em] text-foreground uppercase">
                          {entry.title}
                        </h4>
                      </div>

                      <p className="font-roboto text-[10px] tracking-[0.1em] text-secondary uppercase">
                        {entry.location}
                      </p>
                    </div>

                    <time className="font-roboto shrink-0 rounded-lg border border-accent/15 bg-surface/80 px-2.5 py-1.5 text-[8px] font-medium tracking-[0.12em] text-secondary uppercase">
                      {entry.date}
                    </time>
                  </div>

                  {entry.detail ? (
                    <div className="mt-3 border-t border-accent/10 pt-3">
                      <p className="font-roboto text-[11px] font-medium tracking-[0.03em] text-primary">
                        {entry.detail}
                      </p>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {hasMore && expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="font-roboto w-full cursor-pointer rounded-xl border border-accent/15 bg-elevated/30 py-2.5 text-[9px] font-medium tracking-[0.12em] text-secondary uppercase transition-colors hover:border-accent/25 hover:text-foreground"
        >
          Show Less
        </button>
      ) : null}
    </div>
  );
}
