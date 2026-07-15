type EventsEmptyStateProps = {
  message: string;
};

export function EventsEmptyState({ message }: EventsEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-accent/12 bg-card px-5">
      <p className="font-roboto py-6 text-center text-[11px] tracking-[0.06em] text-section-label uppercase">
        {message}
      </p>
    </div>
  );
}
