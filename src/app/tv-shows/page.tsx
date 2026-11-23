"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import {
  useDiscoverTVShows,
  useSearchTVShows,
  useTVGenres,
  useDebounce,
} from "@/hooks";
import type { TVShow } from "@/types";
import { PageHeader } from "@/components/media/PageHeader";
import { MediaCard, MediaGridSkeleton } from "@/components/media/MediaCard";

const sortOptions = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "first_air_date.desc", label: "Newest Releases" },
  { value: "vote_count.desc", label: "Most Reviewed" },
];

export default function TVShowsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [allShows, setAllShows] = useState<TVShow[]>([]);

  const debouncedSearch = useDebounce(searchQuery.trim(), 300);
  const isSearchingMode = debouncedSearch.length > 0;

  const { data: genresData } = useTVGenres();
  const genres = genresData?.genres || [];

  const todayISO = useMemo(() => new Date().toISOString().split("T")[0], []);

  const discoverOptions = useMemo(() => {
    const opts: Record<string, string | number | undefined> = {
      page: currentPage,
      sort_by: sortBy,
      with_genres: selectedGenre || undefined,
    };
    if (sortBy === "vote_average.desc") {
      opts["vote_count.gte"] = 200;
    } else if (sortBy === "first_air_date.desc") {
      opts["first_air_date.lte"] = todayISO;
      opts["vote_count.gte"] = 10;
    }
    return opts;
  }, [currentPage, sortBy, selectedGenre, todayISO]);

  const {
    data: searchData,
    isLoading: searchLoading,
    isFetching: searchFetching,
    error: searchError,
  } = useSearchTVShows(debouncedSearch, currentPage, isSearchingMode);

  const {
    data: discoverData,
    isLoading: discoverLoading,
    isFetching: discoverFetching,
    error: discoverError,
  } = useDiscoverTVShows(discoverOptions, !isSearchingMode);

  const activeData = isSearchingMode ? searchData : discoverData;
  const error = isSearchingMode ? searchError : discoverError;
  const isInitialLoading =
    currentPage === 1 && (isSearchingMode ? searchLoading : discoverLoading);
  const isFetchingMore =
    currentPage > 1 && (isSearchingMode ? searchFetching : discoverFetching);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
    setAllShows([]);
  }, [selectedGenre, sortBy, debouncedSearch]);

  // Append shows safely without duplicates
  useEffect(() => {
    if (!activeData?.results) return;
    if (currentPage === 1) {
      setAllShows(activeData.results);
    } else {
      setAllShows((prev) => {
        const seen = new Set(prev.map((s) => s.id));
        const next = activeData.results.filter((s) => !seen.has(s.id));
        return [...prev, ...next];
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
        eyebrow="Television Catalog"
        title="Explore"
        accentWord="TV Shows"
        description="Discover acclaimed dramas, limited series, documentaries, and global television favorites."
      >
        <div className="flex flex-col md:flex-row gap-3 max-w-3xl">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search television series..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-card pl-10 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear TV search"
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
              aria-label="Sort TV shows"
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

      {/* TV Shows Grid */}
      <section className="py-10">
        <div className="container-cinema">
          {/* Active Filter Status */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted-foreground">Showing:</span>
              {isSearchingMode ? (
                <span className="rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 font-medium text-primary">
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
                {allShows.length} of {activeData.total_results.toLocaleString()}{" "}
                series
              </span>
            )}
          </div>

          {isInitialLoading && <MediaGridSkeleton count={18} />}

          {error && (
            <div className="surface-card p-8 text-center">
              <p className="text-sm text-rose-400">
                Unable to load television series. Please try again later.
              </p>
            </div>
          )}

          {!isInitialLoading && !error && allShows.length === 0 && (
            <div className="surface-card p-12 text-center">
              <h3 className="text-base font-bold text-foreground">
                No TV shows found
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try another search term or clear your active genre filter.
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

          {allShows.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
              {allShows.map((show) => (
                <MediaCard
                  key={show.id}
                  id={show.id}
                  title={show.name}
                  mediaType="tv"
                  imagePath={show.poster_path}
                  rating={show.vote_average}
                  year={show.first_air_date}
                />
              ))}
            </div>
          )}

          {canLoadMore && allShows.length > 0 && (
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
                  <span>Load More Shows</span>
                )}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
