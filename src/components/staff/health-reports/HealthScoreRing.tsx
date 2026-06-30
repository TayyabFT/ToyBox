type HealthScoreRingProps = {
  value: number;
};

function getRingColor(value: number): string {
  if (value < 50) return "var(--pink)";
  if (value < 70) return "var(--primary)";
  return "var(--teal)";
}

export function HealthScoreRing({ value }: HealthScoreRingProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const ringColor = getRingColor(value);
  const valueColor =
    value < 50 ? "text-pink" : value < 70 ? "text-primary" : "text-teal";

  return (
    <div className="relative flex size-[140px] shrink-0 items-center justify-center">
      <svg
        width="140"
        height="140"
        viewBox="0 0 140 140"
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="color-mix(in srgb, var(--accent) 12%, transparent)"
          strokeWidth="8"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-copperplate text-[36px] leading-none ${valueColor}`}>
          {value}
        </span>
        <span className="font-roboto mt-1 text-[9px] tracking-[0.12em] text-secondary uppercase">
          Health %
        </span>
      </div>
    </div>
  );
}
