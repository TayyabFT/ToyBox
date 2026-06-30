import type { FlaggedIssue } from "./types";

type FlaggedIssuesSectionProps = {
  issues: FlaggedIssue[];
};

export function FlaggedIssuesSection({ issues }: FlaggedIssuesSectionProps) {
  if (issues.length === 0) return null;

  return (
    <section className="space-y-4 px-5 py-5">
      <h3 className="font-copperplate text-[11px] tracking-[0.04em] text-foreground uppercase">
        Flagged Issues
      </h3>

      <div className="space-y-3">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="flex flex-col gap-3 rounded-xl border border-accent/12 bg-elevated/60 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 space-y-1">
              <p className="font-roboto text-[12px] font-medium tracking-[0.02em] text-foreground">
                {issue.title}
              </p>
              <p className="font-roboto text-[10px] tracking-[0.04em] text-secondary">
                {issue.description}
              </p>
            </div>

            <button
              type="button"
              className="font-roboto shrink-0 cursor-pointer rounded-lg border border-primary/35 bg-transparent px-4 py-2 text-[10px] font-semibold tracking-[0.1em] text-primary uppercase transition-colors hover:bg-primary/10"
            >
              {issue.actionLabel}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
