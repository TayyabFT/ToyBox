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
  /** Light-mode Figma: first card uses the active gradient surface */
  featured?: boolean;
};

const statCardHoverLabelClass =
  "group-hover:text-[var(--stat-card-hover-fg-muted)]";

const statCardHoverValueClass =
  "group-hover:text-[var(--stat-card-hover-fg)]";

const statCardHoverIconClass =
  "group-hover:border-[color-mix(in_srgb,var(--stat-card-hover-fg)_22%,transparent)] group-hover:bg-[color-mix(in_srgb,var(--stat-card-hover-fg)_20%,transparent)] group-hover:text-[var(--stat-card-hover-fg)]";

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
        : `text-pink ${statCardHoverLabelClass}`
      : isFeaturedLight
        ? "text-foreground/70"
        : `text-secondary ${statCardHoverLabelClass}`;

  return (
    <div
      className={[
        "group flex min-h-[160px] cursor-pointer flex-col rounded-2xl p-6 transition-all duration-200",
        isFeaturedLight
          ? "border-transparent bg-gradient-to-br from-[var(--stat-card-active-from)] to-[var(--stat-card-active-to)]"
          : "stat-card-shell",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className={[
            "font-roboto text-[12px] tracking-[0.14em] uppercase",
            isFeaturedLight
              ? "text-foreground/70"
              : ["text-secondary", statCardHoverLabelClass].join(" "),
          ].join(" ")}
        >
          {label}
        </p>
        <span
          className={[
            "flex size-10 shrink-0 items-center justify-center rounded-lg border [&_svg]:size-4",
            isFeaturedLight
              ? "border-foreground/15 bg-foreground/10 text-foreground"
              : [
                  "border-accent/18 bg-accent/8 text-accent",
                  statCardHoverIconClass,
                ].join(" "),
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
              ? "text-foreground"
              : ["text-foreground", statCardHoverValueClass].join(" "),
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
              !isFeaturedLight &&
                "group-hover:text-[color-mix(in_srgb,var(--stat-card-hover-fg)_70%,transparent)]",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <TrendUp
              className={
                isFeaturedLight
                  ? undefined
                  : "group-hover:[&_path]:stroke-[var(--stat-card-hover-fg)]"
              }
              color="currentColor"
            />
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
