type ScheduleItemState = "completed" | "active" | "upcoming";

type ScheduleTimelineItemProps = {
  time: string;
  title: string;
  detail?: string;
  statusLabel?: string;
  state?: ScheduleItemState;
  active?: boolean;
};

export function ScheduleTimeline({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>;
}

export function ScheduleTimelineItem({
  time,
  title,
  detail,
  statusLabel,
  state,
  active = false,
}: ScheduleTimelineItemProps) {
  const itemState: ScheduleItemState =
    state ?? (active ? "active" : "upcoming");

  const timeClass = {
    completed: "text-section-label",
    active: "font-medium text-accent",
    upcoming: "text-secondary",
  }[itemState];

  const titleClass = {
    completed: "text-section-label line-through decoration-section-label/60",
    active: "font-semibold text-foreground-soft",
    upcoming: "text-foreground-soft",
  }[itemState];

  const detailClass = {
    completed: "text-section-label",
    active: "text-secondary",
    upcoming: "text-secondary",
  }[itemState];

  const rowClass =
    itemState === "active"
      ? "relative rounded-lg bg-gradient-to-r from-accent/10 via-accent/5 to-transparent px-4 py-3"
      : "px-4 py-3";

  return (
    <div className={rowClass}>
      {itemState === "active" && (
        <span
          aria-hidden
          className="absolute top-2 bottom-2 left-0 w-[3px] rounded-r-sm bg-accent"
        />
      )}

      <div className="flex gap-4">
        <span
          className={`font-roboto w-11 shrink-0 text-right text-[12px] tracking-[0.04em] ${timeClass}`}
        >
          {time}
        </span>

        <div className="min-w-0 flex-1 space-y-1">
          <p className={`font-roboto text-[13px] tracking-[0.03em] ${titleClass}`}>
            {title}
          </p>
          {detail && (
            <p
              className={`font-roboto text-[10px] tracking-[0.1em] uppercase ${detailClass}`}
            >
              {detail}
            </p>
          )}
          {statusLabel && itemState === "active" && (
            <p className="font-roboto text-[10px] tracking-[0.1em] text-accent uppercase">
              {statusLabel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
