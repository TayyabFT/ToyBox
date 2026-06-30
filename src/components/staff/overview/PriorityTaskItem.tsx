type IconTone = "pink" | "gold" | "blue" | "teal";

type PriorityTaskItemProps = {
  index: string;
  title: string;
  detail: string;
  time?: string;
  status?: { label: string; tone: "green" };
  icon: React.ReactNode;
  iconTone: IconTone;
};

const iconToneClass: Record<IconTone, string> = {
  pink: "border-pink/28 bg-pink/[0.06]",
  gold: "border-primary/28 bg-primary/[0.06]",
  blue: "border-info/28 bg-info/6",
  teal: "border-teal/28 bg-teal/[0.06]",
};

export function PriorityTaskItem({
  index,
  title,
  detail,
  time,
  status,
  icon,
  iconTone,
}: PriorityTaskItemProps) {
  return (
    <div className="overview-elevated-card-shell flex items-center gap-3.5 rounded-xl px-4 py-3.5">
      <span className="font-roboto w-5 shrink-0 text-[11px] tracking-[0.06em] text-section-label">
        {index}
      </span>

      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-lg border [&_svg]:size-[18px] ${iconToneClass[iconTone]}`}
      >
        {icon}
      </span>

      <div className="min-w-0 flex-1 space-y-1">
        <p className="font-roboto truncate text-[13px] font-medium tracking-[0.02em] text-foreground">
          {title}
        </p>
        <p className="truncate text-xs tracking-[0.1em] text-secondary uppercase">
          {detail}
        </p>
      </div>

      {time && (
        <span className="font-roboto shrink-0 text-[11px] tracking-[0.06em] text-secondary">
          {time}
        </span>
      )}

      {status && (
        <span className="font-roboto shrink-0 text-[11px] font-medium tracking-[0.06em] text-teal">
          {status.label}
        </span>
      )}
    </div>
  );
}
