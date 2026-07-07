import type { PinnedNotice } from "./types";

type PinnedNoticesPanelProps = {
  notices: PinnedNotice[];
  pinningId?: string;
  onTogglePin?: (id: string, isPinned: boolean) => void;
};

const toneStyles: Record<
  PinnedNotice["tone"],
  { dot: string; title: string }
> = {
  purple: {
    dot: "bg-[#9b7fd4]",
    title: "text-[#b9a0e8]",
  },
  gold: {
    dot: "bg-primary",
    title: "text-primary",
  },
  teal: {
    dot: "bg-teal",
    title: "text-teal",
  },
};

function hasApiId(id: string) {
  return Boolean(id) && !id.startsWith("notice-");
}

export function PinnedNoticesPanel({
  notices,
  pinningId = "",
  onTogglePin,
}: PinnedNoticesPanelProps) {
  return (
    <section className="rounded-2xl border border-accent/10 bg-card p-5">
      <h2 className="font-roboto mb-4 text-[11px] tracking-[0.14em] text-secondary uppercase">
        Pinned Notices
      </h2>

      <div className="space-y-4">
        {notices.length === 0 ? (
          <p className="font-roboto text-[12px] text-secondary">
            No pinned notices right now.
          </p>
        ) : null}

        {notices.map((notice, index) => {
          const styles = toneStyles[notice.tone];

          return (
            <div
              key={notice.id}
              className={`space-y-1.5 ${index < notices.length - 1 ? "border-b border-accent/10 pb-4" : ""}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className={`size-2 shrink-0 rounded-full ${styles.dot}`} />
                  <p
                    className={`font-roboto text-[10px] font-bold tracking-[0.12em] uppercase ${styles.title}`}
                  >
                    {notice.title}
                  </p>
                </div>
                {onTogglePin && hasApiId(notice.id) ? (
                  <button
                    type="button"
                    disabled={pinningId === notice.id}
                    onClick={() => onTogglePin(notice.id, true)}
                    className="font-roboto shrink-0 cursor-pointer rounded-md border border-accent/15 bg-card px-2 py-1 text-[9px] font-semibold tracking-[0.08em] text-secondary uppercase transition-colors hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {pinningId === notice.id ? "..." : "Unpin"}
                  </button>
                ) : null}
              </div>
              <p className="font-roboto pl-4 text-[12px] leading-relaxed tracking-[0.02em] text-foreground">
                {notice.body}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
