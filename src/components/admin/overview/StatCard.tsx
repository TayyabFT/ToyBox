"use client";

import { TrendUp } from "@/components/common/Svgs";

type StatCardProps = {
  label: string;
  value: string;
  footnote?: string;
  footnoteTone?: "default" | "pink";
  trend?: string;
  icon: React.ReactNode;
  /** First card uses a distinct gradient on hover instead of the shared gold hover */
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
  const footnoteClass =
    footnoteTone === "pink"
      ? `text-pink ${statCardHoverLabelClass}`
      : `text-secondary ${statCardHoverLabelClass}`;

  return (
    <div
      className={[
        "group flex min-h-[160px] cursor-pointer flex-col rounded-2xl p-6 transition-all duration-200",
        "stat-card-shell",
        featured ? "stat-card-shell--featured" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className={[
            "font-roboto text-[12px] tracking-[0.14em] uppercase",
            "text-secondary",
            statCardHoverLabelClass,
          ].join(" ")}
        >
          {label}
        </p>
        <span
          className={[
            "flex size-10 shrink-0 items-center justify-center rounded-lg border [&_svg]:size-4",
            "border-accent/18 bg-accent/8 text-accent",
            statCardHoverIconClass,
          ].join(" ")}
        >
          {icon}
        </span>
      </div>

      <div className="flex flex-1 items-center py-1">
        <p
          className={[
            "font-copperplate text-[34px] leading-none tracking-[0.02em]",
            "text-foreground",
            statCardHoverValueClass,
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
            className="font-roboto flex items-center gap-0.5 text-[12px] font-medium tracking-[0.04em] text-teal group-hover:text-[color-mix(in_srgb,var(--stat-card-hover-fg)_70%,transparent)]"
          >
            <TrendUp
              className="group-hover:[&_path]:stroke-[var(--stat-card-hover-fg)]"
              color="currentColor"
            />
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
