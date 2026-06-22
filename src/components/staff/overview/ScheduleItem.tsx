type ScheduleItemProps = {
  time: string;
  title: string;
  detail: string;
};

export function ScheduleItem({
  time,
  title,
  detail,
}: ScheduleItemProps) {
  return (
    <div className="flex gap-4 border border-[#D4A84712] bg-[#1A1612] p-4 rounded-lg">
      <div className="flex w-12 shrink-0 flex-col items-center">
        <span className="font-roboto text-xs font-medium tracking-[0.06em] text-primary">
          {time}
        </span>
      </div>

      <div className='min-w-0 flex-1 space-y-1'>
        <p className="font-roboto text-[13px] font-medium tracking-[0.04em] text-foreground">
          {title}
        </p>
        <p className="font-roboto text-[11px] tracking-[0.04em] text-secondary uppercase">
          {detail}
        </p>
      </div>
    </div>
  );
}
