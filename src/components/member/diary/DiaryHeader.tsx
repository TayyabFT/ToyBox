import type { DiaryStat } from "./types";

type DiaryHeaderProps = {
  eyebrow: string;
  title: string;
  recordEyebrow: string;
  recordTitlePrefix: string;
  recordTitleHighlight: string;
  recordSubtitle: string;
  stats: DiaryStat[];
};

export function DiaryHeader({
  eyebrow,
  title,
  recordEyebrow,
  recordTitlePrefix,
  recordTitleHighlight,
  recordSubtitle,
  stats,
}: DiaryHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="space-y-1.5">
        <p className="font-roboto align-middle text-[10px] font-normal leading-[100%] tracking-[2.4px] text-secondary uppercase sm:text-[11px] sm:tracking-[2.86px]">
          {eyebrow}
        </p>
        <h1 className="font-copperplate align-middle text-[30px] font-light leading-[30px] tracking-[-0.75px] uppercase sm:text-[38px] sm:leading-[38px] sm:tracking-[-0.95px] lg:text-[46px] lg:leading-[46px] lg:tracking-[-1.15px]">
          <span className="text-foreground">{title.split(" ")[0]} </span>
          <span className="font-normal text-primary">
            {title.split(" ").slice(1).join(" ")}
          </span>
        </h1>
      </div>

      {/* Record hero card — intentionally dark in both themes */}
      <div className="diary-record-card relative overflow-hidden rounded-[24px]">
        {/* Layered gold surface — matches the club news cards */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 90% at 100% -10%, rgba(197, 160, 89, 0.28) 0%, rgba(197, 160, 89, 0.08) 38%, transparent 66%),
              linear-gradient(120deg, rgba(24, 21, 17, 0.6) 0%, rgba(13, 12, 10, 1) 55%)
            `,
          }}
        />

        <div className="relative flex flex-col p-5">
          {/* Top text block */}
          <div className="sm:p-7 md:p-2 space-y-2.5">
            <p className="diary-record-eyebrow font-roboto text-[10px] font-semibold tracking-[0.24em] uppercase">
              {recordEyebrow}
            </p>
            <h2 className="font-copperplate align-middle text-[16px] font-light leading-tight tracking-[0.05em] sm:text-[20px] md:text-[24px]">
              <span className="diary-record-title">{recordTitlePrefix} </span>
              <span className="diary-record-highlight font-normal">{recordTitleHighlight}</span>
            </h2>
            <p className="diary-record-subtitle font-roboto align-middle text-[13px] font-light leading-[20px] tracking-[0.01em] sm:text-[14px] sm:leading-[21.7px]">
              {recordSubtitle}
            </p>
          </div>

          {/* Stats - Full Width Bottom Bar */}
          <div className="relative mt-4 bg-black/45 text-center grid grid-cols-2 gap-y-6 sm:grid-cols-4 rounded-[23px]">
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className={[
                  "space-y-1.5 sm:space-y-2 px-2 py-3 sm:px-2 sm:py-3 md:px-3",
                  idx % 2 !== 0 ? "border-l border-accent/10" : "",
                  idx > 0 ? "sm:border-l sm:border-accent/10" : "sm:border-l-0",
                ].join(" ")}
              >
                <p className="diary-record-stat-value font-copperplate text-[24px] leading-none tracking-[0.01em] sm:text-[24px] md:text-[24px]">
                  {stat.value}
                </p>
                <p className="diary-record-stat-label font-roboto text-[8.5px] tracking-[0.14em] uppercase sm:text-[10px] sm:tracking-[0.16em]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
