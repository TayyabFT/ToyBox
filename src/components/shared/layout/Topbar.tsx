"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Bell } from "@/components/common/Svgs";
import { NotificationPopup } from "@/components/staff/NotificationPopup";
import { ProfilePopup } from "@/components/shared/layout/ProfilePopup";
import { showToast } from "@/lib/toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchInbox,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/store/slices/notificationsSlice";

type TopbarProps = {
  /** Left-aligned breadcrumb, fully owned by each portal. */
  breadcrumb: ReactNode;
  /** Visual content of the profile trigger button (icon or initial). */
  profileTrigger: ReactNode;
  /** Classes for the profile trigger button — differs per portal. */
  profileTriggerClassName: string;
  /** Portal-specific profile card rendered inside the profile popup. */
  profileCard: ReactNode;
};

export function Topbar({
  breadcrumb,
  profileTrigger,
  profileTriggerClassName,
  profileCard,
}: TopbarProps) {
  const dispatch = useAppDispatch();
  const { items, loading, markAllLoading } = useAppSelector(
    (state) => state.notifications,
  );

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const hasUnread = items.some((item) => !item.read);

  useEffect(() => {
    dispatch(fetchInbox());
  }, [dispatch]);

  async function handleOpenNotifications() {
    setProfileOpen(false);
    setNotificationsOpen(true);
    const result = await dispatch(fetchInbox());

    if (fetchInbox.rejected.match(result)) {
      showToast.error({
        title: "Notifications",
        message: (result.payload as string) || "Failed to load notifications",
      });
    }
  }

  async function handleMarkAsRead(id: string) {
    const result = await dispatch(markNotificationRead(id));

    if (markNotificationRead.rejected.match(result)) {
      showToast.error({
        title: "Notification",
        message:
          (result.payload as string) || "Failed to mark notification read",
      });
    }
  }

  async function handleMarkAllAsRead() {
    const result = await dispatch(markAllNotificationsRead());

    if (markAllNotificationsRead.fulfilled.match(result)) {
      showToast.success({
        title: "All Read",
        message: "All notifications marked as read",
      });
      return;
    }

    showToast.error({
      title: "Notifications",
      message:
        (result.payload as string) || "Failed to mark all notifications read",
    });
  }

  return (
    <>
      <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-accent/8 bg-background px-8">
        {breadcrumb}

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Notifications"
            onClick={handleOpenNotifications}
            className="relative flex size-10 cursor-pointer items-center justify-center rounded-full border border-accent/10 transition-colors hover:border-primary/40"
          >
            <Bell />
            {hasUnread && (
              <span className="absolute top-2.5 right-3 h-1.5 w-1.5 rounded-full bg-primary" />
            )}
          </button>

          <button
            type="button"
            aria-label="Profile"
            onClick={() => {
              setNotificationsOpen(false);
              setProfileOpen(true);
            }}
            className={profileTriggerClassName}
          >
            {profileTrigger}
          </button>
        </div>
      </header>

      <NotificationPopup
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={items}
        loading={loading}
        markAllLoading={markAllLoading}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      <ProfilePopup open={profileOpen} onClose={() => setProfileOpen(false)}>
        {profileCard}
      </ProfilePopup>
    </>
  );
}
