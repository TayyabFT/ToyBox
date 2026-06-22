type JobProgressBarProps = {
  value: number;
  tone?: "gold" | "teal";
  note?: string;
};

export function JobProgressBar({
  value,
  tone = "gold",
  note,
}: JobProgressBarProps) {
  const barClass =
    tone === "teal"
      ? "bg-teal"
      : "bg-gradient-to-r from-[#F0C566] to-[#C9A84C]";

  return (
    <div className="space-y-1.5">
      <div className="h-1 overflow-hidden rounded-full bg-accent/12">
        <div
          className={`h-full rounded-full ${barClass}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {note && (
        <p className="font-roboto text-[9px] tracking-[0.06em] text-secondary uppercase">
          {note}
        </p>
      )}
    </div>
  );
}
