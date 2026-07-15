import {
  confirmationSectionSubtitleClass,
  confirmationSectionTitleClass,
} from "./panelStyles";

type ConfirmationsOutsideHeaderProps = {
  titleSplit: { before: string; after: string };
  subtitle?: string;
};

export function ConfirmationsOutsideHeader({
  titleSplit,
  subtitle,
}: ConfirmationsOutsideHeaderProps) {
  return (
    <div className="mb-4 space-y-1.5">
      <h3 className={confirmationSectionTitleClass}>
        <span className="text-foreground-soft">{titleSplit.before} </span>
        <span className="text-accent">{titleSplit.after}</span>
      </h3>
      {subtitle && <p className={confirmationSectionSubtitleClass}>{subtitle}</p>}
    </div>
  );
}
