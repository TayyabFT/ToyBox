import {
  overviewSectionSubtitleClass,
  overviewSectionTitleClass,
} from "./panelStyles";

type OverviewSectionHeaderProps = {
  title?: string;
  titleAccent?: boolean;
  titleSplit?: { before: string; after: string };
  trailing?: string;
  subtitle?: string;
  divider?: boolean;
};

export function OverviewOutsideHeader({
  title,
  titleAccent = false,
  titleSplit,
  subtitle,
}: Pick<OverviewSectionHeaderProps, "title" | "titleAccent" | "titleSplit" | "subtitle">) {
  const titleContent = titleSplit ? (
    <>
      <span className="text-[#E7E5E4]">{titleSplit.before} </span>
      <span className="text-[#C5A059]">{titleSplit.after}</span>
    </>
  ) : (
    <span className={titleAccent ? "text-[#C5A059]" : "text-[#E7E5E4]"}>{title}</span>
  );

  return (
    <div className="mb-4 space-y-1.5">
      <h3 className={overviewSectionTitleClass}>{titleContent}</h3>
      {subtitle && <p className={overviewSectionSubtitleClass}>{subtitle}</p>}
    </div>
  );
}

export function OverviewSectionHeader({
  title,
  titleAccent = false,
  titleSplit,
  trailing,
  subtitle,
  divider = false,
}: OverviewSectionHeaderProps) {
  const titleContent = titleSplit ? (
    <>
      <span className="text-[#E7E5E4]">{titleSplit.before} </span>
      <span className="text-[#C5A059]">{titleSplit.after}</span>
    </>
  ) : (
    <span className={titleAccent ? "text-[#C5A059]" : "text-[#E7E5E4]"}>{title}</span>
  );

  return (
    <div className={divider ? "mb-4 border-b border-white/5 pb-4" : "mb-4"}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1.5">
          <h3 className={overviewSectionTitleClass}>{titleContent}</h3>
          {subtitle && <p className={overviewSectionSubtitleClass}>{subtitle}</p>}
        </div>

        {trailing && (
          <span className="font-roboto shrink-0 pt-0.5 text-[10px] tracking-[0.08em] text-[#6B665E] uppercase">
            {trailing}
          </span>
        )}
      </div>
    </div>
  );
}
