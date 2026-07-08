"use client";

import { useEffect } from "react";
import { logBackendUrlOnce } from "@/lib/logBackendUrl";

export function ApiBackendUrlLog() {
  useEffect(() => {
    logBackendUrlOnce();
  }, []);

  return null;
}
