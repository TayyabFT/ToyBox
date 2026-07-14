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
  critical: "text-pink",
  payment: "text-pink",
  warning: "text-accent",
  purple: "text-avatar-purple",
};

const toneIconBox: Record<CriticalAlertTone, string> = {
  critical: "border-pink/35 bg-pink/10 text-pink",
  payment: "border-pink/35 bg-pink/10 text-pink",
  warning: "border-accent/35 bg-accent/10 text-accent",
  purple: "border-avatar-purple/35 bg-avatar-purple/10 text-avatar-purple",
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
    <div className="flex items-start gap-3 border-b border-[var(--overview-border)] py-4 last:border-b-0">
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
          <span className="font-roboto text-[10px] text-secondary">·</span>
          <span className="font-roboto text-[10px] tracking-[0.04em] text-secondary">
            {status}
          </span>
        </div>
        <p className={overviewRowTitleClass}>{title}</p>
        <p className="font-roboto text-[10px] leading-relaxed tracking-[0.04em] text-secondary">
          {description}
        </p>
      </div>
    </div>
  );
}

export const criticalAlertsPanelClass =
  "rounded-2xl border border-[var(--overview-border)] bg-surface p-6";
