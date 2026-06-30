"use client";

import { Sidebar, Topbar } from "@/components/shared/layout";
import { useClientAuth } from "@/lib/useClientAuth";

type StaffLayoutProps = {
  children: React.ReactNode;
};

export function StaffLayout({ children }: StaffLayoutProps) {
  const authorized = useClientAuth("staff");

  if (!authorized) return null;

  return (
    <div className="flex min-h-screen bg-[var(--shell-bg)]">
      <Sidebar role="staff" />
      <div className="flex min-h-screen flex-1 flex-col overflow-hidden pl-[340px]">
        <Topbar role="staff" />
        <main className="flex-1 overflow-auto bg-background">{children}</main>
      </div>
    </div>
  );
}
