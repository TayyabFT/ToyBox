import type { ServiceHistoryEntry } from "./types";

type ServiceHistoryProps = {
  entries: ServiceHistoryEntry[];
};

export function ServiceHistory({ entries }: ServiceHistoryProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-copperplate text-[11px] text-foreground">
          Service History
        </h3>
        <button
          type="button"
          className="font-roboto cursor-pointer rounded-lg border border-accent/25 px-3 py-1.5 text-[9px] font-medium tracking-[0.1em] text-primary uppercase"
        >
          View All
        </button>
      </div>

      <div className="space-y-0">
        {entries.map((entry, index) => (
          <div key={entry.id} className="flex gap-4">
            <div className="flex w-4 shrink-0 flex-col items-center">
              <span className="size-2 rounded-full border border-primary bg-primary/20" />
              {index < entries.length - 1 && (
                <span className="mt-1 w-px flex-1 bg-accent/15" aria-hidden />
              )}
            </div>

            <div className={`min-w-0 flex-1 space-y-1 ${index < entries.length - 1 ? "pb-5" : ""}`}>
              <p className="font-roboto text-[9px] tracking-[0.08em] text-secondary uppercase">
                {entry.date}
              </p>
              <p className="font-roboto text-[11px] font-medium tracking-[0.04em] text-foreground">
                {entry.title}
              </p>
              <p className="font-roboto text-[9px] tracking-[0.06em] text-secondary uppercase">
                {entry.location}
              </p>
              <p className="font-roboto text-[10px] tracking-[0.04em] text-primary">
                {entry.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
