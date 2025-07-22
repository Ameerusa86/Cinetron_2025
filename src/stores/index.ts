import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Theme,
  ThemeState,
  ModalState,
  CacheState,
  SearchState,
  SearchFilters,
  MultiSearchResult,
  MovieResponse,
  MovieDetails,
  Genre,
  User,
  UserPreferences,
  WatchlistItem,
  Notification,
} from "@/types";

// ======================
// THEME STORE
// ======================

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "system",
      isDark: false,
      setTheme: (theme: Theme) => {
        const applyTheme = (isDarkMode: boolean) => {
          const root = document.documentElement;

          // Debug logging
          console.log(`Applying theme: ${theme}, isDark: ${isDarkMode}`);

          if (isDarkMode) {
            root.classList.add("dark");
            root.setAttribute(
              "data-theme",
              theme === "cinema" || theme === "cinema-dark"
                ? "cinema-dark"
                : "dark"
            );
          } else {
            root.classList.remove("dark");
            root.setAttribute(
              "data-theme",
              theme === "cinema" || theme === "cinema-dark" ? "cinema" : "light"
            );
          }

          set({ isDark: isDarkMode });

          // Debug logging
          console.log(`Theme applied. Root classes:`, root.className);
          console.log(`Data theme:`, root.getAttribute("data-theme"));
        };

        set({ theme });

        // Apply theme logic
        if (theme === "light") {
          applyTheme(false);
        } else if (theme === "dark") {
          applyTheme(true);
        } else if (theme === "cinema") {
          applyTheme(false);
        } else if (theme === "cinema-dark") {
          applyTheme(true);
        } else if (theme === "system" || theme === "auto") {
          // System/Auto theme - follow system preference
          const isDarkSystem = window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;
          applyTheme(isDarkSystem);

          // Listen for system theme changes
          const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
          const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            if (get().theme === "system" || get().theme === "auto") {
              applyTheme(e.matches);
            }
          };

          // Remove existing listener and add new one
          mediaQuery.removeEventListener("change", handleSystemThemeChange);
          mediaQuery.addEventListener("change", handleSystemThemeChange);
        }
      },
      toggleTheme: () => {
        const { theme } = get();
        let newTheme: Theme;

        // Smart toggle based on current theme
        if (theme === "light") {
          newTheme = "dark";
        } else if (theme === "dark") {
          newTheme = "light";
        } else if (theme === "cinema") {
          newTheme = "cinema-dark";
        } else if (theme === "cinema-dark") {
          newTheme = "cinema";
        } else {
          // For system/auto, toggle to opposite of current appearance
          const isDarkSystem = window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;
          newTheme = isDarkSystem ? "light" : "dark";
        }

        get().setTheme(newTheme);
      },
    }),
    {
      name: "cinema-theme",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ======================
// MODAL STORE
// ======================

export const useModalStore = create<ModalState>((set) => ({
  searchModal: false,
  movieModal: false,
  settingsModal: false,
  loginModal: false,
  shareModal: false,
  trailerModal: false,
  selectedMovieId: undefined,
  setSearchModal: (open: boolean) => set({ searchModal: open }),
  setMovieModal: (open: boolean, movieId?: number) =>
    set({ movieModal: open, selectedMovieId: movieId }),
  setSettingsModal: (open: boolean) => set({ settingsModal: open }),
  setLoginModal: (open: boolean) => set({ loginModal: open }),
  setShareModal: (open: boolean) => set({ shareModal: open }),
  setTrailerModal: (open: boolean) => set({ trailerModal: open }),
}));

// ======================
// CACHE STORE
// ======================

const CACHE_EXPIRY = 1000 * 60 * 15; // 15 minutes

export const useCacheStore = create<CacheState>()(
  persist(
    (set, get) => ({
      movies: {},
      movieDetails: {},
      genres: null,
      addMovies: (key: string, data: MovieResponse) => {
        set((state) => ({
          movies: {
            ...state.movies,
            [key]: {
              data,
              timestamp: Date.now(),
              expiry: Date.now() + CACHE_EXPIRY,
            },
          },
        }));
      },
      addMovieDetails: (id: number, data: MovieDetails) => {
        set((state) => ({
          movieDetails: {
            ...state.movieDetails,
            [id]: {
              data,
              timestamp: Date.now(),
              expiry: Date.now() + CACHE_EXPIRY,
            },
          },
        }));
      },
      addGenres: (data: Genre[]) => {
        set({
          genres: {
            data,
            timestamp: Date.now(),
            expiry: Date.now() + CACHE_EXPIRY * 4, // Cache genres for 1 hour
          },
        });
      },
      getMovies: (key: string) => {
        const { movies } = get();
        const entry = movies[key];
        if (!entry || entry.expiry < Date.now()) {
          return null;
        }
        return entry.data;
      },
      getMovieDetails: (id: number) => {
        const { movieDetails } = get();
        const entry = movieDetails[id];
        if (!entry || entry.expiry < Date.now()) {
          return null;
        }
        return entry.data;
      },
      getGenres: () => {
        const { genres } = get();
        if (!genres || genres.expiry < Date.now()) {
          return null;
        }
        return genres.data;
      },
      clearExpired: () => {
        const now = Date.now();
        set((state) => ({
          movies: Object.fromEntries(
            Object.entries(state.movies).filter(
              ([, entry]) => entry.expiry > now
            )
          ),
          movieDetails: Object.fromEntries(
            Object.entries(state.movieDetails).filter(
              ([, entry]) => entry.expiry > now
            )
          ),
          genres:
            state.genres && state.genres.expiry > now ? state.genres : null,
        }));
      },
    }),
    {
      name: "cinema-cache",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ======================
// SEARCH STORE
// ======================

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      query: "",
      results: [],
      isLoading: false,
      error: null,
      filters: {
        mediaType: "all",
        sortBy: "popularity",
        sortOrder: "desc",
      },
      history: [],
      setQuery: (query: string) => set({ query }),
      setResults: (results: MultiSearchResult[]) => set({ results }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      setFilters: (filters: SearchFilters) => set({ filters }),
      addToHistory: (query: string) => {
        const { history } = get();
        const newHistory = [query, ...history.filter((q) => q !== query)].slice(
          0,
          10
        );
        set({ history: newHistory });
      },
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "cinema-search",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        history: state.history,
        filters: state.filters,
      }),
    }
  )
);

