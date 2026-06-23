"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { chatApi } from "@/api/chat.api";
import { membersApi } from "@/api/members.api";
import {
  buildUrgentAlert,
  getActiveConversationCount,
  filterOpenRequests,
  indexMembersById,
  mapConversationsToOpenRequests,
  mapMemberToConciergeDetail,
} from "@/lib/concierge";
import { showError } from "@/lib/toast";
import type { ChatConversation, MemberListItemRaw } from "@/types/api";
import { ConciergeAlertBar } from "./ConciergeAlertBar";
import { ConciergeGreeting } from "./ConciergeGreeting";
import { MemberChatPanel } from "./MemberChatPanel";
import { OpenRequestsPanel } from "./OpenRequestsPanel";
import { RequestDetailPanel } from "./RequestDetailPanel";
import type {
  ConciergeAlert,
  ConciergeFilter,
  ConciergeOpenRequest,
  ConciergeRequestDetail,
} from "./types";

const emptyDetail: ConciergeRequestDetail = {
  id: "",
  memberName: "—",
  memberInitial: "—",
  memberStatus: "—",
  memberTier: "—",
  memberId: "—",
  conciergeLead: "—",
  checklist: [],
  logistics: [],
  chatTitle: "",
  chatOnline: false,
  chatMessages: [],
};

export function ConciergePage() {
  const [activeFilter, setActiveFilter] = useState<ConciergeFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openRequests, setOpenRequests] = useState<ConciergeOpenRequest[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [membersById, setMembersById] = useState<
    Record<string, MemberListItemRaw>
  >({});
  const [activeCount, setActiveCount] = useState(0);
  const [alert, setAlert] = useState<ConciergeAlert | null>(null);
  const [selectedDetail, setSelectedDetail] =
    useState<ConciergeRequestDetail>(emptyDetail);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadConversations = useCallback(async () => {
    setLoading(true);

    try {
      const [conversationsResponse, membersResponse] = await Promise.all([
        chatApi.getConversations(),
        membersApi.getMembers({ limit: 100 }),
      ]);

      const memberIndex = indexMembersById(membersResponse.data.members);
      const nextConversations = conversationsResponse.data.conversations;
      const requests = mapConversationsToOpenRequests(
        nextConversations,
        memberIndex,
      );

      setMembersById(memberIndex);
      setConversations(nextConversations);
      setOpenRequests(requests);
      setActiveCount(getActiveConversationCount(nextConversations));
      setAlert(buildUrgentAlert(nextConversations));
      setSelectedId((current) => {
        if (current && requests.some((request) => request.id === current)) {
          return current;
        }

        return requests[0]?.id ?? null;
      });
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load concierge data";

      showError(message);
      setOpenRequests([]);
      setConversations([]);
      setActiveCount(0);
      setAlert(null);
      setSelectedId(null);
      setSelectedDetail(emptyDetail);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMemberDetail = useCallback(
    async (request: ConciergeOpenRequest | null) => {
      if (!request) {
        setSelectedDetail(emptyDetail);
        return;
      }

      setDetailLoading(true);

      try {
        const response = await membersApi.getMemberById(request.apiMemberId);
        const conversation =
          conversations.find((item) => item.conversationId === request.id) ??
          null;

        if (!response.success || !response.data) {
          throw new Error(response.message || "Failed to load member profile");
        }

        setSelectedDetail(
          mapMemberToConciergeDetail(response.data, conversation),
        );
      } catch (error) {
        const message =
          (error as { message?: string }).message ??
          "Failed to load member profile";

        showError(message);
        setSelectedDetail(emptyDetail);
      } finally {
        setDetailLoading(false);
      }
    },
    [conversations],
  );

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  const filteredRequests = useMemo(
    () => filterOpenRequests(openRequests, activeFilter),
    [openRequests, activeFilter],
  );

  useEffect(() => {
    if (selectedId === null) return;

    const isSelectedVisible = filteredRequests.some(
      (request) => request.id === selectedId,
    );

    if (!isSelectedVisible) {
      setSelectedId(null);
    }
  }, [activeFilter, filteredRequests, selectedId]);

  const selectedRequest = useMemo(() => {
    if (!selectedId) return null;

    return (
      filteredRequests.find((request) => request.id === selectedId) ?? null
    );
  }, [filteredRequests, selectedId]);

  useEffect(() => {
    void loadMemberDetail(selectedRequest);
  }, [loadMemberDetail, selectedRequest]);

  function handleSelectRequest(id: string) {
    setSelectedId(id);
  }

  function handleHandleAlert() {
    const urgent = conversations.find(
      (conversation) => conversation.unreadForAdmin > 0,
    );

    if (urgent) {
      setSelectedId(urgent.conversationId);
    }
  }

  return (
    <div className="space-y-6 p-8">
      <ConciergeGreeting
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {alert && (
        <ConciergeAlertBar alert={alert} onHandle={handleHandleAlert} />
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <OpenRequestsPanel
          requests={filteredRequests}
          activeCount={activeCount}
          selectedId={selectedId ?? ""}
          loading={loading}
          onSelect={handleSelectRequest}
        />

        <div className="col-span-2 space-y-6">
          {/* <RequestDetailPanel
            detail={selectedDetail}
            loading={detailLoading}
          /> */}
          <MemberChatPanel
            memberId={selectedRequest?.apiMemberId ?? null}
            memberName={selectedRequest?.member ?? "Member"}
            onMessageSent={loadConversations}
          />
        </div>
      </div>
    </div>
  );
}
