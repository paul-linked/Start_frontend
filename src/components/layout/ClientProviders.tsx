"use client";

import { useServiceWorker } from "@/hooks/useServiceWorker";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  useServiceWorker();
  return <>{children}</>;
}