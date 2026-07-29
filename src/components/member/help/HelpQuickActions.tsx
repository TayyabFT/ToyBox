import { HelpCall, HelpMessage, HelpRequest } from "@/components/common/Svgs";

const actions = [
  {
    id: "call",
    title: "Call Concierge",
    subtitle: "24/7 · Direct Line",
    icon: HelpCall,
  },
  {
    id: "message",
    title: "Message James",
    subtitle: "Reply within 5 min",
    icon: HelpMessage,
  },
  {
    id: "request",
    title: "Submit a Request",
    subtitle: "Form-based ticket",
    icon: HelpRequest,
  },
] as const;

export function HelpQuickActions() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <button
            key={action.id}
            type="button"
            className="member-page-quick-action group flex cursor-pointer items-center gap-4 rounded-2xl px-5 py-5 text-left transition-all sm:flex-col sm:items-start sm:px-8 sm:py-7"
          >
            <span className="member-page-quick-action-icon flex size-11 shrink-0 items-center justify-center rounded-xl transition-all sm:size-12">
              <Icon stroke="currentColor" />
            </span>

            <span className="min-w-0 space-y-0.5">
              <span className="member-page-quick-action-title font-roboto block text-[12px] font-semibold tracking-[0.14em] text-foreground uppercase transition-colors sm:text-[13px]">
                {action.title}
              </span>
              <span className="member-page-quick-action-subtitle font-roboto block text-[10px] tracking-[0.1em] text-secondary uppercase transition-colors sm:text-[11px]">
                {action.subtitle}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
