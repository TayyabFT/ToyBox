import { ConfirmationStatusBadge } from "./ConfirmationStatusBadge";
import type { ConfirmationRequestItem } from "./types";

type ConfirmedRequestRowProps = {
  request: ConfirmationRequestItem;
};

export function ConfirmedRequestRow({ request }: ConfirmedRequestRowProps) {
  return (
    <div className="flex items-center gap-4 border-b border-accent/6 px-4 py-4 last:border-b-0">
      <div className="min-w-0 flex-1 space-y-1">
        <p className="font-roboto truncate font-medium tracking-[0.03em] text-foreground">
          {request.vehicle}
        </p>
        <p className="font-roboto truncate text-xs tracking-[0.06em] text-secondary uppercase">
          {request.reference} · {request.member} · {request.schedule}
        </p>
      </div>

      <ConfirmationStatusBadge tone="confirmed" label="" />
    </div>
  );
}
