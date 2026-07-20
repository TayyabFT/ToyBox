"use client";

import { useState } from "react";
import { Sidebar, Topbar } from "@/components/shared/layout";
import { useClientAuth } from "@/lib/useClientAuth";

type StaffLayoutProps = {
  children: React.ReactNode;
};

export function StaffLayout({ children }: StaffLayoutProps) {
  const authorized = useClientAuth("staff");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!authorized) return null;

  return (
    <div className="flex min-h-screen bg-[var(--shell-bg)]">
      <Sidebar
        role="staff"
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex min-h-screen flex-1 flex-col lg:pl-[340px]">
        <Topbar role="staff" onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-auto bg-background pt-[72px]">{children}</main>
      </div>
    </div>
  );
}
