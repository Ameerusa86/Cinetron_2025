"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import {
  useSearchMovies,
  useGenres,
  useDiscoverMovies,
  useDebounce,
} from "@/hooks";
import type { Movie } from "@/types";
import { PageHeader } from "@/components/media/PageHeader";
import { MediaCard, MediaGridSkeleton } from "@/components/media/MediaCard";

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "top_rated", label: "Highest Rated" },
  { value: "upcoming", label: "Upcoming Releases" },
  { value: "latest", label: "Newest Releases" },
  { value: "revenue", label: "Box Office Hits" },
];

export default function MoviesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [accumulatedMovies, setAccumulatedMovies] = useState<Movie[]>([]);

  const debouncedSearch = useDebounce(searchQuery.trim(), 300);
  const isSearchingMode = debouncedSearch.length > 0;

  const { data: genresData } = useGenres();
  const genres = genresData?.genres || [];

  const todayISO = useMemo(() => new Date().toISOString().split("T")[0], []);

  const discoverOptions = useMemo(() => {
    const base: Record<string, string | number | undefined> = {
      page: currentPage,
      with_genres: selectedGenre || undefined,
    };

    switch (sortBy) {
      case "top_rated":
        base.sort_by = "vote_average.desc";
        base["vote_count.gte"] = 300;
        break;
      case "upcoming":
        base.sort_by = "popularity.desc";
        base["primary_release_date.gte"] = todayISO;
        break;
      case "latest":
        base.sort_by = "primary_release_date.desc";
        base["primary_release_date.lte"] = todayISO;
        base["vote_count.gte"] = 20;
        break;
      case "revenue":
        base.sort_by = "revenue.desc";
        break;
      default:
        base.sort_by = "popularity.desc";
        break;
    }

    return base;
  }, [currentPage, selectedGenre, sortBy, todayISO]);

  // Only fire the active query — zero wasted API calls
  const {
    data: searchResults,
    isLoading: searchLoading,
    isFetching: searchFetching,
  } = useSearchMovies(debouncedSearch, currentPage, isSearchingMode);

  const {
    data: discoveredMovies,
    isLoading: discoverLoading,
    isFetching: discoverFetching,
  } = useDiscoverMovies(discoverOptions, !isSearchingMode);

  const activeData = isSearchingMode ? searchResults : discoveredMovies;
  const isInitialLoading =
    currentPage === 1 && (isSearchingMode ? searchLoading : discoverLoading);
  const isFetchingMore =
    currentPage > 1 && (isSearchingMode ? searchFetching : discoverFetching);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
    setAccumulatedMovies([]);
  }, [selectedGenre, sortBy, debouncedSearch]);

  // Append results smoothly when pages load
  useEffect(() => {
    if (!activeData?.results) return;
    if (currentPage === 1) {
      setAccumulatedMovies(activeData.results);
    } else {
      setAccumulatedMovies((prev) => {
        const seen = new Set(prev.map((m) => m.id));
        const incoming = activeData.results.filter((m) => !seen.has(m.id));
        return [...prev, ...incoming];
      });
    }
  }, [activeData, currentPage]);

  const canLoadMore = Boolean(
    activeData && currentPage < Math.min(activeData.total_pages, 25)
  );
  const selectedGenreName = genres.find((g) => g.id === selectedGenre)?.name;

  return (
    <div className="min-h-screen w-full">
      <PageHeader
        eyebrow="Film Catalog"
        title="Explore"
        accentWord="Movies"
        description="Browse thousands of feature films filtered by genre, acclaim, and release window."
      >
        <div className="flex flex-col md:flex-row gap-3 max-w-3xl">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search movies by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-card pl-10 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear movie search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="relative sm:w-56">
            <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              disabled={isSearchingMode}
              aria-label="Sort movies"
              className="w-full appearance-none rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </PageHeader>

      {/* Genre Bar */}
      {!isSearchingMode && (
        <section className="sticky top-16 z-20 border-b border-border bg-background/85 backdrop-blur-xl py-3.5">
          <div className="container-cinema">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedGenre(null)}
                className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  selectedGenre === null
                    ? "bg-primary text-white"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20"
                }`}
              >
                All Genres
              </button>
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() =>
                    setSelectedGenre(
                      selectedGenre === genre.id ? null : genre.id
                    )
                  }
                  className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    selectedGenre === genre.id
                      ? "bg-primary text-white"
                      : "border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20"
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Results Grid */}
      <section className="py-10">
        <div className="container-cinema">
          {/* Active Filter Status */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted-foreground">Showing:</span>
              {isSearchingMode ? (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 font-medium text-primary">
                  Search: &ldquo;{debouncedSearch}&rdquo;
                </span>
              ) : (
                <>
                  <span className="rounded-lg border border-border bg-secondary px-2.5 py-1 font-medium text-foreground">
                    {sortOptions.find((s) => s.value === sortBy)?.label}
                  </span>
                  {selectedGenreName && (
                    <span className="inline-flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 font-medium text-primary">
                      {selectedGenreName}
                      <button
                        type="button"
                        onClick={() => setSelectedGenre(null)}
                        aria-label="Clear genre"
                        className="hover:text-foreground cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </>
              )}
            </div>

            {activeData && (
              <span className="text-xs font-mono text-muted-foreground">
                {accumulatedMovies.length} of{" "}
                {activeData.total_results.toLocaleString()} titles
              </span>
            )}
          </div>

          {isInitialLoading && <MediaGridSkeleton count={18} />}

          {!isInitialLoading && accumulatedMovies.length === 0 && (
            <div className="surface-card p-12 text-center">
              <h3 className="text-base font-bold text-foreground">
                No movies found
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search keywords or clearing the active genre
                filter.
              </p>
              {(selectedGenre || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedGenre(null);
                  }}
                  className="btn-cinema-outline mt-5"
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}

          {accumulatedMovies.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
              {accumulatedMovies.map((movie) => (
                <MediaCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  mediaType="movie"
                  imagePath={movie.poster_path}
                  rating={movie.vote_average}
                  year={movie.release_date}
                />
              ))}
            </div>
          )}

          {canLoadMore && accumulatedMovies.length > 0 && (
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={isFetchingMore}
                className="btn-cinema-outline px-8 py-3"
              >
                {isFetchingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading more...</span>
                  </>
                ) : (
                  <span>Load More Movies</span>
                )}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
