"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authApi } from "@/api/auth.api";
import { mapAuthProfile, type AuthProfileView } from "@/lib/authProfile";
import { logout } from "@/lib/auth";
import { useAppDispatch } from "@/store/hooks";
import { clearAuth } from "@/store/slices/authSlice";

type SidebarProfileFooterProps = {
  profilePath: string;
};

export function SidebarProfileFooter({ profilePath }: SidebarProfileFooterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [profile, setProfile] = useState<AuthProfileView | null>(null);

  const active = pathname === profilePath;

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const response = await authApi.getProfile();
        const mapped = mapAuthProfile(response.data);

        if (!cancelled) {
          setProfile(mapped);
        }
      } catch {
        if (!cancelled) {
          setProfile(null);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogout() {
    await logout();
    dispatch(clearAuth());
    router.replace("/auth/login");
  }

  return (
    <div className="shrink-0 space-y-1.5 px-4 py-4">
      <Link
        href={profilePath}
        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
          active
            ? "border-accent/50 bg-accent/8"
            : "border-accent/20 hover:border-accent/45 hover:bg-accent/5"
        }`}
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-accent/50 font-copperplate text-[15px] text-accent">
          {profile?.initial ?? "A"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-roboto truncate text-sm font-medium tracking-[0.02em] text-foreground">
            {profile?.name ?? "\u00A0"}
          </p>
          <p className="font-roboto truncate text-[10px] tracking-[0.14em] text-section-label uppercase">
            {profile?.subtitle ?? ""}
          </p>
        </div>
      </Link>

      <button
        type="button"
        onClick={handleLogout}
        className="font-roboto flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 text-[11px] font-semibold tracking-[0.15em] text-secondary uppercase transition-colors hover:text-foreground"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="size-4 shrink-0"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="M16 17l5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
        Sign Out
      </button>
    </div>
  );
}
