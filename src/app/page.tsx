"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Compass,
  Film,
  Flame,
  Gamepad2,
  Grid3X3,
  Info,
  Sparkles,
  Star,
  TrendingUp,
  Tv,
  Brain,
} from "lucide-react";
import {
  useTrendingMovies,
  usePopularTVShows,
  useTopRatedMovies,
} from "@/hooks";
import tmdbClient from "@/lib/tmdb-client";
import { createMovieSlug } from "@/lib/slug-utils";
import { MediaCard, MediaGridSkeleton } from "@/components/media/MediaCard";
import { AIFeaturesShowcase } from "@/components/sections/AIFeaturesShowcase";
import { useNotificationStore, useUserStore } from "@/stores";

const cinemaGames = [
  {
    title: "Movie Quiz",
    description:
      "Timed multi-difficulty trivia generated directly from live cinema data.",
    href: "/games/quiz",
    icon: Clapperboard,
    meta: "Solo · 5 Rounds",
  },
  {
    title: "Movie Night Bingo",
    description:
      "Custom 5×5 trope boards for Action, Horror, Comedy, Sci-Fi, and Romance.",
    href: "/games/bingo",
    icon: Grid3X3,
    meta: "Party · Interactive",
  },
  {
    title: "Box Office Predictions",
    description:
      "Forecast opening weekends, review consensus, and awards season winners.",
    href: "/games/prediction",
    icon: TrendingUp,
    meta: "Strategy · Live Slate",
  },
  {
    title: "Daily Trivia",
    description:
      "AI-crafted questions covering iconic quotes, directors, and craft.",
    href: "/games/trivia",
    icon: Brain,
    meta: "Daily · Streaks",
  },
];

