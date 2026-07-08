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
  gold: "bg-[#1C1917] text-[#D4AF37]",
  purple: "bg-[#1C1917] text-[#9E8AD4]",
  teal: "bg-[#1C1917] text-teal",
  pink: "bg-[#1C1917] text-pink",
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
    <div className="flex min-w-0 items-start gap-3 border-b border-white/5 py-4 pr-1 transition-colors last:border-b-0 hover:bg-[#1A1A1A]">
      <span className="font-roboto w-10 shrink-0 pt-1 text-[11px] tracking-[0.04em] text-[#6B665E]">
        {time}
      </span>

      <span
        className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-white/5 ${iconBoxClass[iconTone]}`}
      >
        {icon}
      </span>

      <p className="font-roboto min-w-0 flex-1 pt-0.5 text-[12px] leading-relaxed tracking-[0.02em] text-[#E7E5E4]">
        {children}
      </p>

      <span
        className={`font-roboto max-w-[4.5rem] shrink-0 truncate pt-1 text-right text-[10px] tracking-[0.04em] ${
          categoryTone === "critical" ? "text-pink" : "text-[#6B665E]"
        }`}
      >
        {category}
      </span>
    </div>
  );
}

export function ActivityHighlight({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-[#D4AF37]">{children}</span>;
}
