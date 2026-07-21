"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

/**
 * Renders children into document.body via a React portal.
 *
 * This escapes any ancestor stacking context (e.g. overflow-auto on <main>)
 * so that modals with z-[60] always render above every layout element.
 */
export function ModalPortal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const portalRootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const div = document.createElement("div");
    div.setAttribute("data-modal-portal", "true");
    document.body.appendChild(div);
    portalRootRef.current = div;
    setMounted(true);

    return () => {
      document.body.removeChild(div);
    };
  }, []);

  if (!mounted || !portalRootRef.current) return null;

  return createPortal(children, portalRootRef.current);
}
