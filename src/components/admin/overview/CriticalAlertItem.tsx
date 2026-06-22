import { overviewRowTitleClass } from "./panelStyles";

type CriticalAlertTone = "critical" | "payment" | "warning" | "purple";

type CriticalAlertItemProps = {
  tone: CriticalAlertTone;
  typeLabel: string;
  status: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const toneTypeClass: Record<CriticalAlertTone, string> = {
  critical: "text-[#E57373]",
  payment: "text-[#F0A0A0]",
  warning: "text-[#D4AF37]",
  purple: "text-[#9575CD]",
};

const toneIconBox: Record<CriticalAlertTone, string> = {
  critical: "border-[#E57373]/35 bg-[#E57373]/10 text-[#E57373]",
  payment: "border-[#F0A0A0]/35 bg-[#F0A0A0]/10 text-[#F0A0A0]",
  warning: "border-[#D4AF37]/35 bg-[#D4AF37]/10 text-[#D4AF37]",
  purple: "border-[#9575CD]/35 bg-[#9575CD]/10 text-[#9575CD]",
};

export function CriticalAlertItem({
  tone,
  typeLabel,
  status,
  title,
  description,
  icon,
}: CriticalAlertItemProps) {
  return (
    <div className="flex items-start gap-3 border-b border-white/5 py-4 last:border-b-0">
      <span
        className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-md border ${toneIconBox[tone]}`}
      >
        {icon}
      </span>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
          <span
            className={`font-roboto text-[11px] font-medium tracking-[0.04em] uppercase ${toneTypeClass[tone]}`}
          >
            {typeLabel}
          </span>
          <span className="font-roboto text-[10px] text-[#6B665E]">·</span>
          <span className="font-roboto text-[10px] tracking-[0.04em] text-[#6B665E]">
            {status}
          </span>
        </div>
        <p className={overviewRowTitleClass}>{title}</p>
        <p className="font-roboto text-[10px] leading-relaxed tracking-[0.04em] text-[#6B665E]">
          {description}
        </p>
      </div>
    </div>
  );
}

export const criticalAlertsPanelClass =
  "rounded-2xl border border-[#2D261A] bg-[#0C0C0C] p-6";