// ======================
// USER STORE
// ======================

export const useUserStore = create<{
  user: User | null;
  setUser: (user: User | null) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  addToWatchlist: (item: {
    id: number;
    type: "movie" | "tv";
    status?: "plan-to-watch" | "watching" | "completed";
    priority?: "low" | "medium" | "high";
    notes?: string;
  }) => void;
  removeFromWatchlist: (itemId: number) => void;
  updateWatchlistItem: (
    itemId: number,
    updates: Partial<Omit<WatchlistItem, "id" | "addedAt">>
  ) => void;
  addToFavorites: (movieId: number) => void;
  removeFromFavorites: (movieId: number) => void;
  rateMovie: (movieId: number, rating: number) => void;
  isInWatchlist: (itemId: number) => boolean;
  isInFavorites: (movieId: number) => boolean;
  getMovieRating: (movieId: number) => number | undefined;
  getWatchlistItem: (itemId: number) => WatchlistItem | undefined;
  getWatchlistStats: () => {
    total: number;
    movies: number;
    tvShows: number;
    completed: number;
    watching: number;
    planToWatch: number;
  };
}>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user: User | null) => {
        // If setting a user for the first time, ensure they have the correct watchlist structure
        if (
          user &&
          user.watchlist &&
          Array.isArray(user.watchlist) &&
          user.watchlist.length > 0
        ) {
          // Check if watchlist contains old format (numbers) and convert them
          const firstItem = user.watchlist[0];
          if (typeof firstItem === "number") {
            // Convert old format to new format
            user.watchlist = (user.watchlist as unknown as number[]).map(
              (id: number) => ({
                id,
                type: "movie" as const,
                status: "plan-to-watch" as const,
                priority: "medium" as const,
                addedAt: new Date().toISOString(),
              })
            );
          }
        }

        set({ user });
      },
      updatePreferences: (newPreferences: Partial<UserPreferences>) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              preferences: { ...user.preferences, ...newPreferences },
              updatedAt: new Date().toISOString(),
            },
          });
        }
      },
      addToWatchlist: (item: {
        id: number;
        type: "movie" | "tv";
        status?: "plan-to-watch" | "watching" | "completed";
        priority?: "low" | "medium" | "high";
        notes?: string;
      }) => {
        let { user } = get();

        // If no user exists, create a default user
        if (!user) {
          user = {
            id: crypto.randomUUID(),
            username: "Guest User",
            email: "",
            avatar: undefined,
            watchlist: [],
            favorites: [],
            ratings: {},
            preferences: {
              language: "en",
              country: "US",
              genres: [],
              adultContent: false,
              notifications: {
                email: false,
                push: false,
                newReleases: true,
                recommendations: true,
                social: false,
              },
              privacy: {
                profileVisibility: "private",
                watchlistVisibility: "private",
                activityVisibility: "private",
              },
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }

        // Check if item is already in watchlist
        if (!user.watchlist.some((w) => w.id === item.id)) {
          const watchlistItem: WatchlistItem = {
            id: item.id,
            type: item.type,
            status: item.status || "plan-to-watch",
            priority: item.priority || "medium",
            addedAt: new Date().toISOString(),
            notes: item.notes,
          };

          const updatedUser: User = {
            ...user,
            watchlist: [...user.watchlist, watchlistItem],
            updatedAt: new Date().toISOString(),
          };

          set({
            user: updatedUser,
          });
        }
      },
      removeFromWatchlist: (itemId: number) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              watchlist: user.watchlist.filter((item) => item.id !== itemId),
              updatedAt: new Date().toISOString(),
            },
          });
        }
      },
      updateWatchlistItem: (
        itemId: number,
        updates: Partial<Omit<WatchlistItem, "id" | "addedAt">>
      ) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              watchlist: user.watchlist.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      ...updates,
                      completedAt:
                        updates.status === "completed" && !item.completedAt
                          ? new Date().toISOString()
                          : updates.status !== "completed"
                          ? undefined
                          : item.completedAt,
                    }
                  : item
              ),
              updatedAt: new Date().toISOString(),
            },
          });
        }
      },
      addToFavorites: (movieId: number) => {
        const { user } = get();
        if (user && !user.favorites.includes(movieId)) {
          set({
            user: {
              ...user,
              favorites: [...user.favorites, movieId],
              updatedAt: new Date().toISOString(),
            },
          });
        }
      },
      removeFromFavorites: (movieId: number) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              favorites: user.favorites.filter((id) => id !== movieId),
              updatedAt: new Date().toISOString(),
            },
          });
        }
      },
      rateMovie: (movieId: number, rating: number) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              ratings: { ...user.ratings, [movieId]: rating },
              updatedAt: new Date().toISOString(),
            },
          });
        }
      },
      isInWatchlist: (itemId: number) => {
        const { user } = get();
        return user ? user.watchlist.some((item) => item.id === itemId) : false;
      },
      isInFavorites: (movieId: number) => {
        const { user } = get();
        return user ? user.favorites.includes(movieId) : false;
      },
      getMovieRating: (movieId: number) => {
        const { user } = get();
        return user ? user.ratings[movieId] : undefined;
      },
      getWatchlistItem: (itemId: number) => {
        const { user } = get();
        return user
          ? user.watchlist.find((item) => item.id === itemId)
          : undefined;
      },
      getWatchlistStats: () => {
        const { user } = get();
        if (!user)
          return {
            total: 0,
            movies: 0,
            tvShows: 0,
            completed: 0,
            watching: 0,
            planToWatch: 0,
          };

        const stats = {
          total: user.watchlist.length,
          movies: user.watchlist.filter((item) => item.type === "movie").length,
          tvShows: user.watchlist.filter((item) => item.type === "tv").length,
          completed: user.watchlist.filter(
            (item) => item.status === "completed"
          ).length,
          watching: user.watchlist.filter((item) => item.status === "watching")
            .length,
          planToWatch: user.watchlist.filter(
            (item) => item.status === "plan-to-watch"
          ).length,
        };

        return stats;
      },
    }),
    {
      name: "cinema-user",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ======================
// NOTIFICATION STORE
// ======================

export const useNotificationStore = create<{
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt">
  ) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearExpired: () => void;
}>((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      read: false,
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
  removeNotification: (id: string) => {
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount:
          notification && !notification.read
            ? state.unreadCount - 1
            : state.unreadCount,
      };
    });
  },
  markAsRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id && !n.read ? { ...n, read: true } : n
      ),
      unreadCount: state.notifications.find((n) => n.id === id && !n.read)
        ? state.unreadCount - 1
        : state.unreadCount,
    }));
  },
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },
  clearExpired: () => {
    const now = new Date().toISOString();
    set((state) => {
      const validNotifications = state.notifications.filter(
        (n) => !n.expiresAt || n.expiresAt > now
      );
      const removedUnreadCount = state.notifications.filter(
        (n) => n.expiresAt && n.expiresAt <= now && !n.read
      ).length;

      return {
        notifications: validNotifications,
        unreadCount: Math.max(0, state.unreadCount - removedUnreadCount),
      };
    });
  },
}));

// ======================
// UTILITY HOOKS
// ======================

// Initialize theme on app start
export const initializeTheme = () => {
  const { theme, setTheme } = useThemeStore.getState();
  setTheme(theme);
};

// Clear expired cache on app start
export const initializeCache = () => {
  const { clearExpired } = useCacheStore.getState();
  clearExpired();
};

// Clear expired notifications on app start
export const initializeNotifications = () => {
  const { clearExpired } = useNotificationStore.getState();
  clearExpired();
};
