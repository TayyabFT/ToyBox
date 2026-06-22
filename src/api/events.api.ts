import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

// 1. Define Request Payload Interface
export interface CreateEventRequest {
  title: string;
  category: "auctions" | "drives" | "social" | string; // Adjust based on your available categories
  description: string;
  location: string;
  startsAt: string; 
  endsAt: string;   
  isAllDay: boolean;
  imageUrl: string;
  isFeatured: boolean;
  capacity: number;
  accessType: "open" | "invite-only" | string;
  status: "confirmed" | "draft" | "past" | string;
}

// 2. Define Response Interface (Assuming your backend extends the payload with database properties like id)
export interface EventResponse extends CreateEventRequest {
  id: string | number;
  createdAt?: string;
  updatedAt?: string;
}

// Stats response shape returned by /api/v1/events/stats
export interface EventStatsResponse {
  scheduledEvents?: number;
  confirmed?: number;
  drafts?: number;
  attendanceRate?: number;
  // Allow extra fields the backend may include
  [key: string]: unknown;
}

// 3. API Module Implementation
export const eventsApi = {
  // Submit the new form payload
  create: (payload: CreateEventRequest) =>
    apiClient<EventResponse>(API_ENDPOINTS.events.createevent, {
      method: "POST",
      body: payload,
    }),

  getEvents: () =>
    apiClient<EventResponse[]>(API_ENDPOINTS.events.getevents, {
      method: "GET",
    }),

  getStats: () =>
    apiClient<{ data: EventStatsResponse }>(API_ENDPOINTS.events.getstats, {
      method: "GET",
    }),

  updateEvent: (id: string | number, payload: Partial<Pick<CreateEventRequest, "status">>) =>
    apiClient<EventResponse>(API_ENDPOINTS.events.update(id), {
      method: "PATCH",
      body: payload,
    }),
};