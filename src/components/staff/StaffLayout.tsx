"use client";

import { StaffSidebar } from "@/components/staff/Sidebar";
import { StaffTopbar } from "@/components/staff/Topbar";
import { useClientAuth } from "@/lib/useClientAuth";

type StaffLayoutProps = {
  children: React.ReactNode;
};

export function StaffLayout({ children }: StaffLayoutProps) {
  const authorized = useClientAuth("staff");

  if (!authorized) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <StaffSidebar />
      <div className="flex min-h-screen flex-1 flex-col overflow-hidden pl-[340px]">
        <StaffTopbar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
