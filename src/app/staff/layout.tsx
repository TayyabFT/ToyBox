import { StaffLayout } from "@/components/staff";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StaffLayout>{children}</StaffLayout>;
}
