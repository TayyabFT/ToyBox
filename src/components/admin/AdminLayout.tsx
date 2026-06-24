"use client";

import { Sidebar, Topbar } from "@/components/shared/layout";
import { AdminPageMetaProvider } from "@/lib/adminPageMeta";
import { useClientAuth } from "@/lib/useClientAuth";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const authorized = useClientAuth("admin");

  if (!authorized) return null;

  return (
    <AdminPageMetaProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar role="admin" />
        <div className="flex min-h-screen flex-1 flex-col overflow-hidden pl-[340px]">
          <Topbar role="admin" />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </AdminPageMetaProvider>
  );
}
