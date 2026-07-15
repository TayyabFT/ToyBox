type ClubhouseAddAreaFormHeaderProps = {
  areaLabel: string;
  subtitle: string;
  onClose: () => void;
};

export function ClubhouseAddAreaFormHeader({
  areaLabel,
  subtitle,
  onClose,
}: ClubhouseAddAreaFormHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="space-y-1">
        <h2 className="font-copperplate text-[18px] leading-none tracking-[0.06em] uppercase">
          <span className="text-foreground">Add Area </span>
          <span className="text-accent">{areaLabel}</span>
        </h2>
        <p className="font-roboto text-[12px] font-medium tracking-[0.08em] text-accent uppercase">
          {subtitle}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="cursor-pointer text-secondary transition-colors hover:text-foreground"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
}
