import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  CreateEventRequest,
  EventResponse,
  EventsListResponse,
  EventStatsResponse,
  EventDetailResponse,
  UpdateEventNotesRequest,
  UpdateEventNotesResponse,
} from "@/types/api";

export const eventsApi = {
  create: (payload: CreateEventRequest) =>
    apiClient<EventResponse>(API_ENDPOINTS.events.createevent, {
      method: "POST",
      body: payload,
    }),

  getEvents: () =>
    apiClient<EventsListResponse>(API_ENDPOINTS.events.getevents, {
      method: "GET",
    }),

  getStats: () =>
    apiClient<EventStatsResponse>(API_ENDPOINTS.events.getstats, {
      method: "GET",
    }),

  getDetail: (id: string | number) =>
    apiClient<EventDetailResponse>(API_ENDPOINTS.events.detail(id), {
      method: "GET",
    }),

  updateEvent: (
    id: string | number,
    payload: Partial<Pick<CreateEventRequest, "status">>,
  ) =>
    apiClient<EventResponse>(API_ENDPOINTS.events.update(id), {
      method: "PATCH",
      body: payload,
    }),

  deleteEvent: (id: string | number) =>
    apiClient<unknown>(API_ENDPOINTS.events.delete(id), {
      method: "DELETE",
    }),

  sendUpdate: (id: string | number) =>
    apiClient<unknown>(API_ENDPOINTS.events.sendUpdate(id), {
      method: "POST",
    }),

  updateNotes: (id: string | number, payload: UpdateEventNotesRequest) =>
    apiClient<UpdateEventNotesResponse>(API_ENDPOINTS.events.notes(id), {
      method: "PATCH",
      body: payload,
    }),
};
