import React from "react";
import { AdminLayout } from "@/components/admin";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <AdminLayout>{children}</AdminLayout>;
};

export default layout;
