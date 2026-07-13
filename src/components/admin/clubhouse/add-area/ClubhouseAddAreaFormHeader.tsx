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
          <span className="text-white">Add Area </span>
          <span className="text-[#C9A84C]">{areaLabel}</span>
        </h2>
        <p className="font-roboto text-[12px] font-medium tracking-[0.08em] text-[#C9A84C] uppercase">
          {subtitle}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="cursor-pointer text-[#7D7460] transition-colors hover:text-white"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
}
