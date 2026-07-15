import { DiaryEntryCard } from "./DiaryEntryCard";
import {
  dashboardSectionHeadingClass,
  dashboardSectionSubtitleClass,
} from "@/components/member/dashboard/dashboardStyles";
import type { DiaryGroup, DiaryEntry } from "./types";

type RenderItem =
  | { type: "header"; id: string; label: string; countLabel: string }
  | { type: "entry"; entry: DiaryEntry };

export function DiaryTimeline({ groups }: { groups: DiaryGroup[] }) {
  const renderItems: RenderItem[] = [];

  groups.forEach((group) => {
    renderItems.push({
      type: "header",
      id: group.id,
      label: group.label,
      countLabel: group.countLabel || "",
    });
    group.entries.forEach((entry) => {
      renderItems.push({
        type: "entry",
        entry,
      });
    });
  });

  const entriesOnly = renderItems.filter(
    (item): item is Extract<RenderItem, { type: "entry" }> =>
      item.type === "entry",
  );
  const firstEntryId = entriesOnly[0]?.entry.id;
  const lastEntryId = entriesOnly[entriesOnly.length - 1]?.entry.id;

  return (
    <div className="relative">
      {renderItems.map((item, index) => {
        if (item.type === "header") {
          return (
            <div key={item.id} className="relative pb-5">
              {/* Left column (timeline line only) absolute */}
              {/* <div className="absolute left-[-20px] w-6 top-0 bottom-0 flex justify-center">
                {index > 0 && (
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-accent/18"
                  />
                )}
              </div> */}

              {/* Right column (header text) */}
              <div className="mt-4 space-y-1">
                <h2 className={`${dashboardSectionHeadingClass} text-primary`}>
                  {item.label}
                </h2>
                <p className={dashboardSectionSubtitleClass}>
                  {item.countLabel}
                </p>
              </div>
            </div>
          );
        }

        const isFirstOfAll = item.entry.id === firstEntryId;
        const isLastOfAll = item.entry.id === lastEntryId;

        return (
          <div key={item.entry.id} className="relative pb-8 last:pb-0">
            {/* Left column (timeline node + line) absolute */}
            <div className="absolute left-[0px] w-6 top-0 bottom-0 flex justify-center">
              {/* Line */}
              <span
                aria-hidden
                className={[
                  "absolute left-1/2 w-px -translate-x-1/2 bg-accent/18",
                  isFirstOfAll ? "top-3 bottom-0" : isLastOfAll ? "top-0 h-3" : "inset-y-0",
                ].join(" ")}
              />
              {/* Dot node */}
              <span className="relative z-10 mt-1.5 flex size-5 items-center justify-center rounded-full border border-accent/50 bg-background shadow-[0_0_0_4px_var(--background)]">
                <span className="size-2 rounded-full bg-accent" />
              </span>
            </div>

            {/* Right column (Entry Content) */}
            <div className="min-w-0 ml-10">
              <DiaryEntryCard entry={item.entry} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
