type StatusPillTone = "red" | "green" | "gold";

const toneClass: Record<StatusPillTone, string> = {
  red: "border-pink/28 bg-pink/8 text-pink",
  green: "border-teal/28 bg-teal/8 text-teal",
  gold: "border-accent/28 bg-accent/8 text-primary",
};

type StatusPillProps = {
  label: string;
  tone: StatusPillTone;
};

export function StatusPill({ label, tone }: StatusPillProps) {
  return (
    <span
      className={`font-roboto inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-medium tracking-[0.08em] uppercase ${toneClass[tone]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
