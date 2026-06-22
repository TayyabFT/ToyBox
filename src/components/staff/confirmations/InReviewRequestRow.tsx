import { ConfirmationStatusBadge } from "./ConfirmationStatusBadge";
import type { ConfirmationRequestItem } from "./types";

type InReviewRequestRowProps = {
  request: ConfirmationRequestItem;
};

export function InReviewRequestRow({ request }: InReviewRequestRowProps) {
  return (
    <div className="flex items-center gap-4 border border-[#D4A84714] px-4 py-4 bg-[#1A1612] rounded-lg">
      <div className="min-w-0 flex-1 space-y-1">
        <p className="font-roboto truncate font-medium tracking-[0.03em] text-[#F2EAD5]">
          {request.vehicle}
        </p>
        <p className="font-roboto truncate text-xs tracking-[0.06em] text-secondary uppercase">
          {request.member} · {request.schedule}
        </p>
      </div>

      <ConfirmationStatusBadge tone="in-review" label="" />
    </div>
  );
}
