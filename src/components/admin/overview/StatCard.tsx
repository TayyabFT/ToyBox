import { TrendUp } from "@/components/common/Svgs";

type StatCardProps = {
  label: string;
  value: string;
  footnote?: string;
  footnoteTone?: "default" | "pink";
  trend?: string;
  icon: React.ReactNode;
};

export function StatCard({
  label,
  value,
  footnote,
  footnoteTone = "default",
  trend,
  icon,
}: StatCardProps) {
  const footnoteClass =
    footnoteTone === "pink"
      ? "text-[#D89999] group-hover:text-dark/70"
      : "text-[#8A8378] group-hover:text-dark/55";

  const trendClass = "text-teal group-hover:text-dark/70";

  return (
    <div className="group flex min-h-[160px] cursor-pointer flex-col rounded-2xl border border-[#C5A059]/22 bg-card p-6 transition-all duration-200 hover:border-[#C5A059]/40 hover:bg-gradient-to-br hover:from-[#F0C566] hover:to-[#8B6F2A]">
      <div className="flex items-start justify-between gap-3">
        <p className="font-roboto text-[12px] tracking-[0.14em] text-[#8A8378] uppercase group-hover:text-dark/60">
          {label}
        </p>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#C5A059]/28 bg-[#C5A059]/6 text-[#C5A059] group-hover:border-dark/22 group-hover:bg-dark/20 group-hover:text-dark">
          {icon}
        </span>
      </div>

      <div className="flex flex-1 items-center py-1">
        <p className="font-copperplate text-[34px] leading-none tracking-[0.02em] text-[#F2EAD5] group-hover:text-dark">
          {value}
        </p>
      </div>

      <div className="flex items-end justify-between gap-3">
        {footnote ? (
          <p
            className={`font-roboto text-[12px] tracking-[0.1em] uppercase ${footnoteClass}`}
          >
            {footnote}
          </p>
        ) : (
          <span />
        )}
        {trend && (
          <span
            className={`font-roboto flex items-center gap-0.5 text-[12px] font-medium tracking-[0.04em] ${trendClass}`}
          >
            <TrendUp
              className="group-hover:[&_path]:stroke-[#0A0806]"
              color="currentColor"
            />
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
