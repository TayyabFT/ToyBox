import { MemberSidebar } from "@/components/member/Sidebar";

type MemberLayoutProps = {
  children: React.ReactNode;
};

export function MemberLayout({ children }: MemberLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <MemberSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
