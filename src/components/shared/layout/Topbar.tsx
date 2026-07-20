"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Bell, Menu, ThemeMoon, ThemeSun, User } from "@/components/common/Svgs";
import { NotificationPopup } from "@/components/staff/NotificationPopup";
import { ProfilePopup } from "@/components/shared/layout/ProfilePopup";
import { AuthProfileContent } from "@/components/shared/layout/AuthProfileContent";
import { getAdminActiveHref, getAdminPageTitle } from "@/lib/adminNav";
import { getStaffPageTitle } from "@/lib/staffNav";
import { getMemberPageTitle } from "@/lib/memberNav";
import { useAdminPageSubtitleValue } from "@/lib/adminPageMeta";
import { showToast } from "@/lib/toast";
import { useTheme } from "@/components/common/ThemeProvider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchInbox,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/store/slices/notificationsSlice";
import type { UserRole } from "@/lib/auth";

type TopbarSpec = {
  /** Breadcrumb root label. */
  brand: string;
  /** Resolves the active page label from the pathname. */
  getPageTitle: (pathname: string) => string;
  /** Resolves the active section href (used for detail-page breadcrumbs). */
  getActiveHref?: (pathname: string) => string | null;
  /** Visual content of the profile trigger button. */
  profileTrigger: ReactNode;
  /** Classes for the profile trigger button. */
  profileTriggerClassName: string;
};

const PROFILE_ICON_TRIGGER =
  "flex size-10 cursor-pointer items-center justify-center rounded-full border border-accent/10 transition-colors hover:border-primary/40 [&_svg]:size-[18px]";
const PROFILE_INITIAL_TRIGGER =
  "flex size-10 cursor-pointer items-center justify-center rounded-full bg-gradient-to-b from-[#F0C566] to-[#8B6F2A] text-sm font-medium text-dark uppercase";

/* ------------------------------------------------------------------ *
 * Per-role topbar specifications.
 * The shared design is the staff topbar; only the data differs.
 * ------------------------------------------------------------------ */

const ADMIN_TOPBAR: TopbarSpec = {
  brand: "TOYBOX ADMIN",
  getPageTitle: getAdminPageTitle,
  getActiveHref: getAdminActiveHref,
  profileTrigger: "F",
  profileTriggerClassName: PROFILE_INITIAL_TRIGGER,
};

const STAFF_TOPBAR: TopbarSpec = {
  brand: "TOYBOX",
  getPageTitle: getStaffPageTitle,
  profileTrigger: <User />,
  profileTriggerClassName: PROFILE_ICON_TRIGGER,
};

const MEMBER_TOPBAR: TopbarSpec = {
  brand: "TOYBOX",
  getPageTitle: getMemberPageTitle,
  profileTrigger: "M",
  profileTriggerClassName: PROFILE_INITIAL_TRIGGER,
};

const TOPBAR_SPECS: Record<UserRole, TopbarSpec> = {
  admin: ADMIN_TOPBAR,
  staff: STAFF_TOPBAR,
  member: MEMBER_TOPBAR,
};

export function Topbar({
  role,
  onMenuClick,
}: {
  role: UserRole;
  onMenuClick?: () => void;
}) {
  const spec = TOPBAR_SPECS[role];
  const pathname = usePathname();
  const subtitle = useAdminPageSubtitleValue();

  const dispatch = useAppDispatch();
  const { items, loading, markAllLoading } = useAppSelector(
    (state) => state.notifications,
  );

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const hasUnread = items.some((item) => !item.read);
  const page = spec.getPageTitle(pathname).toUpperCase();
  const sectionHref = spec.getActiveHref?.(pathname) ?? null;
  const showDetailBreadcrumb = Boolean(
    subtitle &&
      sectionHref &&
      subtitle.toUpperCase() !== page,
  );

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
      <header className="fixed top-0 right-0 left-0 z-30 flex h-[72px] shrink-0 items-center justify-between gap-3 border-b border-accent/8 bg-[var(--shell-bg)] px-4 sm:px-6 lg:left-[340px] lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden text-[13px] tracking-[0.14em] uppercase"
        >
          <span className="font-roboto shrink-0 text-secondary">{spec.brand}</span>
          <span className="font-roboto shrink-0 text-secondary">/</span>
          {showDetailBreadcrumb ? (
            <>
              <Link
                href={sectionHref!}
                className="font-roboto shrink-0 text-secondary transition-colors hover:text-primary"
              >
                {page}
              </Link>
              <span className="font-roboto shrink-0 text-secondary">/</span>
              <span className="font-roboto truncate text-primary">
                {subtitle!.toUpperCase()}
              </span>
            </>
          ) : (
            <span className="font-roboto truncate text-primary">{page}</span>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <button
            type="button"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleTheme}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-accent/10 transition-colors hover:border-primary/40 sm:size-10"
          >
            {isDarkMode ? <ThemeSun /> : <ThemeMoon color="var(--muted)" />}
          </button>

          <button
            type="button"
            aria-label="Notifications"
            onClick={handleOpenNotifications}
            className="relative flex size-9 cursor-pointer items-center justify-center rounded-full border border-accent/10 transition-colors hover:border-primary/40 sm:size-10"
          >
            <Bell />
            {hasUnread && (
              <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-primary sm:top-2.5 sm:right-3" />
            )}
          </button>

          {role !== "admin" && (
            <button
              type="button"
              aria-label="Profile"
              onClick={() => {
                setNotificationsOpen(false);
                setProfileOpen(true);
              }}
              className={`!size-9 sm:!size-10 ${spec.profileTriggerClassName}`}
            >
              {spec.profileTrigger}
            </button>
          )}

          <button
            type="button"
            aria-label="Open menu"
            onClick={onMenuClick}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-accent/10 transition-colors hover:border-primary/40 sm:size-10 lg:hidden"
          >
            <Menu />
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

      {role !== "admin" && (
        <ProfilePopup
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
        >
          <AuthProfileContent open={profileOpen} />
        </ProfilePopup>
      )}
    </>
  );
}
