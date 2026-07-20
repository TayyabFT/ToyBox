"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { memberChatApi } from "@/api/memberChat.api";
import { ConciergeAlertBar } from "@/components/staff/concierge/ConciergeAlertBar";
import { OpenRequestsPanel } from "@/components/staff/concierge/OpenRequestsPanel";
import { filterOpenRequests } from "@/lib/concierge";
import {
  buildMemberUrgentAlert,
  getMemberActiveConversationCount,
  mapMemberThreadsToOpenRequests,
} from "@/lib/memberConcierge";
import { showError } from "@/lib/toast";
import type { MemberChatThread } from "@/types/api";
import type { ConciergeFilter } from "@/components/staff/concierge/types";
import { ConciergeChatPanel } from "./ConciergeChatPanel";
import { ConciergeGreeting } from "./ConciergeGreeting";

export function MemberConciergePage() {
  const [activeFilter, setActiveFilter] = useState<ConciergeFilter>("all");
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    null,
  );
  const [threads, setThreads] = useState<MemberChatThread[]>([]);
  const [loading, setLoading] = useState(true);

  const markContactRead = useCallback((contactId: string) => {
    setThreads((prev) =>
      prev.map((thread) =>
        thread.contact.id === contactId
          ? { ...thread, unreadForMember: 0 }
          : thread,
      ),
    );
    memberChatApi.markRead(contactId).catch(() => {});
  }, []);

  const loadInbox = useCallback(async () => {
    setLoading(true);

    try {
      const response = await memberChatApi.getInbox();
      const nextThreads = response.data.conversations ?? [];

      setThreads(nextThreads);
      setSelectedContactId((current) => {
        const next = (() => {
          if (current && nextThreads.some((thread) => thread.contact.id === current)) {
            return current;
          }
          return nextThreads[0]?.contact.id ?? null;
        })();

        // Mark the selected thread as read if it has unread messages
        if (next) {
          const thread = nextThreads.find((t) => t.contact.id === next);
          if ((thread?.unreadForMember ?? 0) > 0) {
            memberChatApi.markRead(next).catch(() => {});
          }
        }

        return next;
      });
    } catch {
      setThreads([]);
      setSelectedContactId(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInbox();
  }, [loadInbox]);

  const openRequests = useMemo(
    () => mapMemberThreadsToOpenRequests(threads),
    [threads],
  );

  const filteredRequests = useMemo(
    () => filterOpenRequests(openRequests, activeFilter),
    [openRequests, activeFilter],
  );

  useEffect(() => {
    if (selectedContactId === null) return;

    const isSelectedVisible = filteredRequests.some(
      (request) => request.id === selectedContactId,
    );

    if (!isSelectedVisible) {
      setSelectedContactId(filteredRequests[0]?.id ?? null);
    }
  }, [activeFilter, filteredRequests, selectedContactId]);

  const activeCount = getMemberActiveConversationCount(threads);
  const alert = buildMemberUrgentAlert(threads);
  const selectedThread = threads.find(
    (thread) => thread.contact.id === selectedContactId,
  );
  const isChatSelected = Boolean(
    selectedContactId &&
      filteredRequests.some((request) => request.id === selectedContactId),
  );

  function handleSelectContact(contactId: string) {
    setSelectedContactId(contactId);
    markContactRead(contactId);
  }

  function handleHandleAlert() {
    const firstUnread = threads.find(
      (thread) => (thread.unreadForMember ?? 0) > 0,
    );

    if (firstUnread) {
      handleSelectContact(firstUnread.contact.id);
    }
  }

  async function handleRefresh() {
    try {
      await loadInbox();
    } catch (error) {
      showError(
        (error as { message?: string }).message ??
          "Failed to refresh concierge data",
      );
    }
  }

  return (
    <div className="space-y-6 p-8">
      <ConciergeGreeting
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {alert ? (
        <ConciergeAlertBar alert={alert} onHandle={handleHandleAlert} />
      ) : null}

      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-3">
        <OpenRequestsPanel
          requests={filteredRequests}
          activeCount={activeCount}
          selectedId={selectedContactId ?? ""}
          loading={loading}
          onSelect={handleSelectContact}
        />

        <div className="col-span-2 flex flex-col">
          <ConciergeChatPanel
            enabled={isChatSelected}
            contactId={selectedContactId ?? undefined}
            chatTitle={selectedThread?.contact.name ?? "Concierge"}
            onMessageSent={handleRefresh}
          />
        </div>
      </div>
    </div>
  );
}
