"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Bell, ThemeMoon, ThemeSun, User } from "@/components/common/Svgs";
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

export function Topbar({ role }: { role: UserRole }) {
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
      <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-accent/8 bg-[var(--shell-bg)] px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[13px] tracking-[0.14em] uppercase"
        >
          <span className="font-roboto text-secondary">{spec.brand}</span>
          <span className="font-roboto text-secondary">/</span>
          {showDetailBreadcrumb ? (
            <>
              <Link
                href={sectionHref!}
                className="font-roboto text-secondary transition-colors hover:text-primary"
              >
                {page}
              </Link>
              <span className="font-roboto text-secondary">/</span>
              <span className="font-roboto text-primary">
                {subtitle!.toUpperCase()}
              </span>
            </>
          ) : (
            <span className="font-roboto text-primary">{page}</span>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleTheme}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-accent/10 transition-colors hover:border-primary/40"
          >
            {isDarkMode ? <ThemeSun /> : <ThemeMoon color="var(--muted)" />}
          </button>

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

          {role !== "admin" && (
            <button
              type="button"
              aria-label="Profile"
              onClick={() => {
                setNotificationsOpen(false);
                setProfileOpen(true);
              }}
              className={spec.profileTriggerClassName}
            >
              {spec.profileTrigger}
            </button>
          )}
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
