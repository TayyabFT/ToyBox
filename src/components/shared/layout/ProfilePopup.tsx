"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import { useAppDispatch } from "@/store/hooks";
import { clearAuth } from "@/store/slices/authSlice";

type ProfilePopupProps = {
  open: boolean;
  onClose: () => void;
  /** Portal-specific profile card shown above the logout action. */
  children: ReactNode;
};

export function ProfilePopup({ open, onClose, children }: ProfilePopupProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  if (!open) return null;

  async function handleLogout() {
    await logout();
    dispatch(clearAuth());
    onClose();
    router.replace("/auth/login");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-20"
      onClick={onClose}
    >
      <div
        className="relative z-10 mr-4 w-full max-w-[360px] overflow-hidden rounded-2xl border border-accent/25 bg-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-end border-b border-accent/12 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-secondary transition-colors hover:text-foreground"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[min(70vh,560px)] overflow-y-auto p-5">{children}</div>

        <div className="border-t border-accent/12 p-5">
          <button
            type="button"
            onClick={handleLogout}
            className="font-roboto w-full cursor-pointer rounded-xl border border-accent/25 py-3.5 text-[11px] font-semibold tracking-[0.15em] text-foreground uppercase transition-colors hover:border-primary/40 hover:text-primary"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
