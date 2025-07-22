"use client";

import { useClerkUserSync } from "@/hooks/useClerkUserSync";

/**
 * Component to sync Clerk user data with our app store
 * This should be placed inside ClerkProvider but outside any auth guards
 */
export function ClerkUserSyncProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useClerkUserSync();
  return <>{children}</>;
}
