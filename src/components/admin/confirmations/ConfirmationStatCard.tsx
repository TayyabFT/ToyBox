import { ShimmerBlock } from "@/components/common/ShimmerBlock";
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
  valueLoading?: boolean;
};

export function ConfirmationStatCard({
  label,
  value,
  subtext,
  accent = "gold",
  icon,
  valueLoading = false,
}: ConfirmationStatCardProps) {
  const valueClass =
    accent === "teal" ? confirmationStatValueTealClass : confirmationStatValueClass;
  const subtextClass =
    accent === "teal" ? confirmationStatSubtextTealClass : confirmationStatSubtextClass;

  return (
    <div className="stat-card-shell group flex min-h-[148px] cursor-pointer flex-col justify-between rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <p className={confirmationStatLabelClass}>{label}</p>
        <span className={confirmationStatIconClass}>{icon}</span>
      </div>

      {valueLoading ? (
        <ShimmerBlock className="h-[42px] w-16" />
      ) : (
        <p className={valueClass}>{value}</p>
      )}

      <p className={subtextClass}>{subtext}</p>
    </div>
  );
}
