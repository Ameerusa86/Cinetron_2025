"use client";

import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  initializeTheme,
  initializeCache,
  initializeNotifications,
  useThemeStore,
} from "@/stores";
import AuthProvider from "@/components/providers/AuthProvider";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (was cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 404s
        const status = (error as { response?: { status?: number } })?.response
          ?.status;
        if (status === 404) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Initialize theme on client side
    initializeTheme();

    // Clear expired cache entries
    initializeCache();

    // Clear expired notifications
    initializeNotifications();

    // Set up system theme listener
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = () => {
      if (theme === "system") {
        setTheme("system"); // This will re-apply the system theme
      }
    };

    mediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, [theme, setTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
