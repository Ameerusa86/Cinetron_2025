import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
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
  CustomList,
} from "@/types";

function createDefaultUser(): User {
  return {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `guest-${Date.now()}`,
    username: "Guest User",
    email: "",
    avatar: undefined,
    watchlist: [],
    favorites: [],
    ratings: {},
    customLists: [],
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

// ======================
// THEME STORE
// ======================

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      isDark: true,
      setTheme: (theme: Theme) => {
        const applyTheme = (isDarkMode: boolean) => {
          if (typeof document !== "undefined") {
            const root = document.documentElement;
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
                theme === "cinema" || theme === "cinema-dark"
                  ? "cinema"
                  : "light"
              );
            }
          }
          set({ isDark: isDarkMode });
        };

        set({ theme });

        if (typeof window === "undefined") return;

        if (theme === "light" || theme === "cinema") {
          applyTheme(false);
        } else if (theme === "dark" || theme === "cinema-dark") {
          applyTheme(true);
        } else if (theme === "system" || theme === "auto") {
          const isDarkSystem = window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;
          applyTheme(isDarkSystem);
        }
      },
      toggleTheme: () => {
        const { isDark } = get();
        get().setTheme(isDark ? "light" : "dark");
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
            expiry: Date.now() + CACHE_EXPIRY * 4,
          },
        });
      },
      getMovies: (key: string) => {
        const { movies } = get();
        const entry = movies[key];
        if (!entry || entry.expiry < Date.now()) return null;
        return entry.data;
      },
      getMovieDetails: (id: number) => {
        const { movieDetails } = get();
        const entry = movieDetails[id];
        if (!entry || entry.expiry < Date.now()) return null;
        return entry.data;
      },
      getGenres: () => {
        const { genres } = get();
        if (!genres || genres.expiry < Date.now()) return null;
        return genres.data;
      },
      clearExpired: () => {
        const now = Date.now();
        set((state) => ({
          movies: Object.fromEntries(
            Object.entries(state.movies).filter(([, entry]) => entry.expiry > now)
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
        const trimmed = query.trim();
        if (!trimmed) return;
        const { history } = get();
        const newHistory = [
          trimmed,
          ...history.filter((q) => q.toLowerCase() !== trimmed.toLowerCase()),
        ].slice(0, 8);
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
  createCustomList: (name: string, description: string, isPublic: boolean) => void;
  updateCustomList: (
    id: string,
    updates: Partial<Omit<CustomList, "id" | "createdAt" | "movies">>
  ) => void;
  deleteCustomList: (id: string) => void;
  addMovieToList: (listId: string, movieId: number) => void;
  removeMovieFromList: (listId: string, movieId: number) => void;
}>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user: User | null) => {
        if (
          user &&
          user.watchlist &&
          Array.isArray(user.watchlist) &&
          user.watchlist.length > 0 &&
          typeof user.watchlist[0] === "number"
        ) {
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
        set({ user });
      },
      updatePreferences: (newPreferences: Partial<UserPreferences>) => {
        const user = get().user || createDefaultUser();
        set({
          user: {
            ...user,
            preferences: { ...user.preferences, ...newPreferences },
            updatedAt: new Date().toISOString(),
          },
        });
      },
      addToWatchlist: (item) => {
        const user = get().user || createDefaultUser();
        if (!user.watchlist.some((w) => w.id === item.id)) {
          const watchlistItem: WatchlistItem = {
            id: item.id,
            type: item.type,
            status: item.status || "plan-to-watch",
            priority: item.priority || "medium",
            addedAt: new Date().toISOString(),
            notes: item.notes,
          };
          set({
            user: {
              ...user,
              watchlist: [...user.watchlist, watchlistItem],
              updatedAt: new Date().toISOString(),
            },
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
      updateWatchlistItem: (itemId, updates) => {
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
        const user = get().user || createDefaultUser();
        if (!user.favorites.includes(movieId)) {
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
        const user = get().user || createDefaultUser();
        set({
          user: {
            ...user,
            ratings: { ...user.ratings, [movieId]: rating },
            updatedAt: new Date().toISOString(),
          },
        });
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

        return {
          total: user.watchlist.length,
          movies: user.watchlist.filter((item) => item.type === "movie").length,
          tvShows: user.watchlist.filter((item) => item.type === "tv").length,
          completed: user.watchlist.filter((item) => item.status === "completed")
            .length,
          watching: user.watchlist.filter((item) => item.status === "watching")
            .length,
          planToWatch: user.watchlist.filter(
            (item) => item.status === "plan-to-watch"
          ).length,
        };
      },
      createCustomList: (name, description, isPublic) => {
        const user = get().user || createDefaultUser();
        const newList: CustomList = {
          id: crypto.randomUUID(),
          name,
          description,
          isPublic,
          movies: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set({
          user: {
            ...user,
            customLists: [...(user.customLists || []), newList],
            updatedAt: new Date().toISOString(),
          },
        });
      },
      updateCustomList: (id, updates) => {
        const { user } = get();
        if (user && user.customLists) {
          set({
            user: {
              ...user,
              customLists: user.customLists.map((list) =>
                list.id === id
                  ? { ...list, ...updates, updatedAt: new Date().toISOString() }
                  : list
              ),
              updatedAt: new Date().toISOString(),
            },
          });
        }
      },
      deleteCustomList: (id) => {
        const { user } = get();
        if (user && user.customLists) {
          set({
            user: {
              ...user,
              customLists: user.customLists.filter((list) => list.id !== id),
              updatedAt: new Date().toISOString(),
            },
          });
        }
      },
      addMovieToList: (listId, movieId) => {
        const { user } = get();
        if (user && user.customLists) {
          set({
            user: {
              ...user,
              customLists: user.customLists.map((list) =>
                list.id === listId && !list.movies.includes(movieId)
                  ? {
                      ...list,
                      movies: [...list.movies, movieId],
                      updatedAt: new Date().toISOString(),
                    }
                  : list
              ),
              updatedAt: new Date().toISOString(),
            },
          });
        }
      },
      removeMovieFromList: (listId, movieId) => {
        const { user } = get();
        if (user && user.customLists) {
          set({
            user: {
              ...user,
              customLists: user.customLists.map((list) =>
                list.id === listId
                  ? {
                      ...list,
                      movies: list.movies.filter((id) => id !== movieId),
                      updatedAt: new Date().toISOString(),
                    }
                  : list
              ),
              updatedAt: new Date().toISOString(),
            },
          });
        }
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
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };

    if (notification.type === "success") {
      toast.success(notification.title, { description: notification.message });
    } else if (notification.type === "error") {
      toast.error(notification.title, { description: notification.message });
    } else if (notification.type === "warning") {
      toast.warning(notification.title, { description: notification.message });
    } else {
      toast(notification.title, { description: notification.message });
    }

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
// UTILITY INITIALIZERS
// ======================

export const initializeTheme = () => {
  const { theme, setTheme } = useThemeStore.getState();
  setTheme(theme);
};

export const initializeCache = () => {
  const { clearExpired } = useCacheStore.getState();
  clearExpired();
};

export const initializeNotifications = () => {
  const { clearExpired } = useNotificationStore.getState();
  clearExpired();
};
