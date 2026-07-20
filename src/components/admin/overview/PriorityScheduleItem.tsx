type PriorityTagTone = "gold" | "teal" | "pink" | "purple";

type PriorityScheduleItemProps = {
  time: string;
  countdown: string;
  tag: { label: string; tone: PriorityTagTone };
  title: string;
  titleParts?: { before: string; after: string };
  detail: string;
};

const tagToneClass: Record<PriorityTagTone, string> = {
  gold: "priority-tag priority-tag--gold",
  teal: "priority-tag priority-tag--teal",
  pink: "priority-tag priority-tag--pink",
  purple: "priority-tag priority-tag--purple",
};

export function PriorityScheduleItem({
  time,
  countdown,
  tag,
  title,
  titleParts,
  detail,
}: PriorityScheduleItemProps) {
  return (
    <div className="flex items-center gap-5 border-b border-[var(--overview-border)] py-5 last:border-b-0">
      <div className="w-[52px] shrink-0 space-y-1">
        <p className="font-roboto text-[20px] font-semibold leading-none tracking-[0.04em] text-foreground-soft">
          {time}
        </p>
        {/* <p className="font-roboto text-[9px] tracking-[0.1em] text-secondary uppercase">
          {countdown}
        </p> */}
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <span
          className={`font-roboto inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-medium tracking-[0.1em] uppercase ${tagToneClass[tag.tone]}`}
        >
          {tag.label}
        </span>

        <p className="font-roboto text-[12px] font-semibold leading-tight tracking-[0.04em] uppercase">
          {titleParts ? (
            <>
              <span className="text-foreground-soft">{titleParts.before}</span>
              <span className="text-accent"> — {titleParts.after}</span>
            </>
          ) : (
            <span className="text-foreground-soft">{title}</span>
          )}
        </p>

        <p className="font-roboto text-[11px] leading-snug tracking-[0.02em] text-secondary">
          {detail}
        </p>
      </div>
    </div>
  );
}
