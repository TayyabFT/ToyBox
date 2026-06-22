import type { InboxNotificationRaw, NotificationItem } from "@/types/api";

function extractRawNotifications(data: unknown): InboxNotificationRaw[] {
  if (Array.isArray(data)) {
    return data as InboxNotificationRaw[];
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  const record = data as Record<string, unknown>;

  for (const key of ["items", "notifications", "records", "data", "inbox"]) {
    const value = record[key];

    if (Array.isArray(value)) {
      return value as InboxNotificationRaw[];
    }
  }

  return [];
}

export function mapInboxNotification(
  item: InboxNotificationRaw,
): NotificationItem | null {
  if (item.id === undefined || item.id === null) {
    return null;
  }

  const title =
    item.title ??
    item.subject ??
    item.heading ??
    "Notification";

  const subheading =
    item.subheading ??
    item.message ??
    item.body ??
    item.description ??
    item.summary ??
    item.content ??
    "";

  const read =
    item.read ??
    item.isRead ??
    Boolean(item.readAt);

  return {
    id: String(item.id),
    title,
    subheading,
    read,
  };
}

export function mapInboxResponse(data: unknown): NotificationItem[] {
  return extractRawNotifications(data)
    .map(mapInboxNotification)
    .filter((item): item is NotificationItem => item !== null);
}
