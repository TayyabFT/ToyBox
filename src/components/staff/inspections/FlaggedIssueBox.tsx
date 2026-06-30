import { ActionCamera } from "@/components/common/Svgs";

type FlaggedIssueBoxProps = {
  tag: string;
  notes: string;
};

export function FlaggedIssueBox({ tag, notes }: FlaggedIssueBoxProps) {
  return (
    <section className="space-y-4 rounded-xl border border-pink/30 bg-pink/[0.04] p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-roboto rounded-full border border-pink/40 bg-pink/12 px-2.5 py-1 text-[9px] font-semibold tracking-[0.08em] text-pink uppercase">
          1 Issue Flagged
        </span>
        <span className="font-roboto rounded-full border border-accent/20 bg-card px-2.5 py-1 text-[9px] font-semibold tracking-[0.08em] text-secondary uppercase">
          {tag}
        </span>
      </div>

      <textarea
        readOnly
        value={notes}
        rows={3}
        className="font-roboto w-full resize-none rounded-xl border border-accent/15 bg-dark px-4 py-3 text-[12px] leading-relaxed tracking-[0.02em] text-foreground outline-none"
      />

      <button
        type="button"
        className="font-roboto flex cursor-pointer items-center gap-2 rounded-lg border border-accent/20 bg-card px-4 py-2.5 text-[10px] font-semibold tracking-[0.1em] text-primary uppercase transition-colors hover:border-primary/35 hover:bg-accent/8"
      >
        <ActionCamera />
        Add Photo Evidence
      </button>
    </section>
  );
}
