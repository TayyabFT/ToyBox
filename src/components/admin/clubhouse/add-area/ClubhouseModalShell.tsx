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
        className={`relative z-10 w-full ${maxWidthClass} rounded-2xl border border-[#D4A84740] bg-[#11100C] shadow-[0_24px_80px_rgba(0,0,0,0.55)]`}
      >
        {children}
      </div>
    </div>
  );
}
