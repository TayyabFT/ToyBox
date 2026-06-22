import { StatusPill } from "./StatusPill";

type SectionHeaderProps = {
  title: string;
  badge?: { label: string; tone: "red" | "green" | "gold" };
  trailing?: string;
  titleAccent?: boolean;
  titleSplit?: { before: string; after: string };
};

export function SectionHeader({
  title,
  badge,
  trailing,
  titleAccent = false,
  titleSplit,
}: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h3 className="font-copperplate text-[11px] tracking-[0.06em] uppercase">
        {titleSplit ? (
          <>
            <span className="text-[#E7E5E4]">{titleSplit.before} </span>
            <span className="text-[#D4AF37]">{titleSplit.after}</span>
          </>
        ) : (
          <span className={titleAccent ? "text-[#C5A059]" : "text-[#E7E5E4]"}>{title}</span>
        )}
      </h3>

      <div className="flex items-center gap-2">
        {trailing && (
          <span className="font-roboto text-[10px] tracking-[0.08em] text-[#6B665E] uppercase">
            {trailing}
          </span>
        )}
        {badge && <StatusPill label={badge.label} tone={badge.tone} />}
      </div>
    </div>
  );
}
