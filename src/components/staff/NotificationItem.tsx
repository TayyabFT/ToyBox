import { Bell } from "@/components/common/Svgs";

type NotificationItemProps = {
  title: string;
  subheading: string;
  read: boolean;
  onClick?: () => void;
};

export function NotificationItem({
  title,
  subheading,
  read,
  onClick,
}: NotificationItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`staff-notif-item flex w-full cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors ${
        read
          ? "border-accent/8 bg-transparent hover:bg-foreground/2"
          : "staff-notif-item--unread border-accent/12 bg-accent/4 hover:bg-accent/8"
      }`}
    >
      <span
        className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border ${
          read
            ? "border-accent/10 bg-accent/5"
            : "border-primary/25 bg-primary/10"
        }`}
      >
        <Bell
          className="size-3.5"
          color={read ? "var(--muted)" : "var(--primary)"}
        />
      </span>

      <div className="min-w-0 flex-1 space-y-1">
        <p
          className={`font-roboto text-[13px] tracking-[0.04em] line-clamp-2 ${
            read ? "font-normal text-muted" : "font-medium text-foreground"
          }`}
        >
          {title}
        </p>
        <p className="font-roboto text-[10px] tracking-[0.04em] text-secondary uppercase line-clamp-4">
          {subheading}
        </p>
      </div>

      {!read && (
        <span
          aria-label="Unread"
          className="mt-1.5 size-2 shrink-0 rounded-full bg-primary shadow-[var(--shadow-glow-primary)]"
        />
      )}
    </button>
  );
}
