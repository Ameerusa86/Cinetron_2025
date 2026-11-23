"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Flame,
  Film,
  Tv,
  Users,
  Calendar,
  ArrowRight,
  Layers,
} from "lucide-react";
import {
  useTrendingMovies,
  useTrendingTVShows,
  useTrendingPeople,
} from "@/hooks";
import { PageHeader } from "@/components/media/PageHeader";
import { MediaCard, MediaGridSkeleton } from "@/components/media/MediaCard";

type TimeWindow = "day" | "week";
type ContentType = "all" | "movie" | "tv" | "person";

const contentTabs: {
  id: ContentType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "all", label: "All Trending", icon: Layers },
  { id: "movie", label: "Movies", icon: Film },
  { id: "tv", label: "TV Shows", icon: Tv },
  { id: "person", label: "People", icon: Users },
];

export default function TrendingPage() {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("week");
  const [contentType, setContentType] = useState<ContentType>("all");

  const showMovies = contentType === "all" || contentType === "movie";
  const showTV = contentType === "all" || contentType === "tv";
  const showPeople = contentType === "all" || contentType === "person";

  const {
    data: trendingMovies,
    isLoading: moviesLoading,
    error: moviesError,
  } = useTrendingMovies(timeWindow, showMovies);

  const {
    data: trendingTV,
    isLoading: tvLoading,
    error: tvError,
  } = useTrendingTVShows(timeWindow, showTV);

  const {
    data: trendingPeople,
    isLoading: peopleLoading,
    error: peopleError,
  } = useTrendingPeople(timeWindow, showPeople);

  return (
    <div className="min-h-screen w-full">
      <PageHeader
        eyebrow="Live Charts"
        title="Trending"
        accentWord="Now"
        description="Real-time rankings of the films, television series, and talent capturing global attention."
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Content Type Tabs */}
          <div className="flex flex-wrap gap-2">
            {contentTabs.map((tab) => {
              const Icon = tab.icon;
              const active = contentType === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setContentType(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium border transition-colors cursor-pointer ${
                    active
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Time Window Segmented Switch */}
          <div className="inline-flex self-start rounded-xl border border-border bg-card p-1">
            {(
              [
                { id: "day", label: "Today" },
                { id: "week", label: "This Week" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTimeWindow(opt.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  timeWindow === opt.id
                    ? "bg-secondary text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </PageHeader>

      <div className="container-cinema py-10 space-y-14">
        {/* Trending Movies */}
        {showMovies && (
          <section>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <div className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  <Flame className="h-3.5 w-3.5" />
                  <span>{timeWindow === "day" ? "Today" : "This Week"}</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Trending Movies
                </h2>
              </div>
              <Link
                href="/movies"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>Browse Movies</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {moviesLoading && <MediaGridSkeleton count={12} />}
            {moviesError && (
              <div className="surface-card p-6 text-center text-sm text-rose-400">
                Unable to load trending movies.
              </div>
            )}
            {trendingMovies && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                {trendingMovies.results
                  .slice(0, contentType === "movie" ? 20 : 12)
                  .map((movie, idx) => (
                    <MediaCard
                      key={movie.id}
                      id={movie.id}
                      title={movie.title}
                      mediaType="movie"
                      imagePath={movie.poster_path}
                      rating={movie.vote_average}
                      year={movie.release_date}
                      rank={idx + 1}
                    />
                  ))}
              </div>
            )}
          </section>
        )}

        {/* Trending TV Shows */}
        {showTV && (
          <section>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <div className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  <Tv className="h-3.5 w-3.5" />
                  <span>{timeWindow === "day" ? "Today" : "This Week"}</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Trending TV Series
                </h2>
              </div>
              <Link
                href="/tv-shows"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>Browse TV</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {tvLoading && <MediaGridSkeleton count={12} />}
            {tvError && (
              <div className="surface-card p-6 text-center text-sm text-rose-400">
                Unable to load trending TV shows.
              </div>
            )}
            {trendingTV && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                {trendingTV.results
                  .slice(0, contentType === "tv" ? 20 : 12)
                  .map((show, idx) => (
                    <MediaCard
                      key={show.id}
                      id={show.id}
                      title={show.name}
                      mediaType="tv"
                      imagePath={show.poster_path}
                      rating={show.vote_average}
                      year={show.first_air_date}
                      rank={idx + 1}
                    />
                  ))}
              </div>
            )}
          </section>
        )}

        {/* Trending People */}
        {showPeople && (
          <section>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <div className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  <Users className="h-3.5 w-3.5" />
                  <span>{timeWindow === "day" ? "Today" : "This Week"}</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Trending People
                </h2>
              </div>
            </div>

            {peopleLoading && <MediaGridSkeleton count={12} />}
            {peopleError && (
              <div className="surface-card p-6 text-center text-sm text-rose-400">
                Unable to load trending talent.
              </div>
            )}
            {trendingPeople && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                {trendingPeople.results
                  .slice(0, contentType === "person" ? 18 : 12)
                  .map((person, idx) => (
                    <MediaCard
                      key={person.id}
                      id={person.id}
                      title={person.name}
                      mediaType="person"
                      imagePath={person.profile_path}
                      subtitle={person.known_for_department || "Talent"}
                      rank={idx + 1}
                    />
                  ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
