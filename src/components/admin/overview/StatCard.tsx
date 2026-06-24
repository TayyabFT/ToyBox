"use client";

import { TrendUp } from "@/components/common/Svgs";
import { useTheme } from "@/components/common/ThemeProvider";

type StatCardProps = {
  label: string;
  value: string;
  footnote?: string;
  footnoteTone?: "default" | "pink";
  trend?: string;
  icon: React.ReactNode;
  /** Light-mode Figma: first card uses a dark gradient surface */
  featured?: boolean;
};

export function StatCard({
  label,
  value,
  footnote,
  footnoteTone = "default",
  trend,
  icon,
  featured = false,
}: StatCardProps) {
  const { theme } = useTheme();
  const isFeaturedLight = featured && theme === "light";

  const footnoteClass =
    footnoteTone === "pink"
      ? isFeaturedLight
        ? "text-pink"
        : "text-pink group-hover:text-dark/70"
      : isFeaturedLight
        ? "text-white/65"
        : "text-secondary group-hover:text-dark/55";

  return (
    <div
      className={[
        "group flex min-h-[160px] cursor-pointer flex-col rounded-2xl border p-6 transition-all duration-200",
        isFeaturedLight
          ? "border-transparent bg-gradient-to-br from-[#3A3530] to-[#2A2622]"
          : "border-accent/18 bg-card hover:border-primary/40 hover:bg-gradient-to-br hover:from-[#F0C566] hover:to-[#8B6F2A]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className={[
            "font-roboto text-[12px] tracking-[0.14em] uppercase",
            isFeaturedLight
              ? "text-white/70"
              : "text-secondary group-hover:text-dark/60",
          ].join(" ")}
        >
          {label}
        </p>
        <span
          className={[
            "flex size-10 shrink-0 items-center justify-center rounded-lg border [&_svg]:size-4",
            isFeaturedLight
              ? "border-white/15 bg-white/10 text-white"
              : "border-accent/18 bg-accent/8 text-accent group-hover:border-dark/22 group-hover:bg-dark/20 group-hover:text-dark",
          ].join(" ")}
        >
          {icon}
        </span>
      </div>

      <div className="flex flex-1 items-center py-1">
        <p
          className={[
            "font-copperplate text-[34px] leading-none tracking-[0.02em]",
            isFeaturedLight
              ? "text-white"
              : "text-foreground group-hover:text-dark",
          ].join(" ")}
        >
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
            className={[
              "font-roboto flex items-center gap-0.5 text-[12px] font-medium tracking-[0.04em] text-teal",
              !isFeaturedLight && "group-hover:text-dark/70",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <TrendUp
              className={isFeaturedLight ? undefined : "group-hover:[&_path]:stroke-[#0A0806]"}
              color="currentColor"
            />
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
