"use client";

import { useState } from "react";
import { Sidebar, Topbar } from "@/components/shared/layout";
import { AdminPageMetaProvider } from "@/lib/adminPageMeta";
import { useClientAuth } from "@/lib/useClientAuth";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const authorized = useClientAuth("admin");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!authorized) return null;

  return (
    <AdminPageMetaProvider>
      <div className="flex min-h-screen bg-[var(--shell-bg)]">
        <Sidebar
          role="admin"
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />
        <div className="flex min-h-screen flex-1 flex-col lg:pl-[340px]">
          <Topbar role="admin" onMenuClick={() => setMobileMenuOpen(true)} />
          <main className="flex-1 overflow-auto bg-background pt-[72px]">{children}</main>
        </div>
      </div>
    </AdminPageMetaProvider>
  );
}
