import {
  confirmationStatIconClass,
  confirmationStatLabelClass,
  confirmationStatSubtextClass,
  confirmationStatSubtextTealClass,
  confirmationStatValueClass,
  confirmationStatValueTealClass,
} from "./panelStyles";
import type { ConfirmationStatItem } from "./types";

type ConfirmationStatCardProps = ConfirmationStatItem & {
  icon: React.ReactNode;
};

export function ConfirmationStatCard({
  label,
  value,
  subtext,
  accent = "gold",
  icon,
}: ConfirmationStatCardProps) {
  const valueClass = accent === "teal" ? confirmationStatValueTealClass : confirmationStatValueClass;
  const subtextClass =
    accent === "teal" ? confirmationStatSubtextTealClass : confirmationStatSubtextClass;

  return (
    <div className="group flex min-h-[148px] cursor-pointer flex-col justify-between rounded-2xl border border-[#C5A059]/22 bg-card p-5 transition-all duration-200 hover:border-[#C5A059]/40 hover:bg-gradient-to-br hover:from-[#F0C566] hover:to-[#8B6F2A]">
      <div className="flex items-start justify-between gap-3">
        <p className={confirmationStatLabelClass}>{label}</p>
        <span className={confirmationStatIconClass}>{icon}</span>
      </div>

      <p className={valueClass}>{value}</p>

      <p className={subtextClass}>{subtext}</p>
    </div>
  );
}
