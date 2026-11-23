"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Play,
  Bookmark,
  Check,
  Heart,
  Share2,
  Star,
  Clock,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  User,
  Film,
} from "lucide-react";
import { useMovieDetailsBySlug } from "@/hooks";
import { useUserStore, useNotificationStore } from "@/stores";
import tmdbClient from "@/lib/tmdb-client";
import { createPersonSlug } from "@/lib/slug-utils";
import { aiService, ReviewSummary } from "@/lib/ai-services";
import { MockReviews } from "@/components/features/MockReviews";
import { WatchProviders } from "@/components/features/WatchProviders";
import { MediaCard } from "@/components/media/MediaCard";
import { TrailerModal } from "@/components/media/TrailerModal";

interface MovieDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { slug } = React.use(params);
  const [selectedVideo, setSelectedVideo] = useState<{
    key: string;
    name: string;
  } | null>(null);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const { data: movie, isLoading, error } = useMovieDetailsBySlug(slug);

  const {
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
    isInWatchlist,
    isInFavorites,
  } = useUserStore();
  const { addNotification } = useNotificationStore();

  if (isLoading) return <MovieDetailSkeleton />;
  if (error || !movie) notFound();

  const inWatchlist = isInWatchlist(movie.id);
  const inFavorites = isInFavorites(movie.id);

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
      addNotification({
        type: "info",
        title: "Removed from Watchlist",
        message: `"${movie.title}" removed from your watchlist.`,
        read: false,
      });
    } else {
      addToWatchlist({
        id: movie.id,
        type: "movie",
        status: "plan-to-watch",
        priority: "medium",
      });
      addNotification({
        type: "success",
        title: "Added to Watchlist",
        message: `"${movie.title}" saved to your watchlist.`,
        read: false,
      });
    }
  };

  const handleFavoritesToggle = () => {
    if (inFavorites) {
      removeFromFavorites(movie.id);
      addNotification({
        type: "info",
        title: "Removed from Favorites",
        message: `"${movie.title}" removed from favorites.`,
        read: false,
      });
    } else {
      addToFavorites(movie.id);
      addNotification({
        type: "success",
        title: "Added to Favorites",
        message: `"${movie.title}" saved to favorites.`,
        read: false,
      });
    }
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({
          title: movie.title,
          text: movie.tagline || `Check out ${movie.title} on Cinetron`,
          url,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        addNotification({
          type: "success",
          title: "Link Copied",
          message: "Movie link copied to your clipboard.",
          read: false,
        });
      }
    } catch {
      // User cancelled share dialog
    }
  };

  const videos =
    movie.videos?.results?.filter((v) => v.site === "YouTube") || [];
  const primaryTrailer =
    videos.find((v) => v.type === "Trailer" && v.official) ||
    videos.find((v) => v.type === "Trailer") ||
    videos[0];

  const director = movie.credits?.crew.find((p) => p.job === "Director");
  const mainCast = movie.credits?.cast.slice(0, 12) || [];
  const tmdbReviews = movie.reviews?.results || [];

  const formatRuntime = (minutes?: number) => {
    if (!minutes) return "TBA";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const formatCurrency = (amount: number) => {
    if (!amount) return "Undisclosed";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  };

  const handleSummarizeReviews = async () => {
    setIsSummarizing(true);
    try {
      const reviewTexts = tmdbReviews.map((r) => r.content).slice(0, 8);
      const summary = await aiService.summarizeReviews(movie.title, reviewTexts);
      setReviewSummary(summary);
    } catch (err) {
      console.error("Failed to summarize reviews:", err);
    } finally {
      setIsSummarizing(false);
    }
  };

  const backdropUrl = tmdbClient.getImageUrl(movie.backdrop_path, "original");
  const posterUrl = tmdbClient.getImageUrl(movie.poster_path, "w500");

  return (
    <div className="min-h-screen w-full">
      {/* ============================================================
          CINEMATIC HERO SECTION
         ============================================================ */}
      <section className="relative w-full overflow-hidden bg-[#09090b] pt-24 pb-14 lg:pt-28 lg:pb-20">
        {backdropUrl && (
          <div className="absolute inset-0">
            <Image
              src={backdropUrl}
              alt={movie.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/75 to-[#09090b]/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/95 via-[#09090b]/60 to-transparent" />
          </div>
        )}

        <div className="container-cinema relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            {/* Poster */}
            <div className="lg:col-span-3">
              <div className="relative aspect-[2/3] w-56 sm:w-64 lg:w-full mx-auto lg:mx-0 overflow-hidden rounded-2xl border border-white/15 bg-zinc-900 shadow-2xl">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={movie.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 256px, 25vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-zinc-500">
                    <Film className="h-12 w-12" />
                  </div>
                )}
              </div>
            </div>

            {/* Movie Details */}
            <div className="lg:col-span-9 text-white space-y-6">
              {/* Top Meta Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {movie.vote_average > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/30 bg-amber-500/15 px-2.5 py-1 font-semibold text-amber-300">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-mono">
                      {movie.vote_average.toFixed(1)}
                    </span>
                    <span className="text-amber-300/70 font-normal">
                      ({movie.vote_count.toLocaleString()})
                    </span>
                  </span>
                )}
                {movie.release_date && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-zinc-200 font-mono">
                    <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                    {movie.release_date.slice(0, 4)}
                  </span>
                )}
                {movie.runtime ? (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-zinc-200 font-mono">
                    <Clock className="h-3.5 w-3.5 text-zinc-400" />
                    {formatRuntime(movie.runtime)}
                  </span>
                ) : null}
                {movie.status && (
                  <span className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-zinc-300">
                    {movie.status}
                  </span>
                )}
              </div>

              {/* Title & Tagline */}
              <div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.06]">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="mt-2.5 font-display italic text-lg sm:text-xl text-zinc-300">
                    &ldquo;{movie.tagline}&rdquo;
                  </p>
                )}
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Link
                      key={genre.id}
                      href="/discover"
                      className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-medium text-zinc-100 hover:bg-white/20 transition-colors"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Synopsis */}
              {movie.overview && (
                <p className="max-w-3xl text-sm sm:text-base text-zinc-300 leading-relaxed">
                  {movie.overview}
                </p>
              )}

              {/* Director Credit */}
              {director && (
                <div className="text-sm text-zinc-400">
                  Directed by{" "}
                  <Link
                    href={`/person/${createPersonSlug(director.name, director.id)}`}
                    className="font-semibold text-white hover:text-primary transition-colors underline-offset-4 hover:underline"
                  >
                    {director.name}
                  </Link>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {primaryTrailer && (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedVideo({
                        key: primaryTrailer.key,
                        name: primaryTrailer.name,
                      })
                    }
                    className="btn-cinema px-6 py-3"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    <span>Play Trailer</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleWatchlistToggle}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold border transition-colors cursor-pointer ${
                    inWatchlist
                      ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                      : "border-white/15 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
                  }`}
                >
                  {inWatchlist ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                  <span>{inWatchlist ? "In Watchlist" : "Add to Watchlist"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleFavoritesToggle}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold border transition-colors cursor-pointer ${
                    inFavorites
                      ? "border-rose-500/40 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
                      : "border-white/15 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${inFavorites ? "fill-rose-400 text-rose-400" : ""}`}
                  />
                  <span>{inFavorites ? "Favorited" : "Favorite"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share movie"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md transition-colors cursor-pointer"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          DETAILS BODY
         ============================================================ */}
      <div className="container-cinema py-12 space-y-14">
        {/* Key Production Metrics */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Budget",
              value: formatCurrency(movie.budget),
              icon: DollarSign,
            },
            {
              label: "Box Office Revenue",
              value: formatCurrency(movie.revenue),
              icon: TrendingUp,
            },
            {
              label: "Audience Score",
              value: `${movie.vote_average.toFixed(1)} / 10`,
              sub: `${movie.vote_count.toLocaleString()} votes`,
              icon: Star,
            },
            {
              label: "Popularity Index",
              value: movie.popularity.toFixed(0),
              icon: Users,
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="surface-card p-5">
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-foreground">
                  {stat.value}
                </p>
                {stat.sub && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {stat.sub}
                  </p>
                )}
              </div>
            );
          })}
        </section>

        {/* Top Billed Cast */}
        {mainCast.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Top Billed Cast
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mainCast.map((person) => {
                const avatar = tmdbClient.getImageUrl(
                  person.profile_path || null,
                  "w300"
                );
                return (
                  <Link
                    key={person.credit_id || person.id}
                    href={`/person/${createPersonSlug(person.name, person.id)}`}
                    className="group surface-card-interactive overflow-hidden"
                  >
                    <div className="relative aspect-[3/4] w-full bg-secondary overflow-hidden">
                      {avatar ? (
                        <Image
                          src={avatar}
                          alt={person.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 18vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <User className="h-8 w-8 opacity-40" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {person.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {person.character}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Videos & Trailers */}
        {videos.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Videos &amp; Trailers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {videos.slice(0, 6).map((video) => (
                <button
                  key={video.id}
                  type="button"
                  onClick={() =>
                    setSelectedVideo({ key: video.key, name: video.name })
                  }
                  className="group relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-secondary text-left cursor-pointer"
                >
                  <Image
                    src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                    alt={video.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/15" />

                  <div className="absolute top-3 right-3 rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                    {video.type}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-white shadow-lg transition-transform duration-200 group-hover:scale-110">
                      <Play className="h-5 w-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3.5 right-3.5">
                    <p className="text-sm font-semibold text-white line-clamp-1">
                      {video.name}
                    </p>
                    {video.published_at && (
                      <p className="text-xs text-zinc-300 font-mono mt-0.5">
                        {video.published_at.slice(0, 4)}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Where to Watch */}
        <WatchProviders movieId={movie.id} />

        {/* AI Review Analysis */}
        <section className="surface-card p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  AI Review Synthesis
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Instant consensus breakdown of audience sentiment, praise, and
                  criticisms for {movie.title}.
                </p>
              </div>
            </div>

            {!reviewSummary && (
              <button
                type="button"
                onClick={handleSummarizeReviews}
                disabled={isSummarizing}
                className="btn-cinema shrink-0 self-start sm:self-auto"
              >
                {isSummarizing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Summary</span>
                  </>
                )}
              </button>
            )}
          </div>

          {reviewSummary && (
            <div className="mt-6 pt-6 border-t border-border space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-lg border px-3 py-1 text-xs font-semibold capitalize ${
                    reviewSummary.overallSentiment === "positive"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : reviewSummary.overallSentiment === "negative"
                      ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                  }`}
                >
                  Consensus: {reviewSummary.overallSentiment}
                </span>
                <span className="rounded-lg border border-border bg-secondary px-3 py-1 text-xs font-mono font-medium text-foreground">
                  Trust Score: {(reviewSummary.trustScore * 100).toFixed(0)}%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl border border-border bg-secondary/40 p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    Highlights
                  </h3>
                  <ul className="space-y-2">
                    {reviewSummary.keyPoints.positive.map((point, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-border bg-secondary/40 p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-rose-400 flex items-center gap-2">
                    <ThumbsDown className="h-4 w-4" />
                    Criticisms
                  </h3>
                  <ul className="space-y-2">
                    {reviewSummary.keyPoints.negative.map((point, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {reviewSummary.themes && reviewSummary.themes.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">
                    Themes:
                  </span>
                  {reviewSummary.themes.map((theme, i) => (
                    <span
                      key={i}
                      className="rounded-lg border border-border bg-secondary px-2.5 py-1 text-xs text-foreground"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Real TMDB + Community Reviews */}
        <MockReviews movieId={movie.id} tmdbReviews={tmdbReviews} />

        {/* Similar Movies */}
        {movie.similar && movie.similar.results.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Similar Films
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
              {movie.similar.results.slice(0, 12).map((sim) => (
                <MediaCard
                  key={sim.id}
                  id={sim.id}
                  title={sim.title}
                  mediaType="movie"
                  imagePath={sim.poster_path}
                  rating={sim.vote_average}
                  year={sim.release_date}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Accessible Trailer Modal */}
      <TrailerModal
        videoKey={selectedVideo?.key || null}
        title={selectedVideo?.name || `${movie.title} — Trailer`}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
}

function MovieDetailSkeleton() {
  return (
    <div className="min-h-screen w-full pt-24 pb-16">
      <div className="container-cinema">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-3">
            <div className="aspect-[2/3] w-56 lg:w-full mx-auto rounded-2xl bg-secondary skeleton-shimmer" />
          </div>
          <div className="lg:col-span-9 space-y-5">
            <div className="h-6 w-48 rounded-lg bg-secondary skeleton-shimmer" />
            <div className="h-12 w-3/4 rounded-xl bg-secondary skeleton-shimmer" />
            <div className="h-4 w-full max-w-2xl rounded bg-secondary skeleton-shimmer" />
            <div className="h-4 w-2/3 max-w-xl rounded bg-secondary skeleton-shimmer" />
            <div className="flex gap-3 pt-2">
              <div className="h-11 w-36 rounded-xl bg-secondary skeleton-shimmer" />
              <div className="h-11 w-40 rounded-xl bg-secondary skeleton-shimmer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
