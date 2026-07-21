import type { DiaryEntry } from "./types";

function DiaryTag({ label }: { label: string }) {
  return (
    <span className="font-roboto rounded-md border border-accent/25 bg-accent/8 px-2.5 py-1 text-[9px] font-medium tracking-[0.14em] text-accent uppercase">
      {label}
    </span>
  );
}

const STATUS_STYLES: Record<
  NonNullable<DiaryEntry["statusTone"]>,
  string
> = {
  gold:  "border-accent/40 bg-accent/10 text-accent",
  teal:  "border-teal-400/40 bg-teal-400/10 text-teal-400",
  green: "border-emerald-400/40 bg-emerald-400/10 text-emerald-400",
  red:   "border-red-400/35 bg-red-400/10 text-red-400",
  muted: "border-white/15 bg-white/5 text-secondary/50",
};

function StatusPill({
  label,
  tone = "muted",
}: {
  label: string;
  tone?: DiaryEntry["statusTone"];
}) {
  return (
    <span
      className={`font-roboto rounded-md border px-2.5 py-1 text-[9px] font-semibold tracking-[0.14em] uppercase ${STATUS_STYLES[tone ?? "muted"]}`}
    >
      {label}
    </span>
  );
}

export function DiaryEntryCard({ entry }: { entry: DiaryEntry }) {
  return (
    <div className="space-y-2.5 sm:space-y-3">
      {/* Date & Time */}
      <div className="space-y-1">
        <p className="font-roboto text-[9.5px] sm:text-[10px] font-medium tracking-[0.14em] text-primary uppercase">
          {entry.dateLabel}
          {entry.timeLabel && (
            <span> — {entry.timeLabel}</span>
          )}
        </p>
        <h3 className="font-copperplate text-[13px] sm:text-[15px] font-normal leading-snug tracking-[0.04em] uppercase">
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
        <div className="relative overflow-hidden rounded-[14px] sm:rounded-[18px] border border-accent/10">
          <div className="relative h-[150px] w-full sm:h-[200px] md:h-[220px]">
            <img
              src={entry.imageUrl}
              alt={`${entry.titlePrefix} ${entry.titleHighlight ?? ""}`.trim()}
              className="h-full w-full object-cover object-center"
            />
            <div
              aria-hidden
              className="member-dash-media-overlay pointer-events-none absolute inset-0"
            />
          </div>
        </div>
      )}

      {/* Description */}
      <p className="font-roboto max-w-2xl text-[12px] sm:text-[12.5px] leading-relaxed text-secondary/75">
        {entry.description}
      </p>

      {/* Tags + Status pill */}
      {(entry.tags.length > 0 || entry.statusLabel) && (
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5">
          {entry.tags.map((tag) => (
            <DiaryTag key={tag} label={tag} />
          ))}
          {entry.statusLabel && (
            <StatusPill label={entry.statusLabel} tone={entry.statusTone} />
          )}
        </div>
      )}
    </div>
  );
}
