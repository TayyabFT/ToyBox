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
      className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors ${
        read
          ? "border-accent/8 bg-transparent hover:bg-foreground/2"
          : "border-accent/12 bg-accent/4 hover:bg-accent/8"
      }`}
    >
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
