"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDashboardPath, getStoredRole } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const role = getStoredRole();

    if (role) {
      router.replace(getDashboardPath(role));
      return;
    }

    router.replace("/auth/login");
  }, [router]);

  return null;
}
