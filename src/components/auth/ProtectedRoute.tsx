"use client";

import { Show, RedirectToSignIn } from "@clerk/nextjs";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component to protect routes that require authentication
 * Redirects to sign-in if user is not authenticated
 */
export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  return (
    <>
      <Show when="signed-in">{children}</Show>
      <Show when="signed-out">{fallback || <RedirectToSignIn />}</Show>
    </>
  );
}
