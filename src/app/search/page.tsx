"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search as SearchIcon,
  Film,
  Tv,
  User,
  Sparkles,
  X,
  Clock,
  Loader2,
} from "lucide-react";
import { useMultiSearch, useDebounce } from "@/hooks";
import { useSearchStore } from "@/stores";
import { PageHeader } from "@/components/media/PageHeader";
import { MediaCard, MediaGridSkeleton } from "@/components/media/MediaCard";
import type { MultiSearchResult } from "@/types";

type TabFilter = "all" | "movie" | "tv" | "person";

function getMediaType(item: MultiSearchResult): "movie" | "tv" | "person" {
  if ("media_type" in item && item.media_type) {
    if (item.media_type === "tv") return "tv";
  }
  if ("title" in item) return "movie";
  if ("known_for_department" in item) return "person";
  return "tv";
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";

  const [inputValue, setInputValue] = useState(initialQ);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<MultiSearchResult[]>([]);

  const debouncedQuery = useDebounce(inputValue.trim(), 320);
  const { history, addToHistory, clearHistory } = useSearchStore();

  // Sync URL -> state if user uses Navbar search while already on /search
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setInputValue(q);
  }, [searchParams]);

  // Reset pagination when query changes
  useEffect(() => {
    setPage(1);
    setAccumulated([]);
    if (debouncedQuery) {
      addToHistory(debouncedQuery);
      const currentUrlQ = searchParams.get("q") || "";
      if (currentUrlQ !== debouncedQuery) {
        router.replace(`/search?q=${encodeURIComponent(debouncedQuery)}`, {
          scroll: false,
        });
      }
    }
  }, [debouncedQuery, addToHistory, router, searchParams]);

  const { data, isLoading, isFetching, error } = useMultiSearch(
    debouncedQuery,
    page
  );

  // Append results across pages cleanly
  useEffect(() => {
    if (!data?.results) return;
    if (page === 1) {
      setAccumulated(data.results);
    } else {
      setAccumulated((prev) => {
        const seen = new Set(prev.map((x) => `${getMediaType(x)}-${x.id}`));
        const next = data.results.filter(
          (x) => !seen.has(`${getMediaType(x)}-${x.id}`)
        );
        return [...prev, ...next];
      });
    }
  }, [data, page]);

  const counts = useMemo(() => {
    const movies = accumulated.filter((i) => getMediaType(i) === "movie").length;
    const tv = accumulated.filter((i) => getMediaType(i) === "tv").length;
    const people = accumulated.filter((i) => getMediaType(i) === "person").length;
    return { all: accumulated.length, movie: movies, tv, person: people };
  }, [accumulated]);

  const filtered = useMemo(() => {
    if (activeTab === "all") return accumulated;
    return accumulated.filter((item) => getMediaType(item) === activeTab);
  }, [accumulated, activeTab]);

  const canLoadMore = Boolean(data && page < data.total_pages);

  const tabs: {
    id: TabFilter;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: "all", label: "All Results", icon: Sparkles },
    { id: "movie", label: "Movies", icon: Film },
    { id: "tv", label: "TV Series", icon: Tv },
    { id: "person", label: "People", icon: User },
  ];

  return (
    <div className="min-h-screen w-full">
      <PageHeader
        eyebrow="Catalog Search"
        title="Search"
        accentWord="Cinetron"
        description="Find films, television series, actors, and directors across the entire TMDB archive."
      >
        <div className="max-w-2xl">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search for Dune, Breaking Bad, Christopher Nolan..."
              className="w-full rounded-xl border border-border bg-card pl-12 pr-12 py-3.5 text-base text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              autoFocus
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => {
                  setInputValue("");
                  router.replace("/search", { scroll: false });
                }}
                aria-label="Clear search query"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {history.length > 0 && !debouncedQuery && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                Recent:
              </span>
              {history.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setInputValue(term)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/70 px-3 py-1.5 text-xs font-medium text-foreground hover:border-foreground/20 transition-colors cursor-pointer"
                >
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  {term}
                </button>
              ))}
              <button
                type="button"
                onClick={clearHistory}
                className="text-xs text-muted-foreground hover:text-primary ml-1 cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </PageHeader>

      <section className="py-10">
        <div className="container-cinema">
          {!debouncedQuery ? (
            <div className="surface-card p-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground">
                <SearchIcon className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-foreground">
                What are you looking for?
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground max-w-md mx-auto">
                Type a movie title, TV show, or actor name above to browse
                matches instantly.
              </p>
            </div>
          ) : (
            <>
              {/* Filter Tabs & Result Summary */}
              <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium border transition-colors cursor-pointer ${
                          active
                            ? "border-primary bg-primary text-white"
                            : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                        <span
                          className={`rounded-md px-1.5 py-0.5 font-mono text-[11px] ${
                            active
                              ? "bg-white/20 text-white"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {counts[tab.id]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {data && (
                  <p className="text-xs font-mono text-muted-foreground">
                    {data.total_results.toLocaleString()} total matches for &ldquo;
                    {debouncedQuery}&rdquo;
                  </p>
                )}
              </div>

              {isLoading && page === 1 && <MediaGridSkeleton count={12} />}

              {error && (
                <div className="surface-card p-8 text-center">
                  <p className="text-sm text-rose-400">
                    Search failed. Please verify your network connection and try
                    again.
                  </p>
                </div>
              )}

              {!isLoading && filtered.length === 0 && (
                <div className="surface-card p-12 text-center">
                  <h3 className="text-base font-bold text-foreground">
                    No matching results
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try another spelling, a broader title, or switch category
                    tabs.
                  </p>
                </div>
              )}

              {filtered.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                  {filtered.map((item) => {
                    const type = getMediaType(item);
                    if (type === "movie" && "title" in item) {
                      return (
                        <MediaCard
                          key={`movie-${item.id}`}
                          id={item.id}
                          title={item.title}
                          mediaType="movie"
                          imagePath={item.poster_path}
                          rating={item.vote_average}
                          year={item.release_date}
                        />
                      );
                    }
                    if (type === "person" && "known_for_department" in item) {
                      return (
                        <MediaCard
                          key={`person-${item.id}`}
                          id={item.id}
                          title={item.name}
                          mediaType="person"
                          imagePath={item.profile_path}
                          subtitle={item.known_for_department || "Artist"}
                        />
                      );
                    }
                    if ("name" in item) {
                      return (
                        <MediaCard
                          key={`tv-${item.id}`}
                          id={item.id}
                          title={item.name}
                          mediaType="tv"
                          imagePath={"poster_path" in item ? item.poster_path : null}
                          rating={"vote_average" in item ? item.vote_average : 0}
                          year={"first_air_date" in item ? item.first_air_date : ""}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              )}

              {canLoadMore && (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={isFetching}
                    className="btn-cinema-outline px-8 py-3"
                  >
                    {isFetching ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading more...</span>
                      </>
                    ) : (
                      <span>Load More Results</span>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container-cinema pt-28 pb-16">
          <MediaGridSkeleton count={12} />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
