"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AdminPageMeta = {
  subtitle?: string;
};

type AdminPageMetaContextValue = {
  meta: AdminPageMeta;
  setMeta: (meta: AdminPageMeta) => void;
};

const AdminPageMetaContext = createContext<AdminPageMetaContextValue | null>(
  null,
);

export function AdminPageMetaProvider({ children }: { children: ReactNode }) {
  const [meta, setMeta] = useState<AdminPageMeta>({});

  const value = useMemo(
    () => ({
      meta,
      setMeta,
    }),
    [meta],
  );

  return (
    <AdminPageMetaContext.Provider value={value}>
      {children}
    </AdminPageMetaContext.Provider>
  );
}

export function useAdminPageMeta() {
  const context = useContext(AdminPageMetaContext);

  if (!context) {
    throw new Error("useAdminPageMeta must be used within AdminPageMetaProvider");
  }

  return context;
}

/**
 * Reads the current page subtitle without requiring the provider to be present.
 * Returns undefined when used outside an AdminPageMetaProvider (e.g. staff or
 * member portals), so shared chrome can call it safely for any role.
 */
export function useAdminPageSubtitleValue(): string | undefined {
  const context = useContext(AdminPageMetaContext);
  return context?.meta.subtitle;
}

export function useSetAdminPageSubtitle(subtitle?: string) {
  const { setMeta } = useAdminPageMeta();

  useEffect(() => {
    setMeta({ subtitle });

    return () => setMeta({});
  }, [setMeta, subtitle]);
}

export function getAdminMemberProfileId(pathname: string): string | null {
  const match = pathname.match(/^\/admin\/members\/(\d+)$/);
  return match?.[1] ?? null;
}

export function getAdminStaffProfileId(pathname: string): string | null {
  const match = pathname.match(/^\/admin\/staff\/(\d+)$/);
  return match?.[1] ?? null;
}

export function getAdminVehicleProfileId(pathname: string): string | null {
  const match = pathname.match(/^\/admin\/vehicles\/(\d+)$/);
  return match?.[1] ?? null;
}
