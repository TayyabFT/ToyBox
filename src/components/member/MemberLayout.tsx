"use client";

import { useState } from "react";
import { Sidebar, Topbar } from "@/components/shared/layout";
import { useClientAuth } from "@/lib/useClientAuth";

type MemberLayoutProps = {
  children: React.ReactNode;
};

export function MemberLayout({ children }: MemberLayoutProps) {
  const authorized = useClientAuth("member");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!authorized) return null;

  return (
    <div className="flex min-h-screen bg-[var(--shell-bg)]">
      <Sidebar
        role="member"
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex min-h-screen flex-1 flex-col overflow-hidden lg:pl-[340px]">
        <Topbar role="member" onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-auto bg-background">{children}</main>
      </div>
    </div>
  );
}
