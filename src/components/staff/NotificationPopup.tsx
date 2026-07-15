"use client";

import { NotificationItem } from "./NotificationItem";
import type { NotificationItem as NotificationData } from "@/types/api";

type NotificationPopupProps = {
  open: boolean;
  onClose: () => void;
  notifications: NotificationData[];
  loading: boolean;
  markAllLoading: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
};

export function NotificationPopup({
  open,
  onClose,
  notifications,
  loading,
  markAllLoading,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationPopupProps) {
  const unreadCount = notifications.filter((item) => !item.read).length;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-20"
      onClick={onClose}
    >
      <div
        className="staff-notif-panel relative z-10 mr-4 w-full max-w-sm overflow-hidden rounded-2xl border border-accent/25 bg-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="staff-notif-header flex items-start justify-between border-b border-accent/12 px-5 py-3">
          <div className="space-y-1">
            <h2 className="font-copperplate text-foreground">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                disabled={markAllLoading}
                className="font-roboto cursor-pointer text-[9px] font-medium tracking-[0.08em] text-primary uppercase transition-colors hover:text-gold-light disabled:opacity-50"
              >
                {markAllLoading ? "Marking..." : "Mark all read"}
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="staff-notif-close cursor-pointer text-secondary transition-colors hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="Custom__Scrollbar max-h-[420px] space-y-2 overflow-y-auto p-4">
          {loading && notifications.length === 0 && (
            <p className="font-roboto py-8 text-center text-sm text-secondary">
              Loading notifications...
            </p>
          )}

          {!loading && notifications.length === 0 && (
            <p className="font-roboto py-8 text-center text-sm text-secondary">
              No notifications yet
            </p>
          )}

          {notifications.map((item) => (
            <NotificationItem
              key={item.id}
              title={item.title}
              subheading={item.subheading}
              read={item.read}
              onClick={() => {
                if (!item.read) {
                  onMarkAsRead(item.id);
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
