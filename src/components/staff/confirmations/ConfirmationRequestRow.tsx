import { ConfirmationStatusBadge } from "./ConfirmationStatusBadge";
import type { ConfirmationRequestItem } from "./types";

type ConfirmationRequestRowProps = {
  request: ConfirmationRequestItem;
  onOfferVehicle?: (request: ConfirmationRequestItem) => void;
};

export function ConfirmationRequestRow({
  request,
  onOfferVehicle,
}: ConfirmationRequestRowProps) {
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

      <div className="flex shrink-0 items-center gap-2">
        <ConfirmationStatusBadge tone={request.status} label="" />
        {request.showOfferVehicle && (
          <button
            type="button"
            onClick={() => onOfferVehicle?.(request)}
            className="font-roboto flex cursor-pointer font-extrabold items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-[9px] font-semibold tracking-[0.08em] text-dark uppercase"
          >
            +
            Offer a Vehicle
          </button>
        )}
      </div>
    </div>
  );
}
