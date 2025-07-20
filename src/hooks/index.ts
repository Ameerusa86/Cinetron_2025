import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import tmdbClient from "@/lib/tmdb-client";
import {
  useCacheStore,
  useSearchStore,
  useNotificationStore,
  useUserStore,
} from "@/stores";
import type {
  Movie,
  MultiSearchResult,
  TVShow,
  MovieDetails,
  TVShowDetails,
} from "@/types";
import { extractIdFromSlug } from "@/lib/slug-utils";

// ======================
// TMDB API HOOKS
// ======================

/**
 * Hook to fetch trending movies
 */
export const useTrendingMovies = (timeWindow: "day" | "week" = "day") => {
  const { getMovies, addMovies } = useCacheStore();
  const cacheKey = `trending-${timeWindow}`;

  return useQuery({
    queryKey: ["trending-movies", timeWindow],
    queryFn: async () => {
      // Check cache first
      const cached = getMovies(cacheKey);
      if (cached) {
        return cached;
      }

      // Fetch from API
      const data = await tmdbClient.getTrendingMovies(timeWindow);
      addMovies(cacheKey, data);
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

/**
 * Hook to fetch popular movies
 */
export const usePopularMovies = (page: number = 1) => {
  const { getMovies, addMovies } = useCacheStore();
  const cacheKey = `popular-${page}`;

  return useQuery({
    queryKey: ["popular-movies", page],
    queryFn: async () => {
      const cached = getMovies(cacheKey);
      if (cached) {
        return cached;
      }

      const data = await tmdbClient.getPopularMovies(page);
      addMovies(cacheKey, data);
      return data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30,
  });
};

/**
 * Hook to fetch top rated movies
 */
export const useTopRatedMovies = (page: number = 1) => {
  const { getMovies, addMovies } = useCacheStore();
  const cacheKey = `top-rated-${page}`;

  return useQuery({
    queryKey: ["top-rated-movies", page],
    queryFn: async () => {
      const cached = getMovies(cacheKey);
      if (cached) {
        return cached;
      }

      const data = await tmdbClient.getTopRatedMovies(page);
      addMovies(cacheKey, data);
      return data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes (top rated changes less frequently)
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};

/**
 * Hook to fetch upcoming movies
 */
export const useUpcomingMovies = (page: number = 1) => {
  const { getMovies, addMovies } = useCacheStore();
  const cacheKey = `upcoming-${page}`;

  return useQuery({
    queryKey: ["upcoming-movies", page],
    queryFn: async () => {
      const cached = getMovies(cacheKey);
      if (cached) {
        return cached;
      }

      const data = await tmdbClient.getUpcomingMovies(page);
      addMovies(cacheKey, data);
      return data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60,
  });
};

/**
 * Hook to fetch now playing movies
 */
export const useNowPlayingMovies = (page: number = 1) => {
  const { getMovies, addMovies } = useCacheStore();
  const cacheKey = `now-playing-${page}`;

  return useQuery({
    queryKey: ["now-playing-movies", page],
    queryFn: async () => {
      const cached = getMovies(cacheKey);
      if (cached) {
        return cached;
      }

      const data = await tmdbClient.getNowPlayingMovies(page);
      addMovies(cacheKey, data);
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes (now playing changes frequently)
    gcTime: 1000 * 60 * 30,
  });
};

/**
 * Hook to search movies
 */
export const useSearchMovies = (query: string, page: number = 1) => {
  const { getMovies, addMovies } = useCacheStore();
  const cacheKey = `search-${query}-${page}`;

  return useQuery({
    queryKey: ["search-movies", query, page],
    queryFn: async () => {
      if (!query.trim()) {
        return { results: [], total_pages: 0, total_results: 0, page: 1 };
      }

      const cached = getMovies(cacheKey);
      if (cached) {
        return cached;
      }

      const data = await tmdbClient.searchMovies(query, page);
      addMovies(cacheKey, data);
      return data;
    },
    enabled: !!query.trim(),
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};

/**
 * Hook to fetch popular TV shows
 */
export const usePopularTVShows = (page: number = 1) => {
  return useQuery({
    queryKey: ["popular-tv-shows", page],
    queryFn: async () => {
      const data = await tmdbClient.getPopularTVShows(page);
      return data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30,
  });
};

/**
 * Hook to fetch movie details
 */
export const useMovieDetails = (movieId: number, enabled: boolean = true) => {
  const { getMovieDetails, addMovieDetails } = useCacheStore();

  return useQuery({
    queryKey: ["movie-details", movieId],
    queryFn: async () => {
      const cached = getMovieDetails(movieId);
      if (cached) {
        return cached;
      }

      const data = await tmdbClient.getMovieDetails(movieId, [
        "credits",
        "videos",
        "similar",
      ]);
      addMovieDetails(movieId, data);
      return data;
    },
    enabled: enabled && !!movieId,
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};

/**
 * Hook to fetch movie credits
 */
export const useMovieCredits = (movieId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["movie-credits", movieId],
    queryFn: () => tmdbClient.getMovieCredits(movieId),
    enabled: enabled && !!movieId,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60,
  });
};

/**
 * Hook to fetch movie videos
 */
export const useMovieVideos = (movieId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["movie-videos", movieId],
    queryFn: () => tmdbClient.getMovieVideos(movieId),
    enabled: enabled && !!movieId,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
};

/**
 * Hook to fetch movie reviews
 */
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

/**
 * Hook to fetch similar movies
 */
export const useSimilarMovies = (movieId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["similar-movies", movieId],
    queryFn: () => tmdbClient.getSimilarMovies(movieId),
    enabled: enabled && !!movieId,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
  });
};

/**
 * Hook to fetch movie recommendations
 */
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

/**
 * Hook to fetch genres
 */
export const useGenres = () => {
  const { getGenres, addGenres } = useCacheStore();

  return useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const cached = getGenres();
      if (cached) {
        return { genres: cached };
      }

      const data = await tmdbClient.getMovieGenres();
      addGenres(data.genres);
      return data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

/**
 * Hook to discover movies with filters
 */
export const useDiscoverMovies = (
  options: Parameters<typeof tmdbClient.discoverMovies>[0] = {}
) => {
  const { getMovies, addMovies } = useCacheStore();
  const cacheKey = `discover-${JSON.stringify(options)}`;

  return useQuery({
    queryKey: ["discover-movies", options],
    queryFn: async () => {
      const cached = getMovies(cacheKey);
      if (cached) {
        return cached;
      }

      const data = await tmdbClient.discoverMovies(options);
      addMovies(cacheKey, data);
      return data;
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};

// ======================
// SEARCH HOOKS
// ======================

/**
 * Hook for searching movies, people, and TV shows
 */
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
        } else if (filters.mediaType === "person") {
          const response = await tmdbClient.searchPeople(searchQuery);
          results = response.results;
        } else {
          const response = await tmdbClient.multiSearch(searchQuery);
          results = response.results;
        }

        // Apply additional filters
        if (filters.genre) {
          results = results.filter(
            (item) =>
              "genre_ids" in item && item.genre_ids.includes(filters.genre!)
          );
        }

        // Sort results
        results.sort((a, b) => {
          const sortBy = filters.sortBy;
          const sortOrder = filters.sortOrder;

          let aValue: number = 0;
          let bValue: number = 0;

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
// INFINITE SCROLL HOOKS
// ======================

/**
 * Hook for infinite scrolling with intersection observer
 */
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

// ======================
// UTILITY HOOKS
// ======================

/**
 * Hook to debounce a value
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for local storage with SSR safety
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
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
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  return [storedValue, setValue];
};

/**
 * Hook for managing user interactions with movies
 */
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
        addToWatchlist(movie.id);
        addNotification({
          type: "success",
          title: "Added to Watchlist",
          message: `"${movie.title}" has been added to your watchlist.`,
          read: false,
        });
      }

      // Invalidate relevant queries
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
          actionText: "View Favorites",
          actionUrl: "/favorites",
          read: false,
        });
      }

      // Invalidate relevant queries
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
        message: `You rated "${movie.title}" ${rating}/10 stars.`,
        read: false,
      });

      // Invalidate relevant queries
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

/**
 * Hook for voice commands (placeholder for future implementation)
 */
export const useVoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript] = useState("");
  const [error] = useState<string | null>(null);

  // TODO: Implement Web Speech API
  const startListening = useCallback(() => {
    setIsListening(true);
    // Implementation placeholder
    console.log("🎤 Voice recognition would start here");
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
    // Implementation placeholder
    console.log("🎤 Voice recognition would stop here");
  }, []);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
  };
};

/**
 * Hook for checking online status
 */
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

/**
 * Hook for viewport size
 */
export const useViewport = () => {
  const [viewport, setViewport] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const isMobile = viewport.width < 768;
  const isTablet = viewport.width >= 768 && viewport.width < 1024;
  const isDesktop = viewport.width >= 1024;

  return {
    ...viewport,
    isMobile,
    isTablet,
    isDesktop,
  };
};

// ======================
// SLUG-BASED HOOKS
// ======================

/**
 * Hook to fetch movie details by slug
 */
export const useMovieDetailsBySlug = (
  slug: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["movie-details-by-slug", slug],
    queryFn: async () => {
      try {
        const movieId = extractIdFromSlug(slug);
        const { getMovieDetails, addMovieDetails } = useCacheStore.getState();

        const cached = getMovieDetails(movieId);
        if (cached) {
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
      } catch (error) {
        throw new Error(`Invalid movie slug: ${slug}`);
      }
    },
    enabled: enabled && !!slug,
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};

/**
 * Hook to fetch TV show details by slug
 */
export const useTVShowDetailsBySlug = (
  slug: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["tv-show-details-by-slug", slug],
    queryFn: async () => {
      try {
        const tvShowId = extractIdFromSlug(slug);
        const data = await tmdbClient.getTVShowDetails(tvShowId, [
          "credits",
          "videos",
          "similar",
          "recommendations",
          "reviews",
        ]);
        return data;
      } catch (error) {
        throw new Error(`Invalid TV show slug: ${slug}`);
      }
    },
    enabled: enabled && !!slug,
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};
