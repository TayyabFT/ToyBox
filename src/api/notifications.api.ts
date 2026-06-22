import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { toResourceId } from "@/lib/resourceId";
import type {
  MarkAllNotificationsReadResponse,
  MarkNotificationReadResponse,
  NotificationInboxResponse,
} from "@/types/api";

export const notificationsApi = {
  getInbox: () =>
    apiClient<NotificationInboxResponse>(API_ENDPOINTS.notifications.inbox),

  markAsRead: (id: string | number) =>
    apiClient<MarkNotificationReadResponse>(
      API_ENDPOINTS.notifications.markRead(toResourceId(id)),
      { method: "POST" },
    ),

  markAllAsRead: () =>
    apiClient<MarkAllNotificationsReadResponse>(
      API_ENDPOINTS.notifications.readAll,
      { method: "POST" },
    ),
};
