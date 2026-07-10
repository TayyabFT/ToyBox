import Link from "next/link";
import {
  ActionGarage,
  ActionConcierge,
  ActionBook,
  ActionSource,
  ChevronRight,
} from "@/components/common/Svgs";
import type { MemberQuickActionView } from "@/lib/memberDashboard";

type MemberQuickActionsProps = {
  actions: MemberQuickActionView[];
};

const ICON_MAP: Record<string, React.ReactNode> = {
  garage: <ActionGarage color="currentColor" />,
  detailing: <ActionBook color="currentColor" />,
  maintenance: <ActionBook color="currentColor" />,
  transport: <ActionConcierge color="currentColor" />,
  sourcing: <ActionSource color="currentColor" />,
  concierge: <ActionConcierge color="currentColor" />,
  book: <ActionBook color="currentColor" />,
  source: <ActionSource color="currentColor" />,
};

function resolveIcon(id: string) {
  return ICON_MAP[id] ?? <ActionGarage color="currentColor" />;
}

export function MemberQuickActions({ actions }: MemberQuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.id}
          href={action.href}
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-accent/10 bg-card px-4 py-4 transition-colors hover:border-primary/30"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-accent/22 bg-accent/6 text-accent [&_svg]:size-[18px]">
            {resolveIcon(action.id)}
          </span>

          <span className="min-w-0 flex-1 space-y-0.5">
            <span className="font-copperplate block text-[11px] leading-tight text-foreground uppercase">
              {action.title}
            </span>
            <span className="font-roboto block text-[9px] tracking-[0.08em] text-secondary uppercase">
              {action.subtitle}
            </span>
          </span>

          <ChevronRight className="size-4 shrink-0 opacity-30 [&_path]:stroke-current" />
        </Link>
      ))}
    </div>
  );
}
