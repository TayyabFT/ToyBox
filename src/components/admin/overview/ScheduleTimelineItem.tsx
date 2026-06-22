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
    completed: "text-[#4A4540]",
    active: "font-medium text-[#C5A059]",
    upcoming: "text-[#6B665E]",
  }[itemState];

  const titleClass = {
    completed: "text-[#4A4540] line-through decoration-[#4A4540]/60",
    active: "font-semibold text-[#E7E5E4]",
    upcoming: "text-[#E7E5E4]",
  }[itemState];

  const detailClass = {
    completed: "text-[#4A4540]",
    active: "text-[#6B665E]",
    upcoming: "text-[#6B665E]",
  }[itemState];

  const rowClass =
    itemState === "active"
      ? "relative rounded-lg bg-gradient-to-r from-[#C5A059]/10 via-[#C5A059]/5 to-transparent px-4 py-3"
      : "px-4 py-3";

  return (
    <div className={rowClass}>
      {itemState === "active" && (
        <span
          aria-hidden
          className="absolute top-2 bottom-2 left-0 w-[3px] rounded-r-sm bg-[#C5A059]"
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
            <p className="font-roboto text-[10px] tracking-[0.1em] text-[#C5A059] uppercase">
              {statusLabel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
