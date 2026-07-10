import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  MemberEventsGroupedResponse,
  MemberEventsFlatResponse,
  MemberEventsRsvpResponse,
} from "@/types/api";

export type MemberEventsListParams = {
  /** "all" | "drives" | "auctions" | "dining" | "track" */
  category?: string;
};

export const memberEventsApi = {
  /**
   * GET /api/v1/events?grouped=true&category=...
   * Returns featured, thisWeek, nextMonth arrays.
   */
  getGrouped: (params: MemberEventsListParams = {}) => {
    const qs = new URLSearchParams({ grouped: "true" });
    if (params.category && params.category !== "all") {
      qs.set("category", params.category);
    }
    return apiClient<MemberEventsGroupedResponse>(
      `${API_ENDPOINTS.memberEvents.list}?${qs.toString()}`,
    );
  },

  /**
   * GET /api/v1/events?grouped=false&category=...&limit=100
   * Returns a flat list of all events matching filters.
   */
  getFlat: (params: MemberEventsListParams & { limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.category && params.category !== "all") {
      qs.set("category", params.category);
    }
    if (params.limit) {
      qs.set("limit", String(params.limit));
    }
    return apiClient<MemberEventsFlatResponse>(
      `${API_ENDPOINTS.memberEvents.list}?${qs.toString()}`,
    );
  },

  /**
   * POST /api/v1/events/:id/join
   * Adds the authenticated member to the event (my diary / RSVP).
   */
  join: (id: string) =>
    apiClient<MemberEventsRsvpResponse>(API_ENDPOINTS.memberEvents.join(id), {
      method: "POST",
      body: {},
    }),

  /**
   * DELETE /api/v1/events/:id/leave
   * Removes the authenticated member from the event.
   */
  leave: (id: string) =>
    apiClient<MemberEventsRsvpResponse>(API_ENDPOINTS.memberEvents.leave(id), {
      method: "DELETE",
    }),

  /**
   * POST /api/v1/events/:id/waitlist
   * Adds the authenticated member to the waitlist when the event is full.
   */
  joinWaitlist: (id: string) =>
    apiClient<MemberEventsRsvpResponse>(
      API_ENDPOINTS.memberEvents.waitlist(id),
      { method: "POST", body: {} },
    ),

  /**
   * DELETE /api/v1/events/:id/waitlist
   * Removes the authenticated member from the waitlist.
   */
  leaveWaitlist: (id: string) =>
    apiClient<MemberEventsRsvpResponse>(
      API_ENDPOINTS.memberEvents.waitlist(id),
      { method: "DELETE" },
    ),
};
