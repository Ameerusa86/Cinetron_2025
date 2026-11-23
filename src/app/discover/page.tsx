"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  Film,
  Tv,
  Layers,
  SlidersHorizontal,
  X,
  ArrowRight,
  Loader2,
  Star,
} from "lucide-react";
import {
  useDiscoverMovies,
  useDiscoverTVShows,
  useGenres,
  useTVGenres,
} from "@/hooks";
import { aiService, MoodAnalysis } from "@/lib/ai-services";
import type { Movie } from "@/types";
import { PageHeader } from "@/components/media/PageHeader";
import { MediaCard, MediaGridSkeleton } from "@/components/media/MediaCard";

const yearRanges = [
  { id: "2025-2026", label: "2025–2026", gte: "2025-01-01", lte: "2026-12-31" },
  { id: "2020s", label: "2020s", gte: "2020-01-01", lte: "2026-12-31" },
  { id: "2010s", label: "2010s", gte: "2010-01-01", lte: "2019-12-31" },
  { id: "2000s", label: "2000s", gte: "2000-01-01", lte: "2009-12-31" },
  { id: "1990s", label: "1990s", gte: "1990-01-01", lte: "1999-12-31" },
  { id: "classics", label: "Classics (<1990)", gte: "1950-01-01", lte: "1989-12-31" },
];

const sortOptions = [
  { id: "popularity.desc", label: "Most Popular" },
  { id: "vote_average.desc", label: "Highest Rated" },
  { id: "release_date.desc", label: "Latest Releases" },
  { id: "vote_count.desc", label: "Most Reviewed" },
  { id: "revenue.desc", label: "Highest Grossing" },
];

const ratingFilters = [
  { value: 0, label: "Any Rating" },
  { value: 6, label: "6.0+" },
  { value: 7, label: "7.0+" },
  { value: 8, label: "8.0+" },
];

const discoveryModes = [
  { id: "mixed" as const, label: "All Media", icon: Layers },
  { id: "movies" as const, label: "Movies", icon: Film },
  { id: "tv" as const, label: "TV Series", icon: Tv },
];

