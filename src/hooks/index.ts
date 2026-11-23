import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import tmdbClient, {
  type DiscoverMoviesOptions,
  type DiscoverTVOptions,
} from "@/lib/tmdb-client";
import {
  useCacheStore,
  useSearchStore,
  useNotificationStore,
  useUserStore,
} from "@/stores";
import type { Movie, MultiSearchResult, WatchlistItem } from "@/types";
import { extractIdFromSlug } from "@/lib/slug-utils";

// ======================
// TMDB API HOOKS
// ======================

export const useTrendingMovies = (
  timeWindow: "day" | "week" = "day",
  enabled: boolean = true
) => {
  const { getMovies, addMovies } = useCacheStore();
  const cacheKey = `trending-${timeWindow}`;

  return useQuery({
    queryKey: ["trending-movies", timeWindow],
    queryFn: async () => {
      const cached = getMovies(cacheKey);
      if (cached) return cached;
      const data = await tmdbClient.getTrendingMovies(timeWindow);
      addMovies(cacheKey, data);
      return data;
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};

export const useTrendingTVShows = (
  timeWindow: "day" | "week" = "day",
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["trending-tv", timeWindow],
    queryFn: () => tmdbClient.getTrendingTVShows(timeWindow),
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};

export const useTrendingPeople = (
  timeWindow: "day" | "week" = "day",
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["trending-people", timeWindow],
    queryFn: () => tmdbClient.getTrendingPeople(timeWindow),
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};

export const usePopularMovies = (page: number = 1, enabled: boolean = true) => {
  const { getMovies, addMovies } = useCacheStore();
  const cacheKey = `popular-${page}`;

  return useQuery({
    queryKey: ["popular-movies", page],
    queryFn: async () => {
      const cached = getMovies(cacheKey);
      if (cached) return cached;
      const data = await tmdbClient.getPopularMovies(page);
      addMovies(cacheKey, data);
      return data;
    },
    enabled,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};

export const useTopRatedMovies = (page: number = 1, enabled: boolean = true) => {
  const { getMovies, addMovies } = useCacheStore();
  const cacheKey = `top-rated-${page}`;

  return useQuery({
    queryKey: ["top-rated-movies", page],
    queryFn: async () => {
      const cached = getMovies(cacheKey);
      if (cached) return cached;
      const data = await tmdbClient.getTopRatedMovies(page);
      addMovies(cacheKey, data);
      return data;
    },
    enabled,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
  });
};

export const useUpcomingMovies = (page: number = 1, enabled: boolean = true) => {
  const { getMovies, addMovies } = useCacheStore();
  const cacheKey = `upcoming-${page}`;

  return useQuery({
    queryKey: ["upcoming-movies", page],
    queryFn: async () => {
      const cached = getMovies(cacheKey);
      if (cached) return cached;
      const data = await tmdbClient.getUpcomingMovies(page);
      addMovies(cacheKey, data);
      return data;
    },
    enabled,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
};

export const useNowPlayingMovies = (
  page: number = 1,
  enabled: boolean = true
) => {
  const { getMovies, addMovies } = useCacheStore();
  const cacheKey = `now-playing-${page}`;

  return useQuery({
    queryKey: ["now-playing-movies", page],
    queryFn: async () => {
      const cached = getMovies(cacheKey);
      if (cached) return cached;
      const data = await tmdbClient.getNowPlayingMovies(page);
      addMovies(cacheKey, data);
      return data;
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};

export const useSearchMovies = (
  query: string,
  page: number = 1,
  enabled: boolean = true
) => {
  const { getMovies, addMovies } = useCacheStore();
  const cacheKey = `search-${query}-${page}`;

  return useQuery({
    queryKey: ["search-movies", query, page],
    queryFn: async () => {
      if (!query.trim()) {
        return { results: [], total_pages: 0, total_results: 0, page: 1 };
      }
      const cached = getMovies(cacheKey);
      if (cached) return cached;
      const data = await tmdbClient.searchMovies(query, page);
      addMovies(cacheKey, data);
      return data;
    },
    enabled: enabled && !!query.trim(),
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
  });
};

export const useSearchTVShows = (
  query: string,
  page: number = 1,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["search-tv-shows", query, page],
    queryFn: async () => {
      if (!query.trim()) {
        return { results: [], total_pages: 0, total_results: 0, page: 1 };
      }
      return tmdbClient.searchTVShows(query, page);
    },
    enabled: enabled && !!query.trim(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};

export const useMultiSearch = (
  query: string,
  page: number = 1,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["multi-search", query, page],
    queryFn: async () => {
      if (!query.trim()) {
        return { results: [], total_pages: 0, total_results: 0, page: 1 };
      }
      return tmdbClient.multiSearch(query, page);
    },
    enabled: enabled && !!query.trim(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};

export const usePopularTVShows = (
  page: number = 1,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["popular-tv-shows", page],
    queryFn: () => tmdbClient.getPopularTVShows(page),
    enabled,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};

export const useTopRatedTVShows = (
  page: number = 1,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["top-rated-tv-shows", page],
    queryFn: () => tmdbClient.getTopRatedTVShows(page),
    enabled,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
  });
};

export const useDiscoverTVShows = (
  options: DiscoverTVOptions = {},
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["discover-tv-shows", options],
    queryFn: () => tmdbClient.discoverTVShows(options),
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};

export const useTVGenres = () => {
  return useQuery({
    queryKey: ["tv-genres"],
    queryFn: () => tmdbClient.getTVGenres(),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
};

export const useMovieDetails = (movieId: number, enabled: boolean = true) => {
  const { getMovieDetails, addMovieDetails } = useCacheStore();

  return useQuery({
    queryKey: ["movie-details", movieId],
    queryFn: async () => {
      const cached = getMovieDetails(movieId);
      if (cached) return cached;
      const data = await tmdbClient.getMovieDetails(movieId, [
        "credits",
        "videos",
        "similar",
        "reviews",
      ]);
      addMovieDetails(movieId, data);
      return data;
    },
    enabled: enabled && !!movieId,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
  });
};

export const useMovieCredits = (movieId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["movie-credits", movieId],
    queryFn: () => tmdbClient.getMovieCredits(movieId),
    enabled: enabled && !!movieId,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
};

export const useMovieVideos = (movieId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["movie-videos", movieId],
    queryFn: () => tmdbClient.getMovieVideos(movieId),
    enabled: enabled && !!movieId,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
};

export const useMovieReviews = (
  movieId: number,
  page: number = 1,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["movie-reviews", movieId, page],
    queryFn: () => tmdbClient.getMovieReviews(movieId, page),
    enabled: enabled && !!movieId,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};

export const useTVReviews = (
  tvId: number,
  page: number = 1,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["tv-reviews", tvId, page],
    queryFn: () => tmdbClient.getTVReviews(tvId, page),
    enabled: enabled && !!tvId,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};

export const useSimilarMovies = (movieId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["similar-movies", movieId],
    queryFn: () => tmdbClient.getSimilarMovies(movieId),
    enabled: enabled && !!movieId,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
  });
};

export const useMovieRecommendations = (
  movieId: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["movie-recommendations", movieId],
    queryFn: () => tmdbClient.getMovieRecommendations(movieId),
    enabled: enabled && !!movieId,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
  });
};

export const useMovieWatchProviders = (
  movieId: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["movie-watch-providers", movieId],
    queryFn: () => tmdbClient.getMovieWatchProviders(movieId),
    enabled: enabled && !!movieId,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
};

export const useTVWatchProviders = (tvId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["tv-watch-providers", tvId],
    queryFn: () => tmdbClient.getTVWatchProviders(tvId),
    enabled: enabled && !!tvId,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
};

export const useGenres = () => {
  const { getGenres, addGenres } = useCacheStore();

  return useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const cached = getGenres();
      if (cached) return { genres: cached };
      const data = await tmdbClient.getMovieGenres();
      addGenres(data.genres);
      return data;
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
};

export const useDiscoverMovies = (
  options: DiscoverMoviesOptions = {},
  enabled: boolean = true
) => {
  const { getMovies, addMovies } = useCacheStore();
  const cacheKey = `discover-${JSON.stringify(options)}`;

  return useQuery({
    queryKey: ["discover-movies", options],
    queryFn: async () => {
      const cached = getMovies(cacheKey);
      if (cached) return cached;
      const data = await tmdbClient.discoverMovies(options);
      addMovies(cacheKey, data);
      return data;
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};

export const useMoviesByGenre = (
  genreId: number,
  page: number = 1,
  enabled: boolean = true
) => {
  const { getMovies, addMovies } = useCacheStore();
  const cacheKey = `genre-${genreId}-${page}`;

  return useQuery({
    queryKey: ["movies-by-genre", genreId, page],
    queryFn: async () => {
      const cached = getMovies(cacheKey);
      if (cached) return cached;
      const data = await tmdbClient.getMoviesByGenre(genreId, page);
      addMovies(cacheKey, data);
      return data;
    },
    enabled: enabled && genreId > 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};

// ======================
// SEARCH HOOKS
// ======================

export const useSearch = () => {
  const {
    query,
    results,
    isLoading,
    error,
    filters,
    setQuery,
    setResults,
    setLoading,
    setError,
    addToHistory,
  } = useSearchStore();

  const search = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let results: MultiSearchResult[] = [];

        if (filters.mediaType === "movie") {
          const response = await tmdbClient.searchMovies(searchQuery);
          results = response.results;
        } else if (filters.mediaType === "tv") {
          const response = await tmdbClient.searchTVShows(searchQuery);
          results = response.results;
        } else if (filters.mediaType === "person") {
          const response = await tmdbClient.searchPeople(searchQuery);
          results = response.results;
        } else {
          const response = await tmdbClient.multiSearch(searchQuery);
          results = response.results;
        }

        if (filters.genre) {
          results = results.filter(
            (item) =>
              "genre_ids" in item && item.genre_ids.includes(filters.genre!)
          );
        }

        results.sort((a, b) => {
          const sortBy = filters.sortBy;
          const sortOrder = filters.sortOrder;

          let aValue = 0;
          let bValue = 0;

          if (sortBy === "popularity") {
            aValue = a.popularity;
            bValue = b.popularity;
          } else if (
            sortBy === "vote_average" &&
            "vote_average" in a &&
            "vote_average" in b
          ) {
            aValue = a.vote_average;
            bValue = b.vote_average;
          } else if (
            sortBy === "release_date" &&
            "release_date" in a &&
            "release_date" in b
          ) {
            aValue = new Date(a.release_date).getTime();
            bValue = new Date(b.release_date).getTime();
          }

          return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        });

        setResults(results);
        addToHistory(searchQuery);
      } catch (error) {
        console.error("Search error:", error);
        setError("An error occurred while searching. Please try again.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [filters, setResults, setLoading, setError, addToHistory]
  );

  return {
    query,
    results,
    isLoading,
    error,
    filters,
    search,
    setQuery,
  };
};

// ======================
// INFINITE SCROLL & UTILITY HOOKS
// ======================

export const useInfiniteScroll = (
  fetchMore: () => void,
  hasMore: boolean,
  isLoading: boolean,
  threshold: number = 0.1
) => {
  const { ref, inView } = useInView({
    threshold,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      fetchMore();
    }
  }, [inView, hasMore, isLoading, fetchMore]);

  return { ref, inView };
};

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      } catch {
        // Ignore storage quota errors
      }
    },
    [key]
  );

  return [storedValue, setValue];
};

export const useMovieActions = () => {
  const {
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
    rateMovie,
    isInWatchlist,
    isInFavorites,
    getMovieRating,
  } = useUserStore();

  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();

  const toggleWatchlist = useCallback(
    (movie: Movie) => {
      const inWatchlist = isInWatchlist(movie.id);

      if (inWatchlist) {
        removeFromWatchlist(movie.id);
        addNotification({
          type: "info",
          title: "Removed from Watchlist",
          message: `"${movie.title}" has been removed from your watchlist.`,
          read: false,
        });
      } else {
        addToWatchlist({ id: movie.id, type: "movie" });
        addNotification({
          type: "success",
          title: "Added to Watchlist",
          message: `"${movie.title}" has been added to your watchlist.`,
          read: false,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["user-watchlist"] });
    },
    [
      isInWatchlist,
      addToWatchlist,
      removeFromWatchlist,
      addNotification,
      queryClient,
    ]
  );

  const toggleFavorites = useCallback(
    (movie: Movie) => {
      const inFavorites = isInFavorites(movie.id);

      if (inFavorites) {
        removeFromFavorites(movie.id);
        addNotification({
          type: "info",
          title: "Removed from Favorites",
          message: `"${movie.title}" has been removed from your favorites.`,
          read: false,
        });
      } else {
        addToFavorites(movie.id);
        addNotification({
          type: "success",
          title: "Added to Favorites",
          message: `"${movie.title}" has been added to your favorites.`,
          actionText: "View Profile",
          actionUrl: "/profile",
          read: false,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["user-favorites"] });
    },
    [
      isInFavorites,
      addToFavorites,
      removeFromFavorites,
      addNotification,
      queryClient,
    ]
  );

  const handleRating = useCallback(
    (movie: Movie, rating: number) => {
      rateMovie(movie.id, rating);
      addNotification({
        type: "success",
        title: "Rating Saved",
        message: `You rated "${movie.title}" ${rating}/10.`,
        read: false,
      });

      queryClient.invalidateQueries({ queryKey: ["user-ratings"] });
    },
    [rateMovie, addNotification, queryClient]
  );

  return {
    toggleWatchlist,
    toggleFavorites,
    handleRating,
    isInWatchlist,
    isInFavorites,
    getMovieRating,
  };
};

export const useVoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript] = useState("");
  const [error] = useState<string | null>(null);

  const startListening = useCallback(() => setIsListening(true), []);
  const stopListening = useCallback(() => setIsListening(false), []);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
  };
};

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const updateNetworkStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);
    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
    };
  }, []);

  return isOnline;
};

export const useViewport = () => {
  const [viewport, setViewport] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  return {
    ...viewport,
    isMobile: viewport.width < 768,
    isTablet: viewport.width >= 768 && viewport.width < 1024,
    isDesktop: viewport.width >= 1024,
  };
};

// ======================
// SLUG-BASED HOOKS
// ======================

export const useMovieDetailsBySlug = (
  slug: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["movie-details-by-slug", slug],
    queryFn: async () => {
      const movieId = extractIdFromSlug(slug);
      const { getMovieDetails, addMovieDetails } = useCacheStore.getState();

      const cached = getMovieDetails(movieId);
      if (cached && cached.credits && cached.videos) {
        return cached;
      }

      const data = await tmdbClient.getMovieDetails(movieId, [
        "credits",
        "videos",
        "similar",
        "recommendations",
        "reviews",
      ]);
      addMovieDetails(movieId, data);
      return data;
    },
    enabled: enabled && !!slug,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
  });
};

