"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export function useClientStorage<T>(
  read: () => T,
  serverValue: T,
): T {
  return useSyncExternalStore(subscribe, read, () => serverValue);
}