function DiscoverContent() {
  const searchParams = useSearchParams();
  const initialMood = searchParams.get("mood") || "";

  const [discoveryMode, setDiscoveryMode] = useState<"mixed" | "movies" | "tv">(
    "mixed"
  );
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState("popularity.desc");
  const [minRating, setMinRating] = useState(0);

  // AI Mood Search
  const [moodQuery, setMoodQuery] = useState(initialMood);
  const [isSearchingMood, setIsSearchingMood] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<Movie[]>([]);
  const [moodAnalysis, setMoodAnalysis] = useState<MoodAnalysis | null>(null);

  const { data: movieGenresData } = useGenres();
  const { data: tvGenresData } = useTVGenres();

  const activeGenres = useMemo(() => {
    if (discoveryMode === "tv") return tvGenresData?.genres || [];
    return movieGenresData?.genres || [];
  }, [discoveryMode, movieGenresData, tvGenresData]);

  // Reset genre if switching to TV mode where a movie-only genre ID doesn't exist
  useEffect(() => {
    if (
      selectedGenre &&
      activeGenres.length > 0 &&
      !activeGenres.some((g) => g.id === selectedGenre)
    ) {
      setSelectedGenre(null);
    }
  }, [discoveryMode, activeGenres, selectedGenre]);

  const yearSpec = yearRanges.find((y) => y.id === selectedYear);

  const movieDiscoverParams = useMemo(() => {
    const params: Record<string, string | number | undefined> = {
      page: 1,
      sort_by:
        selectedSort === "release_date.desc"
          ? "primary_release_date.desc"
          : selectedSort,
      with_genres: selectedGenre || undefined,
      "primary_release_date.gte": yearSpec?.gte,
      "primary_release_date.lte": yearSpec?.lte,
      "vote_average.gte": minRating > 0 ? minRating : undefined,
      "vote_count.gte":
        selectedSort === "vote_average.desc" || minRating > 0 ? 150 : 20,
    };
    return params;
  }, [selectedSort, selectedGenre, yearSpec, minRating]);

  const tvDiscoverParams = useMemo(() => {
    const tvSort =
      selectedSort === "release_date.desc"
        ? "first_air_date.desc"
        : selectedSort === "revenue.desc"
        ? "popularity.desc"
        : selectedSort;

    const tvGenreMatch =
      selectedGenre &&
      tvGenresData?.genres?.some((g) => g.id === selectedGenre)
        ? selectedGenre
        : undefined;

    return {
      page: 1,
      sort_by: tvSort,
      with_genres: tvGenreMatch,
      "first_air_date.gte": yearSpec?.gte,
      "first_air_date.lte": yearSpec?.lte,
      "vote_average.gte": minRating > 0 ? minRating : undefined,
      "vote_count.gte":
        selectedSort === "vote_average.desc" || minRating > 0 ? 100 : 10,
    };
  }, [selectedSort, selectedGenre, tvGenresData, yearSpec, minRating]);

  const showMovies = discoveryMode === "movies" || discoveryMode === "mixed";
  const showTV = discoveryMode === "tv" || discoveryMode === "mixed";

  const { data: movies, isLoading: moviesLoading } = useDiscoverMovies(
    movieDiscoverParams,
    showMovies
  );
  const { data: tvShows, isLoading: tvLoading } = useDiscoverTVShows(
    tvDiscoverParams,
    showTV
  );

  const runMoodSearch = async (query: string) => {
    if (!query.trim()) return;
    setIsSearchingMood(true);
    try {
      const result = await aiService.detectMoodAndRecommend(query);
      setMoodAnalysis(result.analysis);
      setAiRecommendations(result.recommendations);
    } catch (error) {
      console.error("Failed to search by mood:", error);
    } finally {
      setIsSearchingMood(false);
    }
  };

  useEffect(() => {
    if (initialMood.trim()) {
      runMoodSearch(initialMood);
    }
  }, [initialMood]);

  const handleMoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runMoodSearch(moodQuery);
  };

  const hasActiveFilters = Boolean(
    selectedGenre ||
      selectedYear ||
      selectedSort !== "popularity.desc" ||
      minRating > 0
  );

  const clearAllFilters = () => {
    setSelectedGenre(null);
    setSelectedYear(null);
    setSelectedSort("popularity.desc");
    setMinRating(0);
  };

  return (
    <div className="min-h-screen w-full">
      <PageHeader
        eyebrow="Smart Discovery"
        title="Discover"
        accentWord="Cinema"
        description="Filter across eras, ratings, and genres — or tell Cinetron AI your exact mood."
      >
        <div className="space-y-4">
          {/* AI Mood Input */}
          <form onSubmit={handleMoodSubmit} className="max-w-3xl">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Sparkles className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                <input
                  type="text"
                  value={moodQuery}
                  onChange={(e) => setMoodQuery(e.target.value)}
                  placeholder="Describe your mood... e.g. 'Mind-bending neo-noir' or 'Heartwarming road-trip comedy'"
                  className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <button
                type="submit"
                disabled={isSearchingMood || !moodQuery.trim()}
                className="btn-cinema px-6 py-3 shrink-0"
              >
                {isSearchingMood ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>AI Mood Match</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Media Mode Switcher */}
          <div className="flex flex-wrap gap-2">
            {discoveryModes.map((mode) => {
              const Icon = mode.icon;
              const active = discoveryMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setDiscoveryMode(mode.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium border transition-colors cursor-pointer ${
                    active
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </PageHeader>

      {/* Filter Bar */}
      <section className="border-b border-border bg-card/40 py-6">
        <div className="container-cinema space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
              <span>Refine Catalog</span>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                Reset all filters
              </button>
            )}
          </div>

          {/* Controls Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Era */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Release Period
              </label>
              <div className="flex flex-wrap gap-1.5">
                {yearRanges.map((year) => (
                  <button
                    key={year.id}
                    type="button"
                    onClick={() =>
                      setSelectedYear(selectedYear === year.id ? null : year.id)
                    }
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-medium border transition-colors cursor-pointer ${
                      selectedYear === year.id
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {year.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Minimum Rating
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ratingFilters.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setMinRating(r.value)}
                    className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer ${
                      minRating === r.value
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r.value > 0 && (
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    )}
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div className="space-y-1.5">
              <label
                htmlFor="discover-sort"
                className="text-xs font-medium text-muted-foreground"
              >
                Sort Order
              </label>
              <select
                id="discover-sort"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Genres Strip */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            <button
              type="button"
              onClick={() => setSelectedGenre(null)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                selectedGenre === null
                  ? "bg-primary text-white"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              All Genres
            </button>
            {activeGenres.map((genre) => (
              <button
                key={genre.id}
                type="button"
                onClick={() =>
                  setSelectedGenre(selectedGenre === genre.id ? null : genre.id)
                }
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  selectedGenre === genre.id
                    ? "bg-primary text-white"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results Content */}
      <div className="container-cinema py-10 space-y-14">
        {/* AI Recommendations Banner */}
        {aiRecommendations.length > 0 && (
          <section className="rounded-2xl border border-primary/25 bg-card p-6 sm:p-8">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI Mood Selection</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  Matched for &ldquo;{moodQuery}&rdquo;
                </h2>
                {moodAnalysis && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Detected mood:{" "}
                    <span className="font-semibold text-foreground capitalize">
                      {moodAnalysis.primaryMood}
                    </span>{" "}
                    · Confidence{" "}
                    <span className="font-mono text-foreground">
                      {(moodAnalysis.confidence * 100).toFixed(0)}%
                    </span>
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setAiRecommendations([]);
                  setMoodAnalysis(null);
                  setMoodQuery("");
                }}
                className="btn-cinema-outline self-start sm:self-auto"
              >
                <X className="h-4 w-4" />
                Clear AI Picks
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
              {aiRecommendations.map((movie) => (
                <MediaCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  mediaType="movie"
                  imagePath={movie.poster_path}
                  rating={movie.vote_average}
                  year={movie.release_date}
                  badge="AI Match"
                />
              ))}
            </div>
          </section>
        )}

        {/* Discovered Movies */}
        {showMovies && (
          <section>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Discovered Movies
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {movies?.total_results
                    ? `${movies.total_results.toLocaleString()} matching films`
                    : "Curated film catalog"}
                </p>
              </div>
              <Link
                href="/movies"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>All Movies</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {moviesLoading ? (
              <MediaGridSkeleton count={12} />
            ) : movies && movies.results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                {movies.results
                  .slice(0, discoveryMode === "movies" ? 18 : 12)
                  .map((movie) => (
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
            ) : (
              <div className="surface-card p-10 text-center text-sm text-muted-foreground">
                No movies matched this filter combination. Try loosening the
                minimum rating or period.
              </div>
            )}
          </section>
        )}

        {/* Discovered TV Shows */}
        {showTV && (
          <section>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Discovered TV Series
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {tvShows?.total_results
                    ? `${tvShows.total_results.toLocaleString()} matching series`
                    : "Curated television catalog"}
                </p>
              </div>
              <Link
                href="/tv-shows"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>All TV Shows</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {tvLoading ? (
              <MediaGridSkeleton count={12} />
            ) : tvShows && tvShows.results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                {tvShows.results
                  .slice(0, discoveryMode === "tv" ? 18 : 12)
                  .map((show) => (
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
            ) : (
              <div className="surface-card p-10 text-center text-sm text-muted-foreground">
                No TV series matched this filter combination.
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense
      fallback={
        <div className="container-cinema pt-28 pb-16">
          <MediaGridSkeleton count={12} />
        </div>
      }
    >
      <DiscoverContent />
    </Suspense>
  );
}
