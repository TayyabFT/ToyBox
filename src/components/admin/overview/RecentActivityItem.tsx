type ActivityIconTone = "gold" | "purple" | "teal" | "pink";

type RecentActivityItemProps = {
  time: string;
  icon: React.ReactNode;
  iconTone?: ActivityIconTone;
  category: string;
  categoryTone?: "default" | "critical";
  children: React.ReactNode;
};

const iconBoxClass: Record<ActivityIconTone, string> = {
  gold: "bg-elevated text-accent",
  purple: "bg-elevated text-avatar-purple",
  teal: "bg-elevated text-teal",
  pink: "bg-elevated text-pink",
};

export function RecentActivityItem({
  time,
  icon,
  iconTone = "gold",
  category,
  categoryTone = "default",
  children,
}: RecentActivityItemProps) {
  return (
    <div className="flex min-w-0 items-start gap-3 border-b border-[var(--overview-border)] py-4 pr-1 transition-colors last:border-b-0 hover:bg-elevated">
      <span className="font-roboto w-10 shrink-0 pt-1 text-[11px] tracking-[0.04em] text-secondary">
        {time}
      </span>

      <span
        className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-[var(--overview-border)] ${iconBoxClass[iconTone]}`}
      >
        {icon}
      </span>

      <p className="font-roboto min-w-0 flex-1 pt-0.5 text-[12px] leading-relaxed tracking-[0.02em] text-foreground-soft">
        {children}
      </p>

      <span
        className={`font-roboto max-w-[4.5rem] shrink-0 truncate pt-1 text-right text-[10px] tracking-[0.04em] ${
          categoryTone === "critical" ? "text-pink" : "text-secondary"
        }`}
      >
        {category}
      </span>
    </div>
  );
}

export function ActivityHighlight({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-accent">{children}</span>;
}
