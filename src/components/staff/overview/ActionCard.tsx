import Link from "next/link";
import { ChevronRight } from "@/components/common/Svgs";

type ActionCardProps = {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  href: string;
};

export function ActionCard({ title, subtitle, icon, href }: ActionCardProps) {
  return (
    <Link
      href={href}
      className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-accent/10 bg-[var(--stat-card-bg)] px-5 py-7 text-left transition-colors hover:border-primary/25"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-accent/22 bg-accent/4 [&_svg]:size-[18px]">
        {icon}
      </span>

      <span className="min-w-0 flex-1 space-y-1.5">
        <span className="font-copperplate block text-[13px] text-foreground">
          {title}
        </span>
        <span className="font-roboto block text-xs tracking-[0.06em] text-secondary uppercase">
          {subtitle}
        </span>
      </span>

      <ChevronRight />
    </Link>
  );
}
