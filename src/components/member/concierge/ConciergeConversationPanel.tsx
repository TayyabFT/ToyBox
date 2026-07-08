import { SectionHeader } from "@/components/staff/overview/SectionHeader";
import type { ChatConversation } from "@/types/api";

type ConciergeConversationPanelProps = {
  conversation: ChatConversation | null;
  loading?: boolean;
};

export function ConciergeConversationPanel({
  conversation,
  loading = false,
}: ConciergeConversationPanelProps) {
  const isActive = conversation?.status === "active";
  const unreadCount = conversation?.unreadForMember ?? 0;

  return (
    <section className="overflow-hidden rounded-2xl border border-accent/10 bg-card">
      <div className="px-5 pt-5">
        <SectionHeader
          title="Your Concierge"
          badge={
            isActive ? { label: "online", tone: "green" } : { label: "away", tone: "gold" }
          }
        />
      </div>

      <div className="space-y-4 px-5 pb-5">
        {loading ? (
          <p className="font-roboto py-8 text-center text-[11px] tracking-[0.06em] text-secondary uppercase">
            Loading...
          </p>
        ) : conversation ? (
          <>
            <div className="rounded-xl border border-accent/10 bg-surface px-4 py-4">
              <p className="font-roboto text-[10px] tracking-[0.12em] text-section-label uppercase">
                Concierge Team
              </p>
              <p className="mt-2 font-roboto text-[14px] font-medium tracking-[0.02em] text-foreground">
                Toy Box Concierge
              </p>
              <p className="mt-2 font-roboto text-[12px] leading-relaxed tracking-[0.02em] text-secondary">
                {conversation.lastMessage || "No messages yet. Send a message to start."}
              </p>
            </div>

            {unreadCount > 0 ? (
              <p className="font-roboto text-[10px] tracking-[0.1em] text-primary uppercase">
                {unreadCount} unread message{unreadCount === 1 ? "" : "s"}
              </p>
            ) : null}

            {conversation.lastMessageAt ? (
              <p className="font-roboto text-[10px] tracking-[0.08em] text-section-label uppercase">
                Last activity · {conversation.lastMessageAt}
              </p>
            ) : null}
          </>
        ) : (
          <p className="font-roboto py-8 text-center text-[11px] tracking-[0.06em] text-secondary uppercase">
            Start a conversation with concierge below
          </p>
        )}
      </div>
    </section>
  );
}
