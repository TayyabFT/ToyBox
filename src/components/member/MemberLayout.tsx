"use client";

import { Sidebar, Topbar } from "@/components/shared/layout";
import { useClientAuth } from "@/lib/useClientAuth";

type MemberLayoutProps = {
  children: React.ReactNode;
};

export function MemberLayout({ children }: MemberLayoutProps) {
  const authorized = useClientAuth("member");

  if (!authorized) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="member" />
      <div className="flex min-h-screen flex-1 flex-col overflow-hidden pl-[340px]">
        <Topbar role="member" />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
