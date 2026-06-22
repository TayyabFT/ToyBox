import {
  ActionCamera,
  ActionCheckbox,
  ActionMessage,
  VehicleCalendar,
} from "@/components/common/Svgs";

const actions = [
  { label: "Book Annual Service", icon: <VehicleCalendar /> },
  { label: "Log Inspection", icon: <ActionCheckbox /> },
  { label: "Add Photos", icon: <ActionCamera /> },
  { label: "Message Concierge", icon: <ActionMessage /> },
];

export function QuickActions() {
  return (
    <div className="space-y-3">
      <h3 className="font-copperplate text-[11px] text-foreground">
        Quick Actions
      </h3>

      <div className="space-y-2">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            className="font-roboto flex w-full cursor-pointer items-center gap-3 rounded-xl border border-accent/18 bg-card px-4 py-3 text-left text-[10px] font-medium tracking-[0.08em] text-foreground uppercase transition-colors hover:border-accent/30"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-accent/18 bg-accent/6 [&_svg]:size-[16px]">
              {action.icon}
            </span>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
