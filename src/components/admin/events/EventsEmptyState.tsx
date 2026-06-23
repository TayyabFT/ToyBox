type EventsEmptyStateProps = {
  message: string;
};

export function EventsEmptyState({ message }: EventsEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-[#2A2620] bg-[#12110E] px-5">
      <p className="font-roboto py-6 text-center text-[11px] tracking-[0.06em] text-[#8A8378] uppercase">
        {message}
      </p>
    </div>
  );
}
