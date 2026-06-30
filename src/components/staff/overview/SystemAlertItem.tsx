type SystemAlertItemProps = {
  message: string;
  time: string;
  icon: React.ReactNode;
};

export function SystemAlertItem({ message, time, icon }: SystemAlertItemProps) {
  return (
    <div className="overview-elevated-card-shell flex items-center gap-3 rounded-xl px-3.5 py-4">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-pink/16 bg-pink/10">
        {icon}
      </span>

      <p className="font-roboto min-w-0 flex-1 text-xs leading-relaxed tracking-[0.03em] text-foreground">
        {message}
      </p>

      <span className="font-roboto shrink-0 text-[10px] tracking-[0.04em] text-section-label">
        {time}
      </span>
    </div>
  );
}
