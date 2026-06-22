type JobButtonVariant = "outline" | "gold" | "gray" | "danger-outline";

type JobActionButtonProps = {
  label: string;
  variant?: JobButtonVariant;
  className?: string;
};

const variantClass: Record<JobButtonVariant, string> = {
  outline:
    "border border-[#D4A8471A] bg-card text-primary hover:border-primary/35",
  gold: "border border-transparent bg-gradient-to-r from-[#F0C566] to-[#C9A84C] text-dark hover:opacity-90",
  gray: "border border-secondary/25 bg-secondary/8 text-secondary",
  "danger-outline":
    "border border-pink/35 bg-pink/8 text-pink hover:border-pink/50",
};

export function JobActionButton({
  label,
  variant = "outline",
  className = "",
}: JobActionButtonProps) {
  return (
    <button
      type="button"
      className={`font-roboto cursor-pointer rounded-lg px-3 py-2 text-[9px] font-medium tracking-[0.1em] uppercase transition-colors ${variantClass[variant]} ${className}`}
    >
      {label}
    </button>
  );
}

export function AssigneeBadge({ label }: { label: string }) {
  return (
    <span className="font-roboto inline-flex items-center rounded-lg border border-primary/35 bg-primary/8 px-3 py-2 text-[9px] font-medium tracking-[0.08em] text-primary uppercase">
      {label}
    </span>
  );
}
