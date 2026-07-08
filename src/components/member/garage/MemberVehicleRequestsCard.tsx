import type { MemberVehicleRequestItem } from "./types";

function RequestIcon({ icon }: { icon: MemberVehicleRequestItem["icon"] }) {
  if (icon === "transport") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.1" />
        <path
          d="M8 5V8L10 9.5"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === "detailing") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M3 9.5H4.2L5 7.5H11L11.8 9.5H13"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
        <path
          d="M2.5 9.5H13.5V11.5C13.5 12 13 12.5 12.5 12.5H3.5C3 12.5 2.5 12 2.5 11.5V9.5Z"
          stroke="currentColor"
          strokeWidth="1.1"
        />
        <path
          d="M5 3.5L5.6 4.7M8 3L8 4.5M11 3.5L10.4 4.7"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (icon === "maintenance") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M9.9 2.9c-.6.6-.8 1.5-.5 2.3L3.5 11c-.5.5-.5 1.3 0 1.8s1.3.5 1.8 0l5.8-5.9c.8.3 1.7.1 2.3-.5.6-.6.8-1.6.4-2.5l-2 2-1.4-1.4 2-2c-.9-.4-1.9-.2-2.5.5Z"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="1.1" />
      <path d="M10 10L13 13" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

type MemberVehicleRequestsCardProps = {
  requests: MemberVehicleRequestItem[];
};

export function MemberVehicleRequestsCard({
  requests,
}: MemberVehicleRequestsCardProps) {
  return (
    <div className="rounded-2xl border border-accent/10 bg-card p-5">
      <h2 className="font-copperplate text-[15px] uppercase">
        <span className="text-foreground">Vehicle </span>
        <span className="text-primary">Requests</span>
      </h2>

      <div className="mt-4 space-y-2.5">
        {requests.map((request) => (
          <div
            key={request.id}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition-colors ${
              request.highlighted
                ? "border-primary/40 bg-primary/6 hover:bg-primary/10"
                : "border-transparent bg-dark hover:border-accent/15"
            }`}
          >
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                request.highlighted
                  ? "bg-primary/15 text-primary"
                  : "bg-accent/8 text-secondary"
              }`}
            >
              <RequestIcon icon={request.icon} />
            </span>

            <div className="min-w-0 flex-1">
              <p className="font-roboto text-[13px] font-medium text-foreground">
                {request.title}
              </p>
              <p className="font-roboto text-[10px] tracking-[0.04em] text-secondary">
                {request.subtitle}
              </p>
            </div>

            {request.highlighted && (
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-dark">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path
                    d="M4.5 2.5L8 6L4.5 9.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
