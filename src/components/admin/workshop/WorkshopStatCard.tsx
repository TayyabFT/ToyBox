import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import { ChevronDown } from "@/components/common/Svgs";

type WorkshopStatCardProps = {
  label: string;
  value: string;
  footnote: string;
  valueTone?: "default" | "pink" | "white" | "gold";
  iconTone?: "default" | "pink";
  trend?: string;
  icon: React.ReactNode;
  valueLoading?: boolean;
};

const hoverLabelClass =
  "group-hover:text-[var(--stat-card-hover-fg-muted)]";
const hoverValueClass =
  "group-hover:text-[var(--stat-card-hover-fg)]";
const hoverIconClass =
  "group-hover:border-[color-mix(in_srgb,var(--stat-card-hover-fg)_22%,transparent)] group-hover:bg-[color-mix(in_srgb,var(--stat-card-hover-fg)_20%,transparent)] group-hover:text-[var(--stat-card-hover-fg)]";

function formatTrend(value: string): string {
  if (value.startsWith("-")) {
    return `- ${value.slice(1)}`;
  }

  if (value.startsWith("+")) {
    return `+ ${value.slice(1)}`;
  }

  return value;
}

function getValueClass(valueTone: WorkshopStatCardProps["valueTone"]) {
  switch (valueTone) {
    case "pink":
      return `text-pink ${hoverValueClass}`;
    case "gold":
      return `text-accent ${hoverValueClass}`;
    case "white":
    default:
      return `text-foreground ${hoverValueClass}`;
  }
}

export function WorkshopStatCard({
  label,
  value,
  footnote,
  valueTone = "default",
  iconTone = "default",
  trend,
  icon,
  valueLoading = false,
}: WorkshopStatCardProps) {
  const iconWrapTone =
    iconTone === "pink"
      ? `text-pink ${hoverIconClass}`
      : `text-accent ${hoverIconClass}`;

  return (
    <div className="stat-card-shell group flex min-h-[128px] cursor-pointer flex-col rounded-[24px] px-6 py-5 transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <p
          className={`font-roboto pt-0.5 text-[11px] font-medium tracking-[0.14em] text-section-label uppercase ${hoverLabelClass}`}
        >
          {label}
        </p>
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-surface ${iconWrapTone}`}
        >
          {icon}
        </span>
      </div>

      {valueLoading ? (
        <ShimmerBlock className="mt-4 h-[28px] w-16" />
      ) : (
        <p
          className={`mt-4 font-copperplate text-[28px] leading-none tracking-[0.03em] uppercase ${getValueClass(valueTone)}`}
        >
          {value}
        </p>
      )}

      <div className="mt-auto flex items-end justify-between gap-4 pt-4">
        <p
          className={`font-roboto text-[11px] tracking-[0.12em] text-section-label uppercase ${hoverLabelClass}`}
        >
          {footnote}
        </p>
        {trend && (
          <span className="font-roboto flex shrink-0 items-center gap-1 text-[12px] font-medium tracking-[0.02em] text-teal group-hover:text-[color-mix(in_srgb,var(--stat-card-hover-fg)_70%,transparent)]">
            <ChevronDown
              color="currentColor"
              className="size-3 group-hover:[&_path]:stroke-[var(--stat-card-hover-fg)]"
            />
            {formatTrend(trend)}
          </span>
        )}
      </div>
    </div>
  );
}