export const useTVShowDetailsBySlug = (
  slug: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["tv-show-details-by-slug", slug],
    queryFn: async () => {
      const tvShowId = extractIdFromSlug(slug);
      return tmdbClient.getTVShowDetails(tvShowId, [
        "credits",
        "videos",
        "similar",
        "recommendations",
        "reviews",
      ]);
    },
    enabled: enabled && !!slug,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
  });
};

export const usePersonDetailsBySlug = (
  slug: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["person-details-by-slug", slug],
    queryFn: async () => {
      const personId = extractIdFromSlug(slug);
      return tmdbClient.getPersonDetails(personId);
    },
    enabled: enabled && !!slug,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
  });
};

export const usePersonMovieCredits = (
  slug: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["person-movie-credits", slug],
    queryFn: async () => {
      const personId = extractIdFromSlug(slug);
      return tmdbClient.getPersonMovieCredits(personId);
    },
    enabled: enabled && !!slug,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};

export const usePersonTVCredits = (slug: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["person-tv-credits", slug],
    queryFn: async () => {
      const personId = extractIdFromSlug(slug);
      return tmdbClient.getPersonTVCredits(personId);
    },
    enabled: enabled && !!slug,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};

export const useSeasonDetails = (
  tvShowSlug: string,
  seasonNumber: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["season-details", tvShowSlug, seasonNumber],
    queryFn: async () => {
      const tvId = extractIdFromSlug(tvShowSlug);
      return tmdbClient.getSeasonDetails(tvId, seasonNumber);
    },
    enabled: enabled && !!tvShowSlug && seasonNumber > 0,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};

export const useWatchlistDetails = (
  items: WatchlistItem[] | number[]
) => {
  const normalized = items.map((item) =>
    typeof item === "number" ? { id: item, type: undefined } : { id: item.id, type: item.type }
  );
  const key = [...normalized]
    .sort((a, b) => a.id - b.id)
    .map((x) => `${x.type || "any"}-${x.id}`)
    .join(",");

  return useQuery({
    queryKey: ["watchlist-details", key],
    queryFn: async () => {
      if (normalized.length === 0) return [];

      const promises = normalized.map(async ({ id, type }) => {
        try {
          if (type === "tv") {
            return await tmdbClient.getTVShowDetails(id);
          }
          if (type === "movie") {
            return await tmdbClient.getMovieDetails(id);
          }
          try {
            return await tmdbClient.getMovieDetails(id);
          } catch {
            return await tmdbClient.getTVShowDetails(id);
          }
        } catch {
          return null;
        }
      });

      const results = await Promise.all(promises);
      return results.filter((item): item is NonNullable<typeof item> => item !== null);
    },
    enabled: normalized.length > 0,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};
