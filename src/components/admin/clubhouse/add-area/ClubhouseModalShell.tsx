import type { ReactNode } from "react";

type ClubhouseModalShellProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidthClass?: string;
};

export function ClubhouseModalShell({
  open,
  onClose,
  children,
  maxWidthClass = "max-w-md",
}: ClubhouseModalShellProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`admin-modal-panel relative z-10 w-full ${maxWidthClass} rounded-2xl border border-accent/25 shadow-[var(--shadow-modal)]`}
      >
        {children}
      </div>
    </div>
  );
}
