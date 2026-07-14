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
      return "text-pink group-hover:text-[#0A0806]";
    case "gold":
      return "text-[#C5A059] group-hover:text-[#0A0806]";
    case "white":
      return "text-[#F2EAD5] group-hover:text-[#0A0806]";
    default:
      return "text-[#F2EAD5] group-hover:text-[#0A0806]";
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
      ? "text-pink group-hover:text-[#0A0806]"
      : "text-[#C5A059] group-hover:text-[#0A0806]";

  return (
    <div className="group flex min-h-[128px] cursor-pointer flex-col rounded-[24px] border border-[#C5A059]/18 bg-[#0D0C0A] px-6 py-5 transition-all duration-200 hover:border-[#C5A059]/40 hover:bg-gradient-to-br hover:from-[#F0C566] hover:to-[#8B6F2A]">
      <div className="flex items-start justify-between gap-4">
        <p className="font-roboto pt-0.5 text-[11px] font-medium tracking-[0.14em] text-[#7A7268] uppercase group-hover:text-[#0A0806]/65">
          {label}
        </p>
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#C5A059]/30 bg-[#0A0908] group-hover:border-[#0A0806]/20 group-hover:bg-[#0A0806]/12 ${iconWrapTone}`}
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
        <p className="font-roboto text-[11px] tracking-[0.12em] text-[#7A7268] uppercase group-hover:text-[#0A0806]/55">
          {footnote}
        </p>
        {trend && (
          <span className="font-roboto flex shrink-0 items-center gap-1 text-[12px] font-medium tracking-[0.02em] text-teal group-hover:text-[#0A0806]/70">
            <ChevronDown
              color="currentColor"
              className="size-3 group-hover:[&_path]:stroke-[#0A0806]"
            />
            {formatTrend(trend)}
          </span>
        )}
      </div>
    </div>
  );
}
