"use client";

import { useUser } from "@clerk/nextjs";
import { useUserStore } from "@/stores";
import { useEffect } from "react";
import { User } from "@/types";

/**
 * Hook to sync Clerk user with our app's user store
 */
export function useClerkUserSync() {
  const { user: clerkUser, isLoaded } = useUser();
  const { setUser, user: appUser } = useUserStore();

  useEffect(() => {
    if (!isLoaded) return;

    if (clerkUser) {
      // Convert Clerk user to our app user format
      const appUserData: User = {
        id: clerkUser.id,
        username: clerkUser.username || clerkUser.firstName || "user",
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        avatar: clerkUser.imageUrl,
        preferences: appUser?.preferences || {
          language: "en",
          country: "US",
          genres: [],
          adultContent: false,
          notifications: {
            email: true,
            push: true,
            newReleases: true,
            recommendations: true,
            social: true,
          },
          privacy: {
            profileVisibility: "public",
            watchlistVisibility: "public",
            activityVisibility: "public",
          },
        },
        watchlist: appUser?.watchlist || [],
        favorites: appUser?.favorites || [],
        ratings: appUser?.ratings || {},
        createdAt:
          clerkUser.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Only update if there are changes
      if (!appUser || appUser.id !== clerkUser.id) {
        setUser(appUserData);
      }
    } else {
      // User signed out
      setUser(null);
    }
  }, [clerkUser, isLoaded, setUser, appUser]);

  return {
    isLoaded,
    clerkUser,
    appUser,
  };
}
