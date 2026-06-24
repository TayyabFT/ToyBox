import { VehicleSend } from "@/components/common/Svgs";

export function StaffNote() {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h3 className="font-copperplate text-[11px] text-foreground">
          Staff Note
        </h3>
        <p className="font-roboto text-[9px] tracking-[0.08em] text-secondary uppercase">
          Add note to vehicle log
        </p>
      </div>

      <textarea
        rows={4}
        placeholder="Tap to write a note for the team..."
        className="font-roboto w-full resize-none rounded-xl border border-accent/15 bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-secondary/70 focus:border-accent/30"
      />

      <button
        type="button"
        className="font-roboto flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gold-bright to-primary py-3 text-[11px] font-semibold tracking-[0.12em] text-dark uppercase"
      >
        <VehicleSend />
        Submit Note
      </button>
    </div>
  );
}
