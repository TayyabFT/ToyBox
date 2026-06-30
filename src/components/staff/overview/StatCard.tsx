import { TrendUp } from "@/components/common/Svgs";
import { StatValueShimmer } from "./StatCardShimmer";

type StatCardProps = {
  label: string;
  value: string;
  subtext: string;
  trend?: string;
  icon: React.ReactNode;
  iconSize?: "default" | "lg";
  iconFit?: "scaled" | "native";
  valueLoading?: boolean;
  highlighted?: boolean;
};

export function StatCard({
  label,
  value,
  subtext,
  trend,
  icon,
  iconSize = "default",
  iconFit = "scaled",
  valueLoading = false,
  highlighted = false,
}: StatCardProps) {
  const svgSizeClass =
    iconFit === "native"
      ? "[&_svg]:h-auto [&_svg]:w-[24px]"
      : iconSize === "lg"
        ? highlighted
          ? "[&_svg]:h-[22px] [&_svg]:w-auto [&_svg]:max-w-[32px] [&_*]:stroke-pink group-hover:[&_*]:stroke-dark"
          : "[&_svg]:h-[22px] [&_svg]:w-auto [&_svg]:max-w-[32px] [&_*]:stroke-primary group-hover:[&_*]:stroke-dark"
        : highlighted
          ? "[&_svg]:size-[16px] [&_*]:stroke-pink group-hover:[&_*]:stroke-dark"
          : "[&_svg]:size-[16px] [&_*]:stroke-primary group-hover:[&_*]:stroke-dark";

  const iconBoxClass =
    iconSize === "lg" ? `size-14 ${svgSizeClass}` : `size-12 ${svgSizeClass}`;

  return (
    <div className="stat-card-shell group flex min-h-[148px] cursor-pointer flex-col justify-between rounded-2xl p-5 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <p className="font-roboto text-[10px] tracking-[0.12em] text-secondary uppercase group-hover:text-[var(--stat-card-hover-fg-muted)]">
          {label}
        </p>
        <span
          className={`flex shrink-0 items-center justify-center rounded-xl border border-accent/18 bg-accent/8 group-hover:border-[color-mix(in_srgb,var(--stat-card-hover-fg)_22%,transparent)] group-hover:bg-[color-mix(in_srgb,var(--stat-card-hover-fg)_20%,transparent)] ${iconBoxClass}`}
        >
          {icon}
        </span>
      </div>

      <div className="space-y-6">
        {valueLoading ? (
          <StatValueShimmer />
        ) : (
          <p className="font-copperplate text-[42px] leading-none text-foreground group-hover:text-[var(--stat-card-hover-fg)]">
            {value}
          </p>
        )}
        <div
          className={
            trend
              ? "flex items-center justify-between gap-3"
              : undefined
          }
        >
          <p className="font-roboto text-[10px] tracking-[0.08em] text-secondary uppercase group-hover:text-[var(--stat-card-hover-fg-muted)]">
            {subtext}
          </p>
          {trend && (
            <span className="font-roboto flex items-center gap-0.5 text-[10px] font-semibold tracking-[0.06em] text-teal group-hover:text-[color-mix(in_srgb,var(--stat-card-hover-fg)_70%,transparent)]">
              <TrendUp />
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
