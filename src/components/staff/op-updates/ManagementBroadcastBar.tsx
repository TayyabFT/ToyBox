import { MegaphoneIcon } from "./icons";
import type { ManagementBroadcast } from "./types";

type ManagementBroadcastBarProps = {
  broadcast: ManagementBroadcast;
};

export function ManagementBroadcastBar({ broadcast }: ManagementBroadcastBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/[0.04] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
          <MegaphoneIcon className="size-5" />
        </span>

        <div className="min-w-0 space-y-1">
          <p className="font-roboto text-[12px] font-semibold tracking-[0.06em] text-foreground">
            Management Broadcast —{" "}
            <span className="text-primary">{broadcast.author}</span>
            <span className="font-normal text-secondary"> · {broadcast.role}</span>
          </p>
          <p className="font-roboto text-[11px] leading-relaxed tracking-[0.02em] text-secondary">
            {broadcast.body}
          </p>
        </div>
      </div>

      <p className="font-roboto shrink-0 text-[10px] font-semibold tracking-[0.12em] text-primary uppercase">
        {broadcast.timeLabel}
      </p>
    </div>
  );
}
