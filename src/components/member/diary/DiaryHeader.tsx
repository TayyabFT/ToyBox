import {
  memberPageEyebrowClass,
  memberPageTitleAccentClass,
  memberPageTitleClass,
  memberPageTitlePrefixClass,
} from "@/components/member/memberPageStyles";
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

function splitPageTitle(title: string): { prefix: string; accent: string } {
  const words = title.trim().split(/\s+/);

  if (words.length <= 1) {
    return { prefix: title, accent: "" };
  }

  return {
    prefix: words.slice(0, -1).join(" "),
    accent: words[words.length - 1] ?? "",
  };
}

export function DiaryHeader({
  eyebrow,
  title,
  recordEyebrow,
  recordTitlePrefix,
  recordTitleHighlight,
  recordSubtitle,
  stats,
}: DiaryHeaderProps) {
  const { prefix, accent } = splitPageTitle(title);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className={memberPageEyebrowClass}>{eyebrow}</p>
        <h1 className={memberPageTitleClass}>
          <span className={memberPageTitlePrefixClass}>{prefix}</span>
          {accent ? (
            <>
              {" "}
              <span className={memberPageTitleAccentClass}>{accent}</span>
            </>
          ) : null}
        </h1>
      </div>

      <div className="diary-record-card relative overflow-hidden rounded-[24px]">
        <div
          aria-hidden
          className="diary-record-surface pointer-events-none absolute inset-0"
        />

        <div className="relative flex flex-col p-5">
          <div className="space-y-2.5 sm:p-7 md:p-2">
            <p className="diary-record-eyebrow font-roboto text-[10px] font-semibold tracking-[0.24em] uppercase">
              {recordEyebrow}
            </p>
            <h2 className="font-copperplate text-[16px] font-normal leading-tight tracking-[0.05em] sm:text-[20px] md:text-[24px]">
              <span className="diary-record-title">{recordTitlePrefix} </span>
              <span className="diary-record-highlight font-normal">
                {recordTitleHighlight}
              </span>
            </h2>
            <p className="diary-record-subtitle font-roboto text-[13px] font-light leading-relaxed tracking-[0.01em] sm:text-[14px]">
              {recordSubtitle}
            </p>
          </div>

          <div className="diary-record-stats relative mt-4 grid grid-cols-2 gap-y-6 rounded-[23px] text-center sm:grid-cols-4">
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className={[
                  "space-y-1.5 px-2 py-3 sm:space-y-2 sm:px-2 sm:py-3 md:px-3",
                  idx % 2 !== 0 ? "border-l border-accent/10" : "",
                  idx > 0 ? "sm:border-l sm:border-accent/10" : "sm:border-l-0",
                ].join(" ")}
              >
                <p className="diary-record-stat-value font-copperplate text-[24px] leading-none tracking-[0.01em]">
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
