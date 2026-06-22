import { StatusPill } from "./StatusPill";

type SectionHeaderProps = {
  title: string;
  badge?: { label: string; tone: "red" | "green" | "gold" };
  trailing?: string;
};

export function SectionHeader({ title, badge, trailing }: SectionHeaderProps) {
  return (
    <div className="-mx-5 mb-4 border-b border-[#D4A8470F] px-5 pb-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-normal uppercase text-secondary">{title}</h3>

        <div className="flex items-center gap-2">
          {trailing && (
            <span className="font-roboto text-xs tracking-[0.06em] text-secondary">
              {trailing}
            </span>
          )}
          {badge && <StatusPill label={badge.label} tone={badge.tone} />}
        </div>
      </div>
    </div>
  );
}
