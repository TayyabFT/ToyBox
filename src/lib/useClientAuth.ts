"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { getStoredRole, type UserRole } from "@/lib/auth";

const subscribe = () => () => {};

function useIsClient(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

export function useClientAuth(requiredRole: UserRole): boolean {
  const router = useRouter();
  const isClient = useIsClient();

  const authorized = useSyncExternalStore(
    subscribe,
    () => getStoredRole() === requiredRole,
    () => false,
  );

  useEffect(() => {
    if (!isClient) return;

    if (!authorized) {
      router.replace("/auth/login");
    }
  }, [isClient, authorized, router]);

  return isClient && authorized;
}
