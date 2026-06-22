import { MemberLayout } from "@/components/member";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MemberLayout>{children}</MemberLayout>;
}
