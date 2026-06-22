type PriorityTagTone = "gold" | "teal" | "pink" | "purple";

type PriorityScheduleItemProps = {
  time: string;
  countdown: string;
  tag: { label: string; tone: PriorityTagTone };
  title: string;
  titleParts?: { before: string; after: string };
  detail: string;
  action: string;
  actionTone?: "gold" | "pink";
};

const tagToneClass: Record<PriorityTagTone, string> = {
  gold: "border-[#C5A059]/40 bg-[#C5A059]/10 text-[#C5A059]",
  teal: "border-teal/40 bg-teal/10 text-teal",
  pink: "border-[#D89999]/40 bg-[#D89999]/10 text-[#D89999]",
  purple: "border-[#9E8AD4]/40 bg-[#9E8AD4]/10 text-[#9E8AD4]",
};

const actionToneClass = {
  gold: "border-[#C5A059]/50 text-[#C5A059] hover:border-[#C5A059]/80 hover:bg-[#C5A059]/8",
  pink: "border-[#D89999]/50 text-[#D89999] hover:border-[#D89999]/80 hover:bg-[#D89999]/8",
};

export function PriorityScheduleItem({
  time,
  countdown,
  tag,
  title,
  titleParts,
  detail,
  action,
  actionTone = "gold",
}: PriorityScheduleItemProps) {
  return (
    <div className="flex items-center gap-5 border-b border-white/5 py-5 last:border-b-0">
      <div className="w-[52px] shrink-0 space-y-1">
        <p className="font-roboto text-[20px] font-semibold leading-none tracking-[0.04em] text-[#E7E5E4]">
          {time}
        </p>
        <p className="font-roboto text-[9px] tracking-[0.1em] text-[#6B665E] uppercase">
          {countdown}
        </p>
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <span
          className={`font-roboto inline-flex rounded-full border px-2.5 py-0.5 text-[9px] font-medium tracking-[0.1em] uppercase ${tagToneClass[tag.tone]}`}
        >
          {tag.label}
        </span>

        <p className="font-roboto text-[12px] font-semibold leading-tight tracking-[0.04em] uppercase">
          {titleParts ? (
            <>
              <span className="text-[#E7E5E4]">{titleParts.before}</span>
              <span className="text-[#C5A059]"> — {titleParts.after}</span>
            </>
          ) : (
            <span className="text-[#E7E5E4]">{title}</span>
          )}
        </p>

        <p className="font-roboto text-[11px] leading-snug tracking-[0.02em] text-[#6B665E]">
          {detail}
        </p>
      </div>

      <button
        type="button"
        className={`font-roboto shrink-0 cursor-pointer rounded-full border bg-transparent px-4 py-2 text-[9px] font-semibold tracking-[0.12em] uppercase transition-colors ${actionToneClass[actionTone]}`}
      >
        {action}
      </button>
    </div>
  );
}