export default function HomePage() {
  const {
    data: trendingMovies,
    isLoading: trendingLoading,
    error: trendingError,
  } = useTrendingMovies("day");
  const { data: popularTV, isLoading: tvLoading } = usePopularTVShows(1);
  const { data: topRated, isLoading: topRatedLoading } = useTopRatedMovies(1);

  const [heroIndex, setHeroIndex] = useState(0);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useUserStore();
  const { addNotification } = useNotificationStore();

  const heroSlides =
    trendingMovies?.results?.filter((m) => m.backdrop_path).slice(0, 5) || [];
  const featured = heroSlides[heroIndex];

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const handleFeaturedWatchlist = () => {
    if (!featured) return;
    if (isInWatchlist(featured.id)) {
      removeFromWatchlist(featured.id);
      addNotification({
        type: "info",
        title: "Removed from Watchlist",
        message: `"${featured.title}" removed from your watchlist.`,
        read: false,
      });
    } else {
      addToWatchlist({ id: featured.id, type: "movie" });
      addNotification({
        type: "success",
        title: "Added to Watchlist",
        message: `"${featured.title}" added to your watchlist.`,
        read: false,
      });
    }
  };

  return (
    <div className="w-full min-h-screen">
      {/* ============================================================
          CINEMATIC FULL-BLEED FEATURED HERO
         ============================================================ */}
      <section className="relative min-h-[82vh] lg:min-h-[88vh] w-full flex items-end overflow-hidden bg-[#09090b] pt-20">
        {/* Backdrop Image */}
        <AnimatePresence mode="wait">
          {featured?.backdrop_path ? (
            <motion.div
              key={featured.id}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={
                  tmdbClient.getImageUrl(featured.backdrop_path, "original") ||
                  ""
                }
                alt={featured.title}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(229,9,20,0.18),#09090b_70%)]" />
          )}
        </AnimatePresence>

        {/* Cinematic Vignettes (Always Dark Over Hero Photography) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/55 to-[#09090b]/35" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#09090b]/95 via-[#09090b]/50 to-transparent" />

        {/* Foreground Editorial Content */}
        <div className="container-cinema relative z-10 pb-14 sm:pb-16 lg:pb-20 pt-24">
          {featured ? (
            <div className="max-w-2xl">
              {/* Eyebrow Metadata */}
              <div className="mb-4 flex flex-wrap items-center gap-2.5 text-xs font-medium text-zinc-200">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1 font-semibold uppercase tracking-wider text-white">
                  <Flame className="h-3.5 w-3.5" />
                  Trending #{heroIndex + 1}
                </span>
                {featured.vote_average > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/50 px-3 py-1 backdrop-blur-md">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-mono font-semibold">
                      {featured.vote_average.toFixed(1)}
                    </span>
                  </span>
                )}
                {featured.release_date && (
                  <span className="rounded-full border border-white/15 bg-black/50 px-3 py-1 font-mono backdrop-blur-md">
                    {featured.release_date.slice(0, 4)}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.06]">
                {featured.title}
              </h1>

              {/* Overview */}
              <p className="mt-4 text-sm sm:text-base lg:text-lg text-zinc-300 leading-relaxed line-clamp-3">
                {featured.overview}
              </p>

              {/* Working Action Buttons */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href={`/movie/${createMovieSlug(featured.title, featured.id)}`}
                  className="btn-cinema px-6 py-3 text-sm sm:text-base"
                >
                  <Info className="h-4 w-4" />
                  <span>View Details</span>
                </Link>

                <button
                  type="button"
                  onClick={handleFeaturedWatchlist}
                  className="btn-glass px-5 py-3 text-sm sm:text-base"
                >
                  {isInWatchlist(featured.id) ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" />
                      <span>In Watchlist</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4" />
                      <span>Watchlist</span>
                    </>
                  )}
                </button>

                <Link
                  href="/movies"
                  className="btn-glass px-5 py-3 text-sm sm:text-base"
                >
                  <Compass className="h-4 w-4" />
                  <span>Explore Catalog</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Editorial Cinema Companion</span>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05]">
                Discover Cinema,{" "}
                <span className="font-display italic font-semibold text-primary">
                  Reimagined
                </span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl">
                Curated trending releases, AI-assisted mood discovery,
                personal watchlists, and interactive film games — all in one
                focused space.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/movies" className="btn-cinema px-6 py-3">
                  <Film className="h-4 w-4" />
                  <span>Explore Movies</span>
                </Link>
                <Link href="/ai" className="btn-glass px-6 py-3">
                  <Sparkles className="h-4 w-4" />
                  <span>Open AI Studio</span>
                </Link>
              </div>
            </div>
          )}

          {/* Slide Navigation Controls */}
          {heroSlides.length > 1 && (
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
              <div className="flex items-center gap-2">
                {heroSlides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setHeroIndex(idx)}
                    aria-label={`Show featured movie ${slide.title}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === heroIndex
                        ? "w-8 bg-primary"
                        : "w-2 bg-white/30 hover:bg-white/55"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setHeroIndex(
                      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
                    )
                  }
                  aria-label="Previous featured movie"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-black/50 text-white hover:bg-white/15 backdrop-blur-md transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setHeroIndex((prev) => (prev + 1) % heroSlides.length)
                  }
                  aria-label="Next featured movie"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-black/50 text-white hover:bg-white/15 backdrop-blur-md transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          TRENDING MOVIES SECTION
         ============================================================ */}
      <section className="py-14 sm:py-16">
        <div className="container-cinema">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <div className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                <Flame className="h-3.5 w-3.5" />
                <span>Trending Today</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Popular in Cinema
              </h2>
            </div>

            <Link
              href="/trending"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {trendingLoading && <MediaGridSkeleton count={12} />}

          {trendingError && (
            <div className="surface-card p-8 text-center">
              <p className="text-sm text-rose-400">
                Unable to load trending movies. Please verify your TMDB API key
                in <code className="font-mono">.env.local</code>.
              </p>
            </div>
          )}

          {trendingMovies && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
              {trendingMovies.results.slice(0, 12).map((movie, index) => (
                <MediaCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  mediaType="movie"
                  imagePath={movie.poster_path}
                  rating={movie.vote_average}
                  year={movie.release_date}
                  rank={index + 1}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          POPULAR TV SERIES SECTION
         ============================================================ */}
      <section className="py-10 sm:py-14">
        <div className="container-cinema">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <div className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                <Tv className="h-3.5 w-3.5" />
                <span>Television</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Binge-Worthy Series
              </h2>
            </div>

            <Link
              href="/tv-shows"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Explore TV</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {tvLoading ? (
            <MediaGridSkeleton count={6} />
          ) : (
            popularTV && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
                {popularTV.results.slice(0, 6).map((show) => (
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
            )
          )}
        </div>
      </section>

      {/* ============================================================
          AI STUDIO SPOTLIGHT
         ============================================================ */}
      <AIFeaturesShowcase />

      {/* ============================================================
          CRITICALLY ACCLAIMED SECTION
         ============================================================ */}
      <section className="py-14 sm:py-16">
        <div className="container-cinema">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <div className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-amber-500">
                <Star className="h-3.5 w-3.5 fill-amber-500" />
                <span>Critically Acclaimed</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                All-Time Top Rated
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

          {topRatedLoading ? (
            <MediaGridSkeleton count={6} />
          ) : (
            topRated && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
                {topRated.results.slice(0, 6).map((movie) => (
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
            )
          )}
        </div>
      </section>

      {/* ============================================================
          INTERACTIVE CINEMA GAMES
         ============================================================ */}
      <section className="py-12 sm:py-16">
        <div className="container-cinema">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                <Gamepad2 className="h-3.5 w-3.5" />
                <span>Interactive</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Cinema Games &amp; Challenges
              </h2>
            </div>

            <Link
              href="/games"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>All Games</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {cinemaGames.map((game) => {
              const Icon = game.icon;
              return (
                <Link
                  key={game.title}
                  href={game.href}
                  className="group surface-card-interactive p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary text-foreground group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {game.meta}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {game.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                      {game.description}
                    </p>
                  </div>

                  <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    <span>Play now</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
