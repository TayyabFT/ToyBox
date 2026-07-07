import type { ShiftLogEntry } from "./types";

type ShiftLogPanelProps = {
  staffName: string;
  entries: ShiftLogEntry[];
  footerNote?: string;
};

const toneStyles: Record<
  ShiftLogEntry["tone"],
  { dot: string; card: string }
> = {
  default: {
    dot: "border-secondary/50 bg-transparent",
    card: "border-accent/12 bg-elevated/35",
  },
  gold: {
    dot: "border-primary bg-primary/20",
    card: "border-primary/20 bg-primary/[0.04]",
  },
  pink: {
    dot: "border-pink bg-pink/15",
    card: "border-pink/20 bg-pink/[0.04]",
  },
  teal: {
    dot: "border-teal bg-teal/15",
    card: "border-teal/20 bg-teal/[0.04]",
  },
};

export function ShiftLogPanel({
  staffName,
  entries,
  footerNote,
}: ShiftLogPanelProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-accent/10 bg-card">
      <div className="border-b border-accent/10 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="font-copperplate text-[12px] tracking-[0.06em] text-foreground uppercase">
              My Shift Log
            </h2>
            <p className="font-roboto text-[10px] tracking-[0.08em] text-secondary uppercase">
              {staffName}
            </p>
          </div>

          <span className="font-roboto rounded-full border border-accent/20 bg-elevated/50 px-2.5 py-0.5 text-[8px] font-semibold tracking-[0.12em] text-secondary uppercase">
            {entries.length} {entries.length === 1 ? "Entry" : "Entries"}
          </span>
        </div>
      </div>

      <div className="px-5 py-5">
        {entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-accent/18 bg-elevated/30 px-4 py-10 text-center">
            <p className="font-copperplate text-[11px] tracking-[0.06em] text-foreground">
              No Shift Activity
            </p>
            <p className="font-roboto mt-2 text-[11px] text-secondary">
              No shift log entries yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, index) => {
              const styles = toneStyles[entry.tone];
              const isLast = index === entries.length - 1;

              return (
                <article key={entry.id} className="relative flex gap-4">
                  <div className="flex w-4 shrink-0 flex-col items-center">
                    <span
                      className={`relative z-[1] mt-4 size-3.5 shrink-0 rounded-full border-2 ${styles.dot}`}
                    />
                    {!isLast ? (
                      <span
                        className="mt-2 w-px flex-1 min-h-4 bg-gradient-to-b from-accent/25 via-accent/15 to-transparent"
                        aria-hidden
                      />
                    ) : null}
                  </div>

                  <div
                    className={`min-w-0 flex-1 rounded-xl border px-4 py-3 ${styles.card}`}
                  >
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <time className="font-roboto rounded-md border border-accent/15 bg-surface/70 px-2 py-0.5 text-[8px] font-medium tracking-[0.1em] text-secondary uppercase">
                        {entry.time}
                      </time>
                      {index === 0 ? (
                        <span className="font-roboto text-[7px] font-semibold tracking-[0.12em] text-secondary uppercase">
                          Latest
                        </span>
                      ) : null}
                    </div>

                    <p className="font-roboto text-[12px] leading-relaxed text-foreground">
                      {entry.title}{" "}
                      {entry.highlight ? (
                        <span className="font-semibold text-primary">
                          {entry.highlight}
                        </span>
                      ) : null}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {footerNote?.trim() ? (
        <div className="border-t border-accent/10 px-5 py-4">
          <p className="font-roboto rounded-lg border border-accent/10 bg-elevated/30 px-3 py-2.5 text-center text-[9px] leading-relaxed tracking-[0.08em] text-secondary uppercase">
            {footerNote}
          </p>
        </div>
      ) : null}
    </section>
  );
}
