import type { DiaryEntry } from "./types";

function DiaryTag({ label }: { label: string }) {
  return (
    <span className="font-roboto rounded-md border border-accent/25 bg-accent/8 px-2.5 py-1 text-[9px] font-medium tracking-[0.14em] text-accent uppercase">
      {label}
    </span>
  );
}

export function DiaryEntryCard({ entry }: { entry: DiaryEntry }) {
  return (
    <div className="space-y-3">
      {/* Date & Time */}
      <div className="space-y-1">
        <p className="font-roboto text-[10px] font-medium tracking-[0.14em] text-primary uppercase">
          {entry.dateLabel}
          {entry.timeLabel && (
            <span> — {entry.timeLabel}</span>
          )}
        </p>
        <h3 className="font-copperplate text-[15px] font-normal leading-snug tracking-[0.04em] uppercase">
          <span className="text-foreground">{entry.titlePrefix}</span>
          {entry.titleHighlight && (
            <>
              {" "}
              <span className="text-accent">{entry.titleHighlight}</span>
            </>
          )}
        </h3>
      </div>

      {/* Optional hero image */}
      {entry.imageUrl && (
        <div className="relative overflow-hidden rounded-[18px] border border-accent/10">
          <div className="relative h-[170px] w-full sm:h-[200px] md:h-[220px]">
            <img
              src={entry.imageUrl}
              alt={`${entry.titlePrefix} ${entry.titleHighlight ?? ""}`.trim()}
              className="h-full w-full object-cover object-center"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.28) 45%, rgba(0,0,0,0.05) 100%)",
              }}
            />
          </div>
        </div>
      )}

      {/* Description */}
      <p className="font-roboto max-w-2xl text-[12.5px] leading-relaxed text-secondary/75">
        {entry.description}
      </p>

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          {entry.tags.map((tag) => (
            <DiaryTag key={tag} label={tag} />
          ))}
        </div>
      )}
    </div>
  );
}
