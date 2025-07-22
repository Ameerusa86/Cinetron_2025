"use client";

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
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
      <SignedIn>{children}</SignedIn>
      <SignedOut>{fallback || <RedirectToSignIn />}</SignedOut>
    </>
  );
}
